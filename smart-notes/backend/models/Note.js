import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // linked with User model
      required: true,
    },
    summary: {
      type: String,
      default: null, // AI-generated summary
    },
    tags: [{
      type: String,
      trim: true,
    }], // Array of tags
    isPinned: {
      type: Boolean,
      default: false,
    },
     isShared: {
      type: Boolean,
      default: false,
    },
    shareId: {
      type: String,
      unique: true,
      sparse: true, // Only enforce uniqueness when value exists
    },
  },
  { timestamps: true }
);

// Index for better search performance
noteSchema.index({ title: 'text', content: 'text', tags: 'text' });

const Note = mongoose.model("Note", noteSchema);
export default Note;
