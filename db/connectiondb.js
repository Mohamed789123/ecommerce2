import mongoose from "mongoose";

const connectiondb = async () => {
    return await mongoose.connect(process.env.dbOnline)
        .then(() => {
            console.log("DB connected")
        }).catch((err) => {
            console.log({ msg: "catch error", err })
        })
}

export default connectiondb