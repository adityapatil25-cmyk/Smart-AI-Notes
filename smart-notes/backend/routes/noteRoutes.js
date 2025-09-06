import express from "express";
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  togglePinNote,
  getDashboardStats,
} from "../controllers/noteController.js";
import { summarizeNote } from "../controllers/aiController.js";
import { exportNotePDF, exportAllNotesPDF } from "../controllers/exportController.js";
import { toggleShareNote } from "../controllers/shareController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Special routes (must be BEFORE /:id routes)
router.get("/stats", protect, getDashboardStats);
router.get("/export/all", protect, exportAllNotesPDF);

// Basic CRUD routes
router.route("/")
  .get(protect, getNotes)     // GET /api/notes
  .post(protect, createNote); // POST /api/notes

// Single note routes  
router.route("/:id")
  .get(protect, getNoteById)   // GET /api/notes/:id
  .put(protect, updateNote)    // PUT /api/notes/:id
  .delete(protect, deleteNote); // DELETE /api/notes/:id

// Feature routes (specific actions)
router.put("/:id/pin", protect, togglePinNote);        // PUT /api/notes/:id/pin
router.post("/:id/summarize", protect, summarizeNote); // POST /api/notes/:id/summarize
router.put("/:id/share", protect, toggleShareNote);    // PUT /api/notes/:id/share  
router.get("/:id/export", protect, exportNotePDF);     // GET /api/notes/:id/export

export default router;