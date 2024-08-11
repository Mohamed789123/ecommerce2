import couponModel from "../../db/models/coupon.model.js";
import asynchandler from "../../utils/asyncHandler.js"
import { nanoid } from "nanoid";
import AppError from "../../utils/classError.js";



export const addCoupon = asynchandler(async (req, res, next) => {
    const { code, amount, fromDate, toDate } = req.body
    const exist = await couponModel.findOne({ code })
    if (exist) {
        return next(new AppError("Coupon code already exist", 400))
    }
    const coupon = await couponModel.create({
        code,
        amount,
        fromDate,
        toDate,
        createdBy: req.user._id
    })
    if (!coupon) {
        return next(new AppError("Failed to create coupon", 400))
    }
    return res.status(201).json({ msg: "done", coupon });
})

//=======================================================updateCoupon========================================================
export const updateCoupon = asynchandler(async (req, res, next) => {
    const { id } = req.params
    const { code, amount, fromDate, toDate } = req.body
    const exist = await couponModel.findOne({ _id: id, createdBy: req.user._id })
    if (!exist) {
        return next(new AppError("You are not allowed to update this coupon or coupon not found", 403))
    }
    if (code) {
        if (exist.code === code) {
            return next(new AppError("Coupon code is the same", 400))
        }
        if (await couponModel.findOne({ code })) {
            return next(new AppError("coupon code already exist"))
        }
    }
    const newCoupon = await couponModel.updateOne({ code, amount, fromDate, toDate })
    if (!newCoupon) {
        return next(new AppError("Failed to update coupon", 400))
    }
    return res.status(200).json({ msg: "done", newCoupon });
})