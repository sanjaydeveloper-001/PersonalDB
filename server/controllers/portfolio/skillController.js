import Skill from '../../models/portfolio/Skill.js';

export const getSkills = async (req, res) => {
  try {
    let doc = await Skill.findOne({ user: req.user._id });

    // First-time user: create an empty document
    if (!doc) {
      doc = await new Skill({ user: req.user._id, skills: [] }).save();
    }

    // Always return { skills: [...] } — never the full Mongoose document
    // so the frontend never accidentally iterates over _id, user, createdAt, etc.
    res.json({ skills: doc.skills });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSkills = async (req, res) => {
  try {
    const { skills } = req.body; // expect { skills: [...] }

    const doc = await Skill.findOneAndUpdate(
      { user: req.user._id },
      { $set: { skills } },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ skills: doc.skills });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};