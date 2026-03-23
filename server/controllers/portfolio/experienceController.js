import Experience from '../../models/portfolio/Experience.js';

export const getExperiences = async (req, res) => {
  try {
    res.json(await Experience.find({ user: req.user._id }).sort({ id: 1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createExperience = async (req, res) => {
  try {
    res.status(201).json(await new Experience({ user: req.user._id, ...req.body }).save());
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
    if (!experience) return res.status(404).json({ message: 'Not found' });
    res.json(experience);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!experience) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
