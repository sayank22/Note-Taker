import express from "express";
import Note from "../models/Notes";
import { verifyToken } from "../midllewares/verifyToken";

const router = express.Router();

// Create note
router.post("/", verifyToken, async (req, res) => {
  try {
    const note = await Note.create({
      content: req.body.content,
      user: (req as any).userId,
    });
    res.status(201).json({ note });
  } catch (err) {
    res.status(500).json({ message: "Error creating note", error: err });
  }
});

// Get all notes
router.get("/", verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ user: (req as any).userId }).sort({ createdAt: -1 });
    res.status(200).json({ notes });
  } catch (err) {
    res.status(500).json({ message: "Error fetching notes", error: err });
  }
});

// Update note
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: (req as any).userId },
      { content: req.body.content },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ note });
  } catch (err) {
    res.status(500).json({ message: "Error updating note", error: err });
  }
});

// Delete note
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: (req as any).userId,
    });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting note", error: err });
  }
});

export default router;
