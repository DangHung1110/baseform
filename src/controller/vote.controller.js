import { CREATED, OK } from '../handler/success.reponse.js'
import vote from '../model/votes.model.js'

export default class voteController {
    constructor(voteService) {
        this.voteService = voteService
    }

    getvote = async (req, res, next) => {
        const eventId = req.params.id;
        const votes = await this.voteService.getvote(eventId);
        new OK({
            message: "All votes in this event: ",
            metadata: votes,
        }).send(res)
    }

    voteEvent = async (req, res, next) => {
        const { eventId } = req.body;
        const userId = req.user.id;

        const vote = this.voteService.voteEvent({ eventId, userId });

        new CREATED({
            message: "vote successfully",
            metadata: { vote }
        }).send(res)
    }

    unVoteEvent = async (req, res, next) => {
        const eventId = req.params.eventId;
        const userId = req.user.id

        const result = await this.voteService.unVoteEvent({ eventId, userId });
        new OK({
            message: 'Vote removed successfully',
            metadata: { result }
        }).send(res);

    }
}