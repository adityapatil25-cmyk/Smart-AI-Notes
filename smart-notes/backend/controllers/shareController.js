/*import { v4 } from "uuid";
const uuidv4 = v4;
import Note from "../models/Note.js";

// @desc    Toggle share for a note
// @route   PUT /api/notes/:id/share
// @access  Private
export const toggleShareNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note || note.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    if (note.isShared) {
      // Remove sharing
      note.isShared = false;
      note.shareId = null;
    } else {
      // Enable sharing
      note.isShared = true;
      note.shareId = uuidv4();
    }

    await note.save();

    res.json({
      message: note.isShared ? "Note shared successfully" : "Note sharing disabled",
      isShared: note.isShared,
      shareId: note.shareId,
      shareUrl: note.isShared ? `${process.env.FRONTEND_URL}/share/${note.shareId}` : null,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get shared note by shareId (PUBLIC - no auth needed)
// @route   GET /api/share/:shareId
// @access  Public
export const getSharedNote = async (req, res) => {
  try {
    const note = await Note.findOne({ 
      shareId: req.params.shareId, 
      isShared: true 
    }).populate("user", "name");

    if (!note) {
      return res.status(404).json({ message: "Shared note not found or no longer available" });
    }

    // Return note without sensitive user info
    res.json({
      _id: note._id,
      title: note.title,
      content: note.content,
      summary: note.summary,
      tags: note.tags,
      author: note.user.name,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
*/

import { v4 } from "uuid";
const uuidv4 = v4;
import Note from "../models/Note.js";

// @desc    Toggle share for a note
// @route   PUT /api/notes/:id/share
// @access  Private
export const toggleShareNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note || note.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    if (note.isShared) {
      // Remove sharing
      note.isShared = false;
      note.shareId = null;
    } else {
      // Enable sharing
      note.isShared = true;
      note.shareId = uuidv4();
    }

    await note.save();

    res.json({
      message: note.isShared ? "Note shared successfully" : "Note sharing disabled",
      isShared: note.isShared,
      shareId: note.shareId,
      shareUrl: note.isShared ? `${process.env.FRONTEND_URL}/share/${note.shareId}` : null,
    });

  } catch (error) {
    console.error("Toggle share error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get shared note by shareId (PUBLIC - no auth needed)
// @route   GET /api/share/public/:shareId
// @access  Public
export const getSharedNote = async (req, res) => {
  try {
    console.log(`Looking for shared note with shareId: ${req.params.shareId}`);
    
    const note = await Note.findOne({ 
      shareId: req.params.shareId, 
      isShared: true 
    }).populate("user", "name");

    if (!note) {
      console.log("Shared note not found");
      return res.status(404).json({ message: "Shared note not found or no longer available" });
    }

    console.log(`Found shared note: ${note.title} by ${note.user.name}`);

    // Return note without sensitive user info
    res.json({
      _id: note._id,
      title: note.title,
      content: note.content,
      summary: note.summary,
      tags: note.tags,
      author: note.user.name,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    });

  } catch (error) {
    console.error("Get shared note error:", error);
    res.status(500).json({ message: error.message });
  }
};