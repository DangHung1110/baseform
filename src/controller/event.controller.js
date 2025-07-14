import { OK } from '../handler/success.reponse.js'

export default class eventController {
    constructor(EventService) {
        this.eventService = EventService;
    }
}