import express from "express";
import {
    register
} from '../controller/authController.js';

const router = express.Router();

router.post("/create-account", register);

export default router;