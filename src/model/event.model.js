import mongoose from "mongoose";

const eventModel = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },

    description: {
        type: String,
        require: true,
    },

    location: {
        type: String,
        require: true,
    },

    image: {
        type: String,
        require: false,
        trim: true,
    },

    startTime: {
        type: Date,
        require: true,
    },

    endTime: {
        type: Date,
        require: true
    },

    isLocked: {
        type: Boolean,
        default: false,
    },

    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        require: true,
    },
},
{
    timestamps: true,
}
);

const event = mongoose.model("event", eventModel)
export default event;