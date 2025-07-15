import { CREATED, OK } from '../handler/success.reponse.js'
import event from '../model/event.model.js';

export default class eventController {
    constructor(EventService) {
        this.eventService = EventService;
    }

    createEvent = async (req, res, next) => {
        try {
            const { title, description, location, startTime, endTime, isLocked } = req.body;
            const imageURL = req.file?.path || null;

            const newEvent = new this.eventService.createEvent({
                title,
                description,
                location,
                startTime,
                endTime,
                isLocked,
                image: imageURL,
                createBy: {
                    id: id,
                    fullname: fullname,
                }
            });
            new CREATED({
                message: "Add event successfully!",
                metadata: {
                    event: newEvent,
                }
            })
        }
        catch (err) {
            next(err);
        }
    }

    updateEvent = async (req, res, next) => {
        try {
            const creator = req.user.id;
            const eventId = req.params.eventId;
            const { title, description, location, startTime, endTime, expiresAt, isLocked } = req.body;

            const updateData = {
                title,
                description,
                location,
                startTime,
                endTime,
                expiresAt,
                isLocked,
                creator
            };

            const updatedEvent = await this.eventService.updateEvent(eventId, updateData)
            new OK({
                message: 'event updated successfully',
                metadata: {
                    event: updatedEvent
                }
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async deleteEvent(req, res, next) {
        try {
            const eventId = req.params.eventId;
            await this.eventService.deleteEvent(eventId);
            new OK({
                message: 'event deleted successfully'
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async getAllEvent(req, res, next) {
        try {
            const events = await this.eventService.getAllEvent(req.query);
            new OK({
                message: 'evens retrieved successfully',
                metadata: {
                    events
                }
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async getEventById(req, res, next) {
        try {
            const eventId = req.params.eventId;
            const event = await this.eventService.getEventById(eventId);
            new OK({
                message: 'event retrieved successfully',
                metadata: {
                    event
                }
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    lockEvent = async (req, res, next) => {
        try {
            const eventId = req.params.id;
            const result = await this.eventService.lockEvent(eventId);
            new OK({
                message: "lock event successfully!",
                metadata: result,
            })
        } catch (err) {
            next(err);
        }
    }

    unLockEvent = async (req, res, next) => {
        try {
            const eventId = req.params.id;
            const result = await this.eventService.lockEvent(eventId);
            new OK({
                message: "unlock event successfully!",
                metadata: result,
            })
        } catch (err) {
            next(err);
        }
    }

}