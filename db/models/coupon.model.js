import { Schema, model } from "mongoose";


const couponSchema = new Schema({
    code: {
        type: String,
        required: [true, "coupon is required"],
        unique: true,
        trim: true,
    },
    amount: {
        type: Number,
        required: [true, "amount is required"],
        min: 1,
        max: 100
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    usedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
    }],
    fromDate: {
        type: Date,
        required: [true, "fromDate is true"]
    },
    toDate: {
        type: Date,
        required: [true, "toDate is true"]
    }
}, {
    timestamps: true,
    versionKey: false
})

const couponModel = model("coupon", couponSchema)
export default couponModel