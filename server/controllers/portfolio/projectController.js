import Project from '../../models/portfolio/Project.js';
import { generateSignedUrl } from '../vault/uploadController.js';

export const getProjects = async (req, res) => {
  try {
    let projects = await Project.find({ user: req.user._id }).sort({ id: 1 });
    projects = await Promise.all(projects.map(async (proj) => {
      proj = proj.toObject();
      if (proj.image?.startsWith('portfolio/')) {
        proj.imageUrl = await generateSignedUrl(proj.image, 3600);
      }
      return proj;
    }));
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createProject = async (req, res) => {
  try {
    res.status(201).json(await new Project({ user: req.user._id, ...req.body }).save());
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
