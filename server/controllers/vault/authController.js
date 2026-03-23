import bcrypt from 'bcryptjs';
import User from '../../models/common/User.js';
import { generateToken } from '../../utils/generateToken.js';

const cookieOptions = (res) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 30 * 24 * 60 * 60 * 1000,
});

export const registerUser = async (req, res) => {
  try {
    const { username, password, birthYear, placeAnswer, friendAnswer } = req.body;
    if (await User.findOne({ username })) return res.status(400).json({ message: 'Username already taken' });

    const user = await User.create({
      username,
      password,
      birthYear,
      placeAnswerHash: placeAnswer ? await bcrypt.hash(placeAnswer, 10) : '',
      friendAnswerHash: friendAnswer ? await bcrypt.hash(friendAnswer, 10) : '',
    });

    res.cookie('token', generateToken(user._id), cookieOptions());
    res.status(201).json({ _id: user._id, username: user.username, birthYear: user.birthYear });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      res.cookie('token', generateToken(user._id), cookieOptions());
      return res.json({ _id: user._id, username: user.username, birthYear: user.birthYear });
    }
    res.status(401).json({ message: 'Invalid username or password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logoutUser = (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.json({ message: 'Logged out successfully' });
};

export const getMe = async (req, res) => {
  try {
    res.json(await User.findById(req.user._id).select('-password -placeAnswerHash -friendAnswerHash'));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// NEW: Verify password endpoint
export const verifyPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    res.json({ message: 'Password verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// NEW: Change password endpoint
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// NEW: Delete account endpoint
export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password. Account not deleted.' });
    }

    // Delete user and all associated data
    await User.findByIdAndDelete(req.user._id);

    // Clear auth cookie
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifySecurity = async (req, res) => {
  try {
    const { username, birthYear, placeAnswer, friendAnswer } = req.body;

    if (!username || !birthYear || !placeAnswer || !friendAnswer) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (String(user.birthYear) !== String(birthYear)) {
      return res.status(401).json({ message: 'Birth year does not match' });
    }

    const placeMatch = await bcrypt.compare(placeAnswer, user.placeAnswerHash || '');
    const friendMatch = await bcrypt.compare(friendAnswer, user.friendAnswerHash || '');

    if (!placeMatch || !friendMatch) {
      return res.status(401).json({ message: 'Security answers do not match' });
    }

    // Generate a temporary token for password reset
    const resetToken = generateToken(user._id);
    res.json({ message: 'Identity verified', token: resetToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { username, newPassword } = req.body;

    if (!username || !newPassword) {
      return res.status(400).json({ message: 'Username and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};