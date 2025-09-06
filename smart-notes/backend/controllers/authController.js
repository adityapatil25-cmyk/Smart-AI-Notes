import User from "../models/User.js";
import Note from "../models/Note.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user profile with stats
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    
    // Get user stats
    const totalNotes = await Note.countDocuments({ user: req.user._id });
    const totalSummarized = await Note.countDocuments({ 
      user: req.user._id, 
      summary: { $exists: true, $ne: null } 
    });
    const pinnedNotes = await Note.countDocuments({ 
      user: req.user._id, 
      isPinned: true 
    });

    res.json({
      ...user.toObject(),
      stats: {
        totalNotes,
        totalSummarized,
        pinnedNotes,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};