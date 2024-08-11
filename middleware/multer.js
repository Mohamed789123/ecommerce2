


import multer from "multer";



export const filtration = {
    image: ["image/png", "image/JPG", "image/jpeg"],
    video: ["video/mp4", "video/webm", "video/ogg"],
    audio: ["audio/mp3", "audio/wav", "audio/mpeg"],
    pdf: ["application/pdf"],
    doc: ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
}




export const multerHost = (customeValidation) => {

    const storage = multer.diskStorage({})

    const fileFilter = function (req, file, cb) {
        if (customeValidation.includes(file.mimetype)) {
            return cb(null, true)
        }
        cb(new Error("file Not Supported"), false)
    }
    const upload = multer({ fileFilter, storage })

    return upload;
}