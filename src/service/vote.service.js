import { ConflictRequestError, BadRequestError, AuthFailureError, NotFoundError } from "../handler/error.response.js";
import event from "../model/event.model.js";

export default class voteService {
    constructor() {
        this.voteModel = vote;
    }

    voteEvent = async ({ userId, eventId}) => {
        const event = await this.eventModel.findById(eventID);
        if(!event) {
            throw new NotFoundError("event not found!");
        }

        if(event.isLocked) {
            throw new ConflictRequestError("Event has been locked!")
        }

        const vote = new this.voteModel({
            event: eventId,
            user: userId,
        })

        await vote.save();
        return vote;
    }

    unVoteEvent = async({ userId, eventId}) => {
        const event = await this.eventModel.findById(eventID);
        if(!event) {
            throw new NotFoundError("event not found!");
        }

        const vote = await this.voteModel.findOne({ event: eventId, user: userId });
            if (!vote) {
                throw new NotFoundError("Vote not found");
        }

        await this.voteEvent.deleteOne({_id: vote._id});

        return {
            message: "Unvote successfully!"
        }
    }

    getVotes = async (eventId) => {
        const event = await this.eventModel.findById(eventID);
        if(!event) {
            throw new NotFoundError("event not found!");
        }

        const votes = await this.voteModel.find({ eventId }).populate('userId', 'fullname email'); 
        return votes
    }
}