import { Request, Response } from "express";
import Note from "../models/Note";

export const getNotes = async (req: any, res: Response) => {
  const notes = await Note.find({ userEmail: req.user });
  res.json(notes);
};

export const createNote = async (req: any, res: Response) => {
  const { title, description } = req.body;
  const note = new Note({ title, description, userEmail: req.user });
  await note.save();
  res.status(201).json(note);
};

export const updateNote = async (req: any, res: Response) => {
  const { id } = req.params;
  const updated = await Note.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
};

export const deleteNote = async (req: any, res: Response) => {
  const { id } = req.params;
  await Note.findByIdAndDelete(id);
  res.json({ message: "Note deleted" });
};
