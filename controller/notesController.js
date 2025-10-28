import { Note } from "../model/index.js";

export const createNote = async (req, res, next) => {
    try {
        const { title, content, tags } = req.body;
        if(!title) return res.status(400).json({ error: true, message: "Title is required"});
        if(!content) return res.status(400).json({ error: true, message: "Content is required"});
        const note = new Note ({
            title,
            content,
            tags: tags || [],
            createdBy: req.user._id
        });
        await note.save();
        return res.status(201).json({ error: false, message: "Note created successfully", note });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
}

export const editNote = async (req, res, next) => {
    try {
        const { title, content, tags, isPinned } = req.body;
        const { noteId } = req.params;
        if(!title && !content && !tags && isPinned === undefined) {
            return res.status(400).json({ error: true, message: "At least one field is required to update" });
        }
        if(!noteId) return res.status(400).json({ error: true, message: "Note ID is required"});
        const note = await Note.findById(noteId);
        if(!note) return res.status(404).json({ error: true, message: "Note not found" });
        if(note.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: true, message: "Unauthorized to edit this note" });
        } 
        if(title) note.title = title;
        if(content) note.content = content;
        if(tags) note.tags = tags;
        if(isPinned !== undefined) note.isPinned = isPinned;
        note.modifiedOn = new Date().getTime();
        await note.save();
        return res.status(200).json({ error: false, message: "Note updated successfully", note });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
}

export const getAllNotes = async (req, res, next) => {
    try {
        const notes = await Note.find({ createdBy: req.user._id });
        return res.status(200).json({ error: false, notes, count: notes.length, message: "Notes fetched successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

export const deleteNote = async (req, res, next) => {
    try {
        const { noteId } = req.params;
        if(!noteId) return res.status(400).json({ error: true, message: "Note ID is required"});
        const note = await Note.findById(noteId);
        if(!note) return res.status(404).json({ error: true, message: "Note not found" });
        if(note.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: true, message: "Unauthorized to delete this note" });
        }
        await note.remove();
        return res.status(200).json({ error: false, message: "Note deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
}

export const updatePinStatus = async (req, res, next) => {
    try {
        const { noteId } = req.params;
        const { isPinned } = req.body;
        if(isPinned === undefined) {
            return res.status(400).json({ error: true, message: "isPinned field is required" });
        }
        if(!noteId) return res.status(400).json({ error: true, message: "Note ID is required"});
        const note = await Note.findById(noteId);
        if(!note) return res.status(404).json({ error: true, message: "Note not found" });
        if(note.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: true, message: "Unauthorized to update this note" });
        }
        note.isPinned = isPinned;
        note.modifiedOn = new Date().getTime();
        await note.save();
        return res.status(200).json({ error: false, message: "Note pin status updated successfully", note });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
}