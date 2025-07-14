import mongoose from "mongoose"; 
const userModel = new mongoose.Schema({
    fullname: {
        type: String,
        require: true,
    },

    email: {
        type: String,
        require: true,
        trim: true,
        lowtocase: true,
        unique: true,
    },

    password: {
        type: String,
        require: true,
        trim: true,
    },

    role: {
        type: String,
        require: true,
        default: "user"
    },

    passwordResetToken: {
      type: String,
    },

    passwordResetExpiration: {
      type: Date,
    },
},
{
    timeseries: true
}
);

const user = mongoose.model("user", userModel);
export default user;