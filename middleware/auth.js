
import userModel from "../db/models/user.model.js";
import AppError from "../utils/classError.js";
import jwt from "jsonwebtoken"


export const auth = (roles = []) => {
    return async (req, res, next) => {
        try {
            const { token } = req.headers
            if (!token) {
                return next(new AppError("cant find token"))
            }
            if (!token.startsWith(process.env.berartoken)) {
                return next(new AppError("token is not valid"));
            }
            const newtoken = token.split(process.env.berartoken)[1]
            if (!newtoken) {
                return next(new AppError("token is not valid"));;
            }
            const decoded = jwt.verify(newtoken, process.env.payload)
            if (!decoded?.id) {
                return next(new AppError("invalid paylod"));;
            }
            const user = await userModel.findById(decoded.id)
            if (!user) {
                return next(new AppError("user not found"));;
            }
            if (!roles.includes(user.role)) {
                return next(new AppError("you dont have permition"))
            }
            if (parseInt(user?.resetPasswordAt?.getTime() / 1000) > decoded.iat) {
                return res.json({ msg: "please logIn again" })
            }

            req.user = user
            next()
        } catch (error) {
            return next(new AppError("catch error"));
        }
    }
}

auth()

