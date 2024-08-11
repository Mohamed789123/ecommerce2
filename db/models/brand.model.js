import { Schema, model } from "mongoose";


const brandSchema = new Schema({
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
    versionKey: false
})

const brandModel = model("brand", brandSchema)
export default brandModel;