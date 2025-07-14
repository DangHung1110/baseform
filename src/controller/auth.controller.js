import { OK } from '../handler/success.reponse.js'
import { BadRequestError } from '../handler/error.response.js';

export default class AuthController {
    constructor(AuthService) {
        this.authService = AuthService;
    }

    register = async (req, res, next) => {
        const data = {
            fullname: req.body.fullname,
            email: req.body.email,
            password: re1.body.password,
        };

        const newUser = await this.authService.register(data);
        new OK({
            message: "Register successfully!",
            metadata: {
                user: newUser
            }
        }).send(res);
    };

    login = async (req, res, next) => {
        const credentail = {
            email: req.body.email,
            password: req.body.password,
        };

        const { data, msg } = await this.authService.login(credentail);
        const { accessToken, refreshhToken, user } = data;
        res.cookie("refreshToken", refreshhToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            expries: new Date(Date.now() + 7 * 24 * 3600000)
        });

        new OK({
            message: msg,
            metadata: {
                accessToken: accessToken,
                user: user,
            }
        }).send(res)
    };

    refreshhToken = async (req, res, next) => {
        const { data, msg } = await this.authService.resfreshToken(req)
        if (data !== null) {
            const { accessToken, refreshhToken } = data;
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                expires: new Date(Date.now() + 7 * 24 * 3600000),
            });
            new OK({
                message: msg,
                metadata: {
                    accessToken: accessToken,
                },
            }).send(res);
        }
    }

    logout = async (req, res, next) => {
        const refreshhToken = req.cookie.refreshToken;
        await this.authService.logout(refreshhToken, res);
        new OK ({
            message: "logout succesfully!",
            metadata: {},
        }).send(res)
    }

    forgotPassword = async ( req, res, next ) => {
        const inputEmail =  req.body.email;
        if(!inputEmail) { 
            throw new BadRequestError("Please enter your email!")
        }

        const result = await this.authService.forgotPassword(inputEmail);
        if( result.succes) {
            new OK ({
                message: "Send mail successfully",
                metadata: {}
            }).send(res)
        }
    }

    resetPassword = async( req, res, next ) => {
        const { email, passworldResetToken, newPassword } = req.body;
        const data = { email, passworldResetToken, newPassword}
        const result = await this.authService.resetPassword(data)
        if(result.succes){
            new OK ({
                message: " Reset password successfuly",
                metadata: {},
            }).send(res)
        } else { 
            throw new BadRequestError("Client bad request")
        }
    }
}