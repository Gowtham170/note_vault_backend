import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//hashing
const hashing = async (value) => {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(value, salt);
}

//compare hashed value
const compareString = async (password, userEnterPassword) => {
    return await bcrypt.compare(password, userEnterPassword);
}

//generate JWT Token
const createToken = (id, email) => {
    const payload = {
        userId: id,
        email
    }
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
}

//compare JWT token
const compareToken = async (token) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}

export {
    hashing,
    compareString,
    createToken,
    compareToken
}