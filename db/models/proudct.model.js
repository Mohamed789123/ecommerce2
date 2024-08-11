import { Schema, model } from "mongoose";

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    image: {
        secure_url: String,
        public_id: String
    },
    coverImages: [{
        secure_url: String,
        public_id: String
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    subCategory: {
        type: Schema.Types.ObjectId,
        ref: 'subCategory',
        required: true
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'brand',
        required: true
    },
    customId: String,
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 1,
        required: true
    },
    subPrice: {
        type: Number,
        default: 1
    },
    rateAvg: {
        type: Number,
        default: 0
    },
    rateNum: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true,
    versionKey: false
})


const productModel = model("product", productSchema)
export default productModel