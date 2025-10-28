import { User } from "../model/index.js";
import { compareToken } from "../util/util.js";
import dotenv from 'dotenv';

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.auth_token;
        if(!token) {
            next('Access Denied: Not authorized to access this route');
            return;
        }
        const verifiedToken = await compareToken(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(verifiedToken.userId);
        if(!user) {
            next('User not found');
            return;
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(400).json({message: 'Invalid Token'});
    }
}

export default userAuth;