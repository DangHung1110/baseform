import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import AuthController from "../controller/auth.controller.js";
import AuthService from "../service/auth.service.js";
import { AuthUtils } from "../utils/auth.utils.js";
import user from "../model/user.model.js";
import AuthMiddleware from "../middleware/auth.middleware.js";
import AuthValidate from "../validator/auth.validator.js";
import validate from "../middleware/validate.js";
export default class AuthRouter {
    constructor() {
        this.router = Router();
        this.AuthController = new AuthController(new AuthService(user, AuthUtils))
        this.AuthMiddleware = new AuthMiddleware()
        this.AuthValidate = new AuthValidate()
        this.setupRouter();
    }
    setupRouter() {
        // register
        this.router.post("/register", validate(this.AuthValidate.registerValtidate), asyncHandler(this.AuthController.register));
        // login
        this.router.post("/login", validate(this.AuthValidate.loginValidate), asyncHandler(this.AuthController.login))
        // logout
        this.router.post("/logut", asyncHandler(this.AuthController.logout))
        // forgot Pass
        this.router.post("/forgot-password", asyncHandler(this.AuthController.forgotPassword))
        // reset pass
        this.router.post("reset-password", asyncHandler(this.AuthController.resetPassword))
    }

    getRoute() {
        return this.router;
    }
}