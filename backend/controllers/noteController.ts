import { Response } from "express";
import Note from "../models/Note";
import { AuthRequest } from "../middlewares/authMiddleware"; // 👈 use your custom type

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const notes = await Note.find({ userEmail: req.user?.email });
    res.json({ notes });  // ✅ return an object
  } catch (err) {
    res.status(500).json({ message: "Error fetching notes" });
  }
};

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    const note = new Note({
      title,
      description,
      userEmail: req.user?.email, // 👈 use email from JWT
    });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: "Error creating note" });
  }
};

export const updateNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Note.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating note" });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await Note.findByIdAndDelete(id);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting note" });
  }
};
