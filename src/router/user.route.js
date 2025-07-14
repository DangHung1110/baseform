import { Router } from "express";
import user from "../model/user.model.js";
import userValidator from "../validator/user.validator.js";
import UserController from "../controller/user.controller.js";
import UserService from "../service/user.service.js";
import asyncHandler from "../middleware/asyncHandler.js";
import AuthMiddleware from "../middleware/auth.middleware.js";
import { AuthUtils } from "../utils/auth.utils.js";

export default class UserRouter {
    constructor() {
        this.router = Router();
        this.UserController = new UserController(new UserService( user, AuthUtils));
        this.userValidator = new userValidator();
        this.AuthMiddleware = new AuthMiddleware();
        this.setupRouter();
    }

    setupRouter() {
          // [GET] gell all users (Admin)
        this.router.get('/', asyncHandler(this.AuthMiddleware.checkAuth), asyncHandler(this.UserController.getAllUsers))
        // [GET] get profile (Admin and User)
        this.router.get('/me', asyncHandler(this.AuthMiddleware.checkAuth), asyncHandler(this.UserController.getMe));
        // [POST] create new user (Admin)
        this.router.post('/', asyncHandler(this.AuthMiddleware.checkAdmin), asyncHandler(this.userValidator.checkUser), asyncHandler(this.UserController.addUser));
        // [DELETE] delete user by id (Admin)
        this.router.delete('/:id', asyncHandler(this.AuthMiddleware.checkAdmin), asyncHandler(this.UserController.deleteUser));
        // [PUT] update user by id (Admin || User with same id)
        this.router.put('/:id', asyncHandler(this.AuthMiddleware.checkUpdateProfile), asyncHandler(this.UserController.putUser));
    }
}