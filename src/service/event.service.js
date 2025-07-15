import { ConflictRequestError, BadRequestError, AuthFailureError, NotFoundError } from "../handler/error.response.js";
export default class EventService {
    constructor(event, AuthUtils) {
        this.eventModel = event;
        this.AuthUtils = AuthUtils
    }

    createEvent = async(Event) => {
        const newEvent = await this.eventModel.create(Event);
        return newEvent
    }

    updateEvent =  async(eventID, updateData) => {
        const event = await this.eventModel.findById(eventID);
        if(!event) {
            throw new NotFoundError("event not found!");
        }

        const updateEvent = await this.eventModel.findByIdAndUpdate(
            eventID, {
                title: updateData.title,
                descripsion: updateData.descripsion,
                location: updateData.location,
                image: updateData.image,
                endTime: updateData.endTime,
                isLocked: updateData.isLocked
            }, 
            { new: true }
        );
        return updateEvent;
    }

    getAllEvent = async(query) => {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 2;
        const skip = (page -1) * limit;

        const events = await this.eventModel.find({isLocked: false})
            .skip(skip)
            .limit(limit)
            .populate('creator', 'fullname email')
            .sort({ createdAt: - 1})

        return {
            page,
            limit,
            events
        }
    }

    getEventById = async(eventID) => {
        const event = await this.eventModel.findById(eventID);
        if(!event) {
            throw NotFoundError("event not found!");
        }

        await this.eventModel.deleteOne({ _id: eventID})
        return event
    }

    lockEvent = async(eventID) => {
        const event = await this.eventModel.findById(eventID);
        if(!event) {
            throw NotFoundError("event not found!");
        }

        if(event.isLocked) {
            return event
        }

        event.isLocked = true;
        await event.save();
    }

    unLockEvent = async(eventID) => {
        const event = await this.eventModel.findById(eventID);
        if(!event) {
            throw NotFoundError("event not found!");
        }

        if(!event.isLocked) {
            return event
        }

        event.isLocked = false;
        await event.save();
    }

    deleteEvent = async (eventID) => {
        const event = await this.eventModel.findById(eventID);
        if(!event) {
            throw NotFoundError("event not found!");
        }

        await this.eventModel.deleteOne({ _id: eventID})
        return event;
    }
}

