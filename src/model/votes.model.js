import mongoose from "mongoose";

const voteModel = new mongoose.Schema({
    userID: {
        type: String,
        require: true,
    },

    eventID: {
        type: String,
        require: true,
    }
},
{
    timeseries: true,
})

const vote = mongoose.model("vote", voteModel)
export default vote;