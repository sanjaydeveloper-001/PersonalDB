import Template from '../models/Template.js';

// Get all templates (with stats)
export const getAllTemplatesAdmin = async (req, res) => {
  try {
    const templates = await Template.find()
      .sort({ createdAt: -1 });
    
    const stats = {
      total: templates.length,
      public: templates.filter(t => t.isPublic).length,
      private: templates.filter(t => !t.isPublic).length,
      totalUsers: templates.reduce((sum, t) => sum + t.usercount, 0),
      totalLikes: templates.reduce((sum, t) => sum + t.likescount, 0),
    };

    res.json({
      success: true,
      stats,
      templates,
    });
  } catch (error) {
    console.error('getAllTemplatesAdmin error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Create template
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
      image: image.trim(),
      code,
      description: (description || '').trim(),
      isPublic: isPublic !== undefined ? isPublic : true,
    });

    await template.save();

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      template,
    });
  } catch (error) {
    console.error('createTemplateAdmin error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get single template
export const getTemplateAdmin = async (req, res) => {
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

    res.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error('getTemplateAdmin error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Update template
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

    res.json({
      success: true,
      message: 'Template updated successfully',
      template,
    });
  } catch (error) {
    console.error('updateTemplateAdmin error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Delete template
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