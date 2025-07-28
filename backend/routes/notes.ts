import express from "express";
import { createNote, getNotes, updateNote, deleteNote } from "../controllers/noteController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", verifyToken, getNotes);
router.post("/", verifyToken, createNote);
router.put("/:id", verifyToken, updateNote);
router.delete("/:id", verifyToken, deleteNote);


export default router;
