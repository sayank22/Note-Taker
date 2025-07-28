import express from "express";
import { createNote, getNotes, updateNote, deleteNote } from "../controllers/noteController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", protect, getNotes);
router.post("/", protect, createNote);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);

export default router;
