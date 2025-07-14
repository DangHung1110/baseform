import mongoose from "mongoose";
import { ConflictRequestError, BadRequestError, AuthFailureError, NotFoundError } from "../handler/error.response.js";
import { RandomToken } from "../utils/token.utils.js";
import { mailService } from "./mail.service.js";
import e from "express";

export default class AuthService {
    constructor(user, AuthUtils) {
        this.userModel = user
        this.authUtils = AuthUtils
    }

    register = async(data) => {
        const existingEmail = await this.userModel.fineOne({ email: data.email});
        if (existingEmail) {
            throw new ConflictRequestError("This emial already exist!")
        }

        const hasedPassword = await this.authUtils.hashPassword(data.password);
        const newUser = await this.userModel({
            email: data.email,
            password: hasedPassword,
            fullname: data.fullname,
            role: "user",
        })

        await newUser.save();

        const { id, fullname, email, role} = newUser;

        const user = {id, fullname, email, role}
        if (!user) {
            throw new BadRequestError("Client bab request!")
        }

        return user
    }

    login = async(data) => {
        const user = await this.userModel.fineOne({ email: data.email})
        if (user) {
            const { id, fullname, email, role} = user;
            const check = await this.authUtils.comparePassword(
                data.password,
                user.password
            )
            if(!check) {
                throw new BadRequestError("Password is incorrect!")
            } else {
                const AccessToken = await this.authUtils.signAccessToken({
                    id,
                    fullname,
                    email,
                    role
                });

                const RefreshToken = await this.authUtils.signRefreshToken({
                    id, 
                    fullname,
                    email,
                    role
                });

                const dataUser = { id, fullname, email, role}
                return {
                    data: {
                        accessToken: AccessToken,
                        refreshToken: RefreshToken,
                        user: dataUser
                    }
                }
            }
        } else {
            throw new BadRequestError("Email not found!")
        }
    }

    logout = async (token, res) => {
        if(!token) {
            throw new BadRequestError("Refresh Token not found!");
        }
        res.clearCookie("refreshToken")
    }

    refreshToken = async (req) => {
        const refreshToken = req.cookies.refreshToken;
        if( refreshToken ) {
            const { id, fullname, email, role } = this.authUtils.verifyRefreshToken(refreshToken);
            const newPayload = { id, fullname, email, role};
            const newAccessToken = this.authUtils.signAccessToken(newPayload)
            const newRefreshToken = this.authUtils.signRefreshToken(newPayload)

            return {
                data: {
                    newAccessToken: newAccessToken,
                    newRefreshToken: newRefreshToken
                },

                msg: "This is new AcessToken"
            }
        } else {
            throw new BadRequestError("RefreshToken not found!")
        }
    }

    forgotPassword = async(email) => {
        const user = await this.userModel.fineOne({email: email})
        if(!user) {
            throw new BadRequestError('Email not found!')
        }

        const token = RandomToken();
        const expires = new Date(Date.now() + 10 * 60 * 1000);
        user.passwordResetToken = token;
        user.passwordResetExpiration = expires; 
        await user.save()

        const objectMail = {
            emailForm: process.env.SMTP_USER,
            emailto: email,
            emailSubject: "Reset Password",
            emailText: `Use this OTP code to reset your password: ${token}. This OTP code will expire in 10 minutes.`
        }

        try { 
            await mailService.sendEmail(objectMail);
            return {
                success: true,
                message: "Send mail successfully!"
            }
        }
        catch(err) {
            console.error("Mail err: ", err)
            return {
                succes: false,
                errMessage: err.message
            }
        }
    }

    resetPassword = async (data) => {
        const user =  await this.userModel.fineOne({ 
            email: data.email,
            passwordResetToken: data.passwordResetToken,
            passwordResetExpiration: { $gt: new Date() },
        })

        if(!user) {
            return false
        }

        const newHashedPassword = this.authUtils.hasedPassword(data.newPassword);
        user.password = newHashedPassword;
        user.passwordResetToken = null;
        user.passwordResetExpiration = null;
        await user.save();

        return true;
    }
}