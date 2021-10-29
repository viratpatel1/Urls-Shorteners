import mongoose from "mongoose";

const passmodel = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    expireToken: Date,
});
export const UrlShortRegister = mongoose.model("UrlShortRegister", passmodel);