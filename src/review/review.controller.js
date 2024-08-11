import orderModel from "../../db/models/order.model.js";
import productModel from "../../db/models/proudct.model.js"
import AppError from "../../utils/classError.js";
import asynchandler from "../../utils/asyncHandler.js"
import reviewModel from "../../db/models/review.model.js";




export const addReview = asynchandler(async (req, res, next) => {
    const { comment, rating } = req.body
    const { productId } = req.params
    const product = await productModel.findById(productId)
    if (!product) {
        return next(new AppError("Product not found", 404));
    }
    const order = await orderModel.findOne({ user: req.user._id, status: "deliverd" })
    if (!order) {
        return next(new AppError("u must make order first", 404));
    }
    const reviewExist = await reviewModel.findOne({ createdBy: req.user._id })
    if (reviewExist) {
        return next(new AppError("you already review this product", 404))
    }
    const review = await reviewModel.create({
        comment,
        rating,
        createdBy: req.user._id,
        productId
    })
    if (!review) {
        return next(new AppError("Failed to add review", 404));
    }

    let sum = product.rateAvg * product.rateNum
    sum = sum + rating
    product.rateAvg = sum / (product.rateNum + 1)
    product.rateNum += 1
    await product.save()

    return res.json({ msg: "done", review })
})

//=============================================================deleteReview==============================================
export const deleteReview = asynchandler(async (req, res, next) => {
    const { id } = req.params
    const review = await reviewModel.findOneAndDelete({ _id: id, createdBy: req.user._id })
    if (!review) {
        return next(new AppError("review not found", 404))
    }
    const product = await productModel.findById(review.productId)
    if (!product) {
        return next(new AppError("product not found", 404));
    }

    let sum = product.rateAvg * product.rateNum
    sum = sum - review.rating
    product.rateAvg = sum / (product.rateNum - 1)
    product.rateNum -= 1
    await product.save()

    return res.json({ msg: "done" })
})



