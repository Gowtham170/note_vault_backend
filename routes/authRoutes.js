import express from "express";

import {
    register,
    login,
    logout,
    resetPassword,
    getUser
} from '../controller/authController.js';

const router = express.Router();

router.post("/create-account", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/reset-password", resetPassword);
router.get("get-user", getUser);

export default router;