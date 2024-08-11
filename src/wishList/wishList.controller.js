import wishListModel from "../../db/models/whisList.models.js";
import productModel from "../../db/models/proudct.model.js"
import AppError from "../../utils/classError.js";
import asynchandler from "../../utils/asyncHandler.js"




export const addWishList = asynchandler(async (req, res, next) => {
    const { productId } = req.params
    const product = await productModel.findById(productId)
    if (!product) {
        return next(new AppError("Product not found", 404))
    }
    const wishList = await wishListModel.findOne({ user: req.user._id })
    if (!wishList) {
        await wishListModel.create({ user: req.user._id, products: [{ productId }] })
    } else {
        await wishListModel.updateOne({ user: req.user._id }, { $push: { products: { productId } } })
    }
    res.status(200).json({ msg: "Product added to wishlist", wishList })
})