import { Router } from "express";
import user from "../model/user.model.js";
// import userValidator from "../validator/user.validator.js";
import voteService from "../service/vote.service.js";
import voteController from "../controller/vote.controller.js";
import asyncHandler from "../middleware/asyncHandler.js";
import AuthMiddleware from "../middleware/auth.middleware.js";
import { AuthUtils } from "../utils/auth.utils.js";
import event from "../model/event.model.js";
import validate from "../middleware/validate.js";

export default class voteRouter {
    constructor() {
        this.router = Router();
        this.voteController = new voteController(new voteService);
        this.AuthMiddleware = new AuthMiddleware();
        this.setupRouter();
    }

    setupRouter() {
        // vote event
        this.router.post("/events/:id/register", validate(this.AuthMiddleware.checkAuth), asyncHandler(this.voteController.voteEvent))
        // unvote event
        this.router.delete("/events/:id/register", validate(this.AuthMiddleware.checkAuth), asyncHandler(this.voteController.unVoteEvent))
        // get vote
        this.router.get("/events/:id/registerations", validate(this.AuthMiddleware.checkAdmin), asyncHandler(this.voteController.getvote))
    }
} 