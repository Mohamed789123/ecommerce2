import { Schema, model } from "mongoose";

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        title: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        finalPrice: {
            type: Number,
            required: true
        }
    }],
    subPrice: {
        type: Number,
        required: true
    },
    couponId: {
        type: Schema.Types.ObjectId,
        ref: "coupon"
    },
    addrres: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    payment: {
        type: String,
        enum: ["visa", "cash"],
        required: true
    },
    status: {
        type: String,
        enum: ["placed", "waitPayment", "delivered", "onWay", "cancelld", "reject"],
        default: "placed"
    },
    canceldBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    reason: String,
    totalPrice: Number
}, {
    timestamps: true,
    versionKey: false
})



const orderModel = model("order", orderSchema)
export default orderModel