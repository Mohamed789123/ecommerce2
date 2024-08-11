import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

const reviewModel = model("review", reviewSchema)
export default reviewModel