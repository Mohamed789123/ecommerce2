import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.cn,
    api_key: process.env.ck,
    api_secret: process.env.cs
})

export default cloudinary