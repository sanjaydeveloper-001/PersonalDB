import Interest from '../../models/portfolio/Interest.js';

export const getInterests = async (req, res) => {
  try {
    let interests = await Interest.findOne({ user: req.user._id });
    if (!interests) interests = await new Interest({ user: req.user._id, interests: [] }).save();
    res.json(interests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateInterests = async (req, res) => {
  try {
    let interests = await Interest.findOne({ user: req.user._id });
    if (!interests) {
      interests = new Interest({ user: req.user._id, ...req.body });
    } else {
      Object.assign(interests, req.body);
    }
    await interests.save();
    res.json(interests);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
