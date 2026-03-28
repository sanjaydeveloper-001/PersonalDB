import Template from '../models/Template.js';
import User from '../models/common/User.js';
import { generateSignedUrl } from './vault/uploadController.js';

// Helper to generate signed URL for a single template's image (works with plain objects)
async function processTemplateImage(templatePlain) {
  // templatePlain is already a plain object (e.g., from toObject())
  const processed = { ...templatePlain };
  if (processed.image && !processed.image.startsWith('http')) {
    try {
      processed.image = await generateSignedUrl(processed.image, 3600);
    } catch (err) {
      console.error('Failed to generate signed URL for template image:', err);
      // Keep original key as fallback
    }
  }
  return processed;
}

// Helper to process an array of templates (accepts Mongoose documents or plain objects)
async function processTemplates(templates) {
  // Convert each document to plain object first, then process
  const plainTemplates = templates.map(doc => doc.toObject ? doc.toObject() : doc);
  return Promise.all(plainTemplates.map(processTemplateImage));
}

// Get all public templates - Return only template details (for modal display)
export const getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ isPublic: true })
      .select('_id name image usercount likescount description')
      .sort({ createdAt: -1 });
    
    const processedTemplates = await processTemplates(templates);
    
    res.json({
      success: true,
      templates: processedTemplates,
    });
  } catch (error) {
    console.error('getAllTemplates error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get template code by ID - Return full template code for rendering
export const getTemplateCode = async (req, res) => {
  try {
    const { templateId } = req.params;
    
    if (!templateId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid template ID format' 
      });
    }

    const template = await Template.findById(templateId);
    
    if (!template) {
      return res.status(404).json({ 
        success: false, 
        message: 'Template not found' 
      });
    }
    
    // For code, we don't need signed URL, just return plain object
    res.json({
      success: true,
      template: {
        id: template._id,
        name: template.name,
        code: template.code,
      },
    });
  } catch (error) {
    console.error('getTemplateCode error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get user's selected template (for public profile page)
export const getUserTemplate = async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username }).populate('selectedTemplateId');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    let template = user.selectedTemplateId;
    if (!template) {
      template = await Template.findOne({ name: 'Default' });
    }
    
    if (!template) {
      return res.status(404).json({ 
        success: false, 
        message: 'No template found' 
      });
    }
    
    // Convert to plain object before processing
    const plainTemplate = template.toObject();
    const processedTemplate = await processTemplateImage(plainTemplate);
    
    res.json({
      success: true,
      template: {
        id: processedTemplate._id,
        name: processedTemplate.name,
        code: processedTemplate.code,
        image: processedTemplate.image, // signed URL
      },
    });
  } catch (error) {
    console.error('getUserTemplate error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get user's selected template ID (for current logged-in user)
export const getUserTemplatePreference = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('selectedTemplateId');
    
    res.json({
      success: true,
      templateId: user?.selectedTemplateId || null,
    });
  } catch (error) {
    console.error('getUserTemplatePreference error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Set user's template preference
export const setUserTemplate = async (req, res) => {
  try {
    const { templateId } = req.body;
    
    if (!templateId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid template ID format' 
      });
    }

    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ 
        success: false, 
        message: 'Template not found' 
      });
    }
    
    const user = await User.findById(req.user._id);
    const oldTemplateId = user.selectedTemplateId;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { selectedTemplateId: templateId },
      { new: true }
    ).populate('selectedTemplateId');
    
    if (oldTemplateId && oldTemplateId.toString() !== templateId) {
      await Template.findByIdAndUpdate(
        oldTemplateId,
        { $inc: { usercount: -1 } }
      );
    }

    if (!oldTemplateId || oldTemplateId.toString() !== templateId) {
      await Template.findByIdAndUpdate(
        templateId,
        { $inc: { usercount: 1 } }
      );
    }
    
    res.json({
      success: true,
      message: 'Template saved successfully',
      templateId: updatedUser.selectedTemplateId,
    });
  } catch (error) {
    console.error('setUserTemplate error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Like a template
export const likeTemplate = async (req, res) => {
  try {
    const { templateId } = req.body;

    if (!templateId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid template ID format' 
      });
    }
    
    const template = await Template.findByIdAndUpdate(
      templateId,
      { $inc: { likescount: 1 } },
      { new: true }
    );

    if (!template) {
      return res.status(404).json({ 
        success: false, 
        message: 'Template not found' 
      });
    }
    
    const plainTemplate = template.toObject();
    const processed = await processTemplateImage(plainTemplate);
    
    res.json({
      success: true,
      template: processed,
    });
  } catch (error) {
    console.error('likeTemplate error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Create template (Admin only)
export const createTemplate = async (req, res) => {
  try {
    const { name, image, code, description } = req.body;

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
        message: `Template with name "${trimmedName}" already exists` 
      });
    }

    const template = new Template({
      name: trimmedName,
      image: image.trim(),
      code,
      description: (description || '').trim(),
      isPublic: true,
      usercount: 0,
      likescount: 0,
    });

    await template.save();

    // Convert to plain object and generate signed URL for response
    const plainTemplate = template.toObject();
    const processed = await processTemplateImage(plainTemplate);

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      template: {
        _id: processed._id,
        name: processed.name,
        image: processed.image, // signed URL
        description: processed.description,
        usercount: processed.usercount,
        likescount: processed.likescount,
        isPublic: processed.isPublic,
      },
    });
  } catch (error) {
    console.error('createTemplate error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to create template'
    });
  }
};

// Get template details (for editing - Admin)
export const getTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;

    if (!templateId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid template ID format' 
      });
    }

    const template = await Template.findById(templateId);

    if (!template) {
      return res.status(404).json({ 
        success: false, 
        message: 'Template not found' 
      });
    }

    const plainTemplate = template.toObject();
    const processed = await processTemplateImage(plainTemplate);

    res.json({
      success: true,
      template: processed,
    });
  } catch (error) {
    console.error('getTemplate error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Update template (Admin only)
export const updateTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { name, image, code, description, isPublic } = req.body;

    if (!templateId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid template ID format' 
      });
    }

    const template = await Template.findByIdAndUpdate(
      templateId,
      {
        ...(name && { name: name.trim() }),
        ...(image && { image: image.trim() }),
        ...(code && { code }),
        ...(description !== undefined && { description: description.trim() }),
        ...(isPublic !== undefined && { isPublic }),
      },
      { new: true, runValidators: true }
    );

    if (!template) {
      return res.status(404).json({ 
        success: false, 
        message: 'Template not found' 
      });
    }

    const plainTemplate = template.toObject();
    const processed = await processTemplateImage(plainTemplate);

    res.json({
      success: true,
      message: 'Template updated successfully',
      template: processed,
    });
  } catch (error) {
    console.error('updateTemplate error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Delete template (Admin only)
export const deleteTemplate = async (req, res) => {
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

    await User.updateMany(
      { selectedTemplateId: templateId },
      { $unset: { selectedTemplateId: 1 } }
    );

    res.json({
      success: true,
      message: 'Template deleted successfully',
    });
  } catch (error) {
    console.error('deleteTemplate error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};