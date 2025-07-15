import { Router } from "express";
import user from "../model/user.model.js";
// import userValidator from "../validator/user.validator.js";
import eventController from "../controller/event.controller.js";
import EventService from "../service/event.service.js";
import asyncHandler from "../middleware/asyncHandler.js";
import AuthMiddleware from "../middleware/auth.middleware.js";
import { AuthUtils } from "../utils/auth.utils.js";
import event from "../model/event.model.js";
import validate from "../middleware/validate.js";

export default class EventRouter {
    constructor() {
        this.router = Router();
        this.eventController = new eventController(new EventService(event, AuthUtils))
        this.AuthMiddleware = new AuthMiddleware();
        this.setupRouter();
    }

    setupRouter() {
        // create Event
        this.router.post("/events", validate(this.AuthMiddleware.checkAdmin), asyncHandler(this.eventController.createEvent))
        // update Event 
        this.router.put("/events", validate(this.AuthMiddleware.checkAdmin), asyncHandler(this.eventController.updateEvent))
        // get all event 
        this.router.get("/events", validate(this.AuthMiddleware.checkAuth), asyncHandler(this.eventController.getAllEvent))
        // get event by id
        this.router.get("/events/:id", validate(this.AuthMiddleware.checkAdmin), asyncHandler(this.eventController.getEventById))
        // delete event
        this.router.delete("/events/:id", validate(this.AuthMiddleware.checkAdmin), asyncHandler(this.eventController.deleteEvent))
        // lock event
        this.router.patch("/events/:id", validate(this.AuthMiddleware.checkAdmin), asyncHandler(this.eventController.lockEvent))
        // unlock event 
        this.router.patch("/events/:id", validate(this.AuthMiddleware.checkAdmin), asyncHandler(this.eventController.unLockEvent))
    }
}