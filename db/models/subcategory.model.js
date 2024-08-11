
import { Schema, model } from "mongoose";


const subCategorySchema = new Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        trim: true,
        unique: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    image: {
        secure_url: String,
        public_id: String
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    customId: String

}, {
    timestamps: true,
    versionKey: false
})

const subCategoryModel = model("subCategory", subCategorySchema)
export default subCategoryModel;