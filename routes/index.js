import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import authRoutes from "./authRoutes.js";
import notesRoutes from "./notesRoutes.js";

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/notes', userAuth, notesRoutes);

export default router;