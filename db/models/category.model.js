import { Schema, model } from "mongoose";


const categorySchema = new Schema({
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
    },
    image: {
        secure_url: String,
        public_id: String
    },
    customId: String

}, {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

categorySchema.virtual("subCategory", {
    ref: "subCategory",
    localField: "_id",
    foreignField: "category"
})


const categoryModel = model("category", categorySchema)
export default categoryModel;