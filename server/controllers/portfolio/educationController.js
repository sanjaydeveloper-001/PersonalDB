import Education from '../../models/portfolio/Education.js';

export const getEducations = async (req, res) => {
  try {
    res.json(await Education.find({ user: req.user._id }).sort({ id: 1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createEducation = async (req, res) => {
  try {
    res.status(201).json(await new Education({ user: req.user._id, ...req.body }).save());
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateEducation = async (req, res) => {
  try {
    const education = await Education.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
    if (!education) return res.status(404).json({ message: 'Not found' });
    res.json(education);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteEducation = async (req, res) => {
  try {
    const education = await Education.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!education) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
