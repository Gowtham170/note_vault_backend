import { User } from "../model/index.js";
import { compareString, createToken, hashing } from '../util/util.js';


export const register = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;
        if(!fullName) return res.status(400).json({error: true, message: "Full Name is required"});
        if(!email) return res.status(400).json({error: true, message: "Email is required"});
        if(!password) return res.status(400).json({error: true, message: "Password is required"});    
        const existingUser = await User.findOne({ email });
        if(existingUser) return res.status(400).json({error: true, message: "User already exists"});
        const hashedPassword = await hashing(password); //hashing password before saving
        const user = new User({
            fullName,
            email,
            password: hashedPassword
        });
        await user.save();
        const accessToken = createToken(user._id, user.email);
        res.cookie('auth_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        return res.status(201).json({error: false, message: "User registered successfully", user: { fullName: user.fullName, email: user.email }});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: true, message: "Internal Server Error"});
    }
}

export const login = async (req,res,next) => {
    try {
         const { email, password } = req.body;
        if(!email) return res.status(400).json({error: true, message: "Email is required"});
        if(!password) return res.status(400).json({error: true, message: "Password is required"});
        const userInfo = await User.findOne({ email });
        if(!userInfo) return res.status(400).json({error: true, message: "User not found"});
        //compare password
        if(!await compareString(password, userInfo.password)) {
            return res.status(400).json({error: true, message: "Invalid credential"});
        }
        const accessToken = createToken(userInfo._id, userInfo.email);
        res.cookie('auth_token', accessToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        return res.status(200).json({error: false, message: "Login successful", user: { fullName: userInfo.fullName, email: userInfo.email }});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: true, message: "Internal Server Error"});
    }
}

export const logout = async (req, res, next) => {
    try {
        res.clearCookie("auth_token");
        return res.status(200).json({ error: false, message: "Logout successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
}

export const resetPassword = async (req, res, next) => {
    try {
        const { email, currentPassword, newPassword } = req.body;
        if(!email) return res.status(400).json({ error: true, message: "Email is required" });
        if(!currentPassword) return res.status(400).json({ error: true, message: "Current Password is required" });
        if(!newPassword) return res.status(400).json({ error: true, message: "New Password is required" });
        const user = await User.findOne({ email });
        if(!user) return res.status(400).json({ error: true, message: "User not found"});
        //compare current password
        if(!await compareString(currentPassword, user.password)) {
            return res.status(400).json({ error: true, message: "Current Password is incorrect" });
        }
        //hash new password
        const hashedNewPassword = await hashing(newPassword);
        user.password = hashedNewPassword;
        await user.save();
        return res.status(200).json({ error: false, message: "Password reset successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
}

export const getUser = async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
}