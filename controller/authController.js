import { User } from "../model/index.js";
import { createToken } from '../util/util.js';


export const register = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;
        if(!fullName) return res.status(400).json({error: true, message: "Full Name is required"});
        if(!email) return res.status(400).json({error: true, message: "Email is required"});
        if(!password) return res.status(400).json({error: true, message: "Password is required"});    
        const existingUser = await User.findOne({ email });
        if(existingUser) return res.status(400).json({error: true, message: "User already exists"});
        const user = new User({
            fullName,
            email,
            password
        });
        await user.save();
        const accessToken = createToken(user._id, user.email);
        res.cookie('auth_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        return res.status(201).json({error: false, user, message: "User registered successfully", user: { fullName: user.fullName, email: user.email }});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: true, message: "Internal Server Error"});
    }
}