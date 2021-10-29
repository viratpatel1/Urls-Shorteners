import mongoose from "mongoose";
import shortId from "shortid";

const url = new mongoose.Schema({
    LongUrl: {
        type: String,
        required: true
    },
    ShortUrl: {
        type: String,
        required: true,
        default: shortId.generate
    },
    ClickCount: {
        type: Number,
        required: true,
        default: 0
    }
});

export const UrlModel = mongoose.model("urldata", url);