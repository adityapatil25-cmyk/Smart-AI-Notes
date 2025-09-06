import Note from "../models/Note.js";

// Create a new note
export const createNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const note = await Note.create({
      title,
      content,
      tags: tags || [],
      user: req.user._id,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all notes for logged-in user with search & filter
export const getNotes = async (req, res) => {
  try {
    const { search, tag } = req.query;
    
    let query = { user: req.user._id };

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Filter by tag
    if (tag) {
      query.tags = { $in: [tag] };
    }

    const notes = await Note.find(query).sort({ 
      isPinned: -1,  // Pinned notes first
      createdAt: -1  // Then by newest
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single note by ID
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note || note.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a note
export const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note || note.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;
    note.tags = req.body.tags !== undefined ? req.body.tags : note.tags;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a note
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note || note.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    await note.deleteOne();
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle pin/unpin note
// @route   PUT /api/notes/:id/pin
// @access  Private
export const togglePinNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note || note.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.json({
      message: note.isPinned ? "Note pinned successfully" : "Note unpinned successfully",
      isPinned: note.isPinned,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/notes/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const totalNotes = await Note.countDocuments({ user: req.user._id });
    const totalSummarized = await Note.countDocuments({ 
      user: req.user._id, 
      summary: { $exists: true, $ne: null } 
    });
    const pinnedNotes = await Note.countDocuments({ 
      user: req.user._id, 
      isPinned: true 
    });

    // Get most used tags
    const tagStats = await Note.aggregate([
      { $match: { user: req.user._id } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const mostUsedTags = tagStats.map(tag => ({
      name: tag._id,
      count: tag.count
    }));

    res.json({
      totalNotes,
      totalSummarized,
      pinnedNotes,
      mostUsedTags,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};