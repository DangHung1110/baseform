import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export class AuthUtils {
    constructor() {} 
    hashpassword = async(password) => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash
    }

    comparePassword = async(inputpassword, hashedpassword) => {
        const check = await bcrypt.compare(inputpassword,hashedpassword);
        return check;
    }

    signAccessToken = (data) =>{
        const token = jwt.sign(data, process.env.JWT_KEY, {
            algorithm: "HS256",
            expiresIn: process.env.JWT_EXPIRE,
        });
        return token;
    }

    signRefreshToken = (data) => {
        const token = jwt.sign(data, process.env.JWT_KEY, {
            algorithm: "HS256",
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
        });
        return token;
    }

    verifyRefreshToken = (token) => {
        try {
            const payload = jwt.verify(token, process.env.JWT_KEY);
            return payload; 
        }
        catch(err) {
            throw err
        }
    }

    verifyAccessToken = (token) => {
        try {
            const payload = jwt.verify(token, process.env.JWT_KEY);
            return payload;
        }
        catch (err) {
            throw err
        }
    }

}