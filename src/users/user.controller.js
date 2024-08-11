import userModel from "../../db/models/user.model.js";
import AppError from "../../utils/classError.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import cloudinary from "cloudinary"
import asynchandler from "../../utils/asyncHandler.js"
import sendEmail from "../../service/sendmail.js";
import { customAlphabet, nanoid } from "nanoid";
//==================================================signUp=============================================================
export const signUp = asynchandler(async (req, res, next) => {
    const { name, email, password, cpassword, age, phone, address } = req.body
    const exist = await userModel.findOne({ email })
    if (exist) {
        return next(new AppError("Email already exist"))
    }
    const token = jwt.sign({ email }, process.env.token, { expiresIn: 60 * 5 })
    const link = `${req.protocol}://${req.headers.host}/users/confirmEmail/${token}`
    const reftoken = jwt.sign({ email }, process.env.retoken)
    const reflink = `${req.protocol}://${req.headers.host}/users/reconfirmEmail/${reftoken}`

    const checkSendMail = await sendEmail(email, "hi", `<a href='${link}'>click to confirm your email</a> <br>
     <a href='${reflink}'>click to resend the link</a>   `)
    if (!checkSendMail) {
        return next(new AppError("Email not sent"))
    }
    const hash = bcrypt.hashSync(password, +process.env.round)
    // const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
    //     folder: "profileImages/single"
    // })
    const user = await userModel.create({ name, email, password: hash, age, phone, address })
    if (!user) {
        return next(new AppError("cant signUP try again later "))
    }
    return res.status(200).json({ msg: "done", user })
})



export const confirmEmail = asynchandler(async (req, res, next) => {

    const { token } = req.params
    const decoded = jwt.verify(token, process.env.token)
    if (!decoded?.email) {
        return next(new AppError("invalid token"))
    }
    const user = await userModel.findOneAndUpdate({ email: decoded.email, confirmed: false }, { confirmed: true }, { new: true })
    if (!user) {
        return next(new AppError("user not found or already confirmed"))
    }
    return res.json({ msg: "done" })

})

export const refConfirmEmail = asynchandler(async (req, res, next) => {
    const { reftoken } = req.params
    const decoded = jwt.verify(reftoken, process.env.retoken)
    if (!decoded?.email) {
        return next(new AppError("invalid reftoken"))
    }
    const token = jwt.sign({ email }, process.env.token, { expiresIn: 60 * 5 })
    const link = `${req.protocol}://${req.headers.host}/users/confirmEmail/${token}`
    await sendEmail(email, "hi", `<a href='${link}'>click to confirm your email</a>`)
    return res.json({ msg: "done" })
})
//==============================================signIn================================================================
export const signIn = asynchandler(async (req, res, next) => {
    const { email, password } = req.body
    const user = await userModel.findOne({ email, confirmed: true })
    if (!user) {
        return next(new AppError("user not found or not confirmed"))
    }
    const isMatch = bcrypt.compareSync(password, user.password)
    if (!isMatch) {
        return next(new AppError("wrong password"))
    }
    const token = jwt.sign({ email, id: user._id }, process.env.payload)
    if (!token) {
        return next(new AppError("cant create token "))
    }
    await userModel.findOneAndUpdate({ email, loggedIn: false }, { loggedIn: true }, { new: true })
    res.status(200).json({ msg: "done", token })
})
//=======================================================forgetPassword==========================================
export const forgetPassword = asynchandler(async (req, res, next) => {
    const { email } = req.body
    const user = await userModel.findOne({ email, confirmed: true })
    if (!user) {
        return next(new AppError("user not found or not confirmed"))
    }
    const code = customAlphabet("1234567890", +process.env.otp)
    const newCode = code()
    await sendEmail(email, "code for reset password", `<h1>your code is ${newCode}</h1>`)
    await userModel.updateOne({ email }, { code: newCode })
    return res.json({ msg: "done" })
})
//========================================================resetPassword=============================================
export const resetPassword = asynchandler(async (req, res, next) => {
    const { email, code, password, cpassword } = req.body
    const user = await userModel.findOne({ email, confirmed: true })
    if (!user) {
        return next(new AppError("user not found or not confirmed"))
    }
    if (user.code !== code) {
        return next(new AppError("code is not correct"))
    }
    const hash = bcrypt.hashSync(password, +process.env.round)
    await userModel.updateOne({ email }, { password: hash, code: "", resetPasswordAt: Date.now() }, { new: "true" })
    return res.json({ msg: "done" })
})
//============================================getData=========================================
export const getData = asynchandler(async (req, res, next) => {

    const user = await userModel.findOne({ email: req.user.email, loggedIn: true })
    if (!user) {
        return next(new AppError("cant get data"))
    }

    return res.json({ msg: "done", user })
})

//=====================================================deleteUser========================
export const deleteUser = asynchandler(async (req, res, next) => {
    const user = await userModel.findOneAndDelete({ _id: req.user.id, loggedIn: true })
    if (!user) {
        return next(new AppError("cant delete user"))
    }
    return res.json({ msg: "done" })
})