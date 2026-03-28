import Template from '../models/Template.js';
import { generateSignedUrl } from './vault/uploadController.js'; // Adjust path as needed

// Helper: Process a single template – replaces image with signed URL if needed
async function processTemplateImage(template) {
  // Create a copy to avoid mutating the original object if it's from the database
  const processed = { ...template };
  if (processed.image && !processed.image.startsWith('http')) {
    try {
      processed.image = await generateSignedUrl(processed.image, 3600);
    } catch (err) {
      console.error('Failed to generate signed URL for template image:', err);
      // Fallback to original value (e.g., if not a valid S3 key)
      processed.image = template.image;
    }
  }
  return processed;
}

// Helper: Process multiple templates in parallel
async function processTemplates(templates) {
  return Promise.all(templates.map(processTemplateImage));
}

// Get all templates (with stats) – returns signed URLs for images
export const getAllTemplatesAdmin = async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 }).lean();
    const processedTemplates = await processTemplates(templates);

    const stats = {
      total: processedTemplates.length,
      public: processedTemplates.filter(t => t.isPublic).length,
      private: processedTemplates.filter(t => !t.isPublic).length,
      totalUsers: processedTemplates.reduce((sum, t) => sum + (t.usercount || 0), 0),
      totalLikes: processedTemplates.reduce((sum, t) => sum + (t.likescount || 0), 0),
    };

    res.json({
      success: true,
      stats,
      templates: processedTemplates,
    });
  } catch (error) {
    console.error('getAllTemplatesAdmin error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Create template – store raw key/URL, return processed (signed URL in image field)
export const createTemplateAdmin = async (req, res) => {
  try {
    const { name, image, code, description, isPublic } = req.body;

    if (!name || !image || !code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields: name, image, code' 
      });
    }

    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Template name cannot be empty' 
      });
    }

    const existingTemplate = await Template.findOne({ name: trimmedName });
    if (existingTemplate) {
      return res.status(400).json({ 
        success: false, 
        message: `Template "${trimmedName}" already exists` 
      });
    }

    const template = new Template({
      name: trimmedName,
      image: image.trim(), // Store raw key (e.g., "templates/abc.jpg") or full URL
      code,
      description: (description || '').trim(),
      isPublic: isPublic !== undefined ? isPublic : true,
    });

    await template.save();

    // Return the template with the image field replaced by signed URL (if needed)
    const processed = await processTemplateImage(template.toObject());

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      template: processed,
    });
  } catch (error) {
    console.error('createTemplateAdmin error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get single template – returns with signed URL in image field
export const getTemplateAdmin = async (req, res) => {
  try {
    const { templateId } = req.params;

    if (!templateId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid template ID format' 
      });
    }

    const template = await Template.findById(templateId).lean();
    if (!template) {
      return res.status(404).json({ 
        success: false, 
        message: 'Template not found' 
      });
    }

    const processed = await processTemplateImage(template);

    res.json({
      success: true,
      template: processed,
    });
  } catch (error) {
    console.error('getTemplateAdmin error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Update template – store raw key/URL, return processed (signed URL in image field)
export const updateTemplateAdmin = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { name, image, code, description, isPublic } = req.body;

    if (!templateId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid template ID format' 
      });
    }

    if (name) {
      const existingTemplate = await Template.findOne({ 
        name: name.trim(),
        _id: { $ne: templateId }
      });
      if (existingTemplate) {
        return res.status(400).json({ 
          success: false, 
          message: 'Template name already in use' 
        });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (image !== undefined) updateData.image = image.trim(); // store raw key or URL
    if (code !== undefined) updateData.code = code;
    if (description !== undefined) updateData.description = description.trim();
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    const template = await Template.findByIdAndUpdate(
      templateId,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!template) {
      return res.status(404).json({ 
        success: false, 
        message: 'Template not found' 
      });
    }

    const processed = await processTemplateImage(template);

    res.json({
      success: true,
      message: 'Template updated successfully',
      template: processed,
    });
  } catch (error) {
    console.error('updateTemplateAdmin error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Delete template – no image processing needed
export const deleteTemplateAdmin = async (req, res) => {
  try {
    const { templateId } = req.params;

    if (!templateId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid template ID format' 
      });
    }

    const template = await Template.findByIdAndDelete(templateId);

    if (!template) {
      return res.status(404).json({ 
        success: false, 
        message: 'Template not found' 
      });
    }

    res.json({
      success: true,
      message: 'Template deleted successfully',
    });
  } catch (error) {
    console.error('deleteTemplateAdmin error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};