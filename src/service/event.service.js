import { ConflictRequestError, BadRequestError, AuthFailureError, NotFoundError } from "../handler/error.response.js";
export default class EventService {
    constructor(event, AuthUtils) {
        this.eventModel = event;
        this.AuthUtils = AuthUtils
    }
}