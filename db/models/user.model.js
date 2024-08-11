import { Schema, model } from "mongoose";
import { systemRoles } from "../../utils/systemroles.js";

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "email is required "],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "password is required"],
        trim: true
    },
    age: {
        type: Number,
        required: [true, "age is required"],
        trim: true
    },
    phone: [String],
    address: [String],
    confirmed: {
        type: Boolean,
        default: false
    },
    loggedIn: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: Object.values(systemRoles),
        default: "user"
    },
    // profileImage: {
    //     secure_url: String,
    //     public_id: String
    // },
    code: String,
    resetPasswordAt: Date,
}, {
    timestamps: true,
    versionKey: false
})

const userModel = model("user", UserSchema)
export default userModel;
