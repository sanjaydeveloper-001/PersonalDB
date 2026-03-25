import Template from '../models/Template.js';
import User from '../models/common/User.js';

// Get all public templates - Return only template details (for modal display)
export const getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ isPublic: true })
      .select('_id name image usercount likescount description')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      templates,
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
    
    // Validate templateId format
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
    
    // If user hasn't selected a template, return default
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
    
    res.json({
      success: true,
      template: {
        id: template._id,
        name: template.name,
        code: template.code,
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
    
    // Validate templateId format
    if (!templateId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid template ID format' 
      });
    }

    // Verify template exists
    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ 
        success: false, 
        message: 'Template not found' 
      });
    }
    
    // Get old template ID if exists
    const user = await User.findById(req.user._id);
    const oldTemplateId = user.selectedTemplateId;

    // Update user's selected template
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { selectedTemplateId: templateId },
      { new: true }
    ).populate('selectedTemplateId');
    
    // Decrement old template usercount if it existed and is different
    if (oldTemplateId && oldTemplateId.toString() !== templateId) {
      await Template.findByIdAndUpdate(
        oldTemplateId,
        { $inc: { usercount: -1 } }
      );
    }

    // Increment new template usercount (only if it's a new selection)
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

    // Validate templateId format
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
    
    res.json({
      success: true,
      template,
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

    // Validate required fields
    if (!name || !image || !code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields: name, image, code' 
      });
    }

    // Trim and validate name
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Template name cannot be empty' 
      });
    }

    // Check if template with same name already exists
    const existingTemplate = await Template.findOne({ name: trimmedName });

    if (existingTemplate) {
      return res.status(400).json({ 
        success: false, 
        message: `Template with name "${trimmedName}" already exists` 
      });
    }

    // Create new template
    const template = new Template({
      name: trimmedName,
      image: image.trim(),
      code,
      description: (description || '').trim(),
      isPublic: true,
      usercount: 0,
      likescount: 0,
    });

    // Save template
    await template.save();

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      template: {
        _id: template._id,
        name: template.name,
        image: template.image,
        description: template.description,
        usercount: template.usercount,
        likescount: template.likescount,
        isPublic: template.isPublic,
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

    res.json({
      success: true,
      template,
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

    res.json({
      success: true,
      message: 'Template updated successfully',
      template,
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

    // Remove template reference from users who selected it
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