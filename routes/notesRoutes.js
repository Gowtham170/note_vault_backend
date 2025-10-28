import express from "express";
import { 
    createNote, 
    editNote,
    getAllNotes,
    deleteNote,
    updatePinStatus
} from "../controller/notesController.js";

const router = express.Router();

router.post("/add-note", createNote);
router.put("/edit-note/:noteId", editNote);
router.get("/all-notes", getAllNotes);
router.delete("/delete-note/:noteId", deleteNote);
router.patch("/update-note-pin/:noteId", updatePinStatus);

export default router;