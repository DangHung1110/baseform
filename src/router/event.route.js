import { Router } from "express";
import user from "../model/user.model.js";
// import userValidator from "../validator/user.validator.js";
import eventController from "../controller/event.controller.js";
import EventService from "../service/event.service.js";
import asyncHandler from "../middleware/asyncHandler.js";
import AuthMiddleware from "../middleware/auth.middleware.js";
import { AuthUtils } from "../utils/auth.utils.js";
import event from "../model/event.model.js";

export default class EventRouter {
    constructor() {
        this.router = Router();
        this.eventController = new eventController(new EventService(event, AuthUtils))
        this.AuthMiddleware = new AuthMiddleware();
        this.setupRouter();
    }

    setupRouter() {

    }
}