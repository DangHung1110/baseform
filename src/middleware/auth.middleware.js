import { AuthFailureError } from "../handler/error.response.js";
import jwt from "jsonwebtoken"

export default class AuthMiddleware {
    constructor() {}

    checkAuth = async(req, res, next) => {
        try {
            const bearerToken = req.headers["authorization"];
            if(!bearerToken) {
                throw new AuthFailureError("You 're not authenticated!")
            }

            const token = bearerToken.split("")[1];
            try {
                var decode = jwt.verify(token. process.env.JWT_KEY);
                req.user = decode;
                next();
            }
            catch(err) {
                throw new AuthFailureError("Token is expired")
            }
        }
        catch(err) {
            next(err)
        }
    }

    checkAdmin = async(req, res, next) => {
        this.checkAuth(req, res, async(err)=> {
            if( err ) return next(err)
            try {
                if(req.user.role == "admin") {
                    next();
                } else {
                    throw new AuthFailureError("You 're not allowed to do that")
                }
            }
            catch(err) {
                next(err)
            }
        })
    }

    checkUpdateProfile = async (req, res, next) => {
        this.checkAuth(req, res, async(err) => {
            if(err) return next(err)
            try {
                const id = req.params.id
                if(req.user.role == "admin") {
                    next();
                } else {
                    if(id = req.user.id) {
                        next();
                    } else {
                        throw new AuthFailureError("You 're not allowed to do that")
                    }
                }
            }
            catch(err) {
                next(err);
            }
        })
    }
} 