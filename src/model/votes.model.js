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