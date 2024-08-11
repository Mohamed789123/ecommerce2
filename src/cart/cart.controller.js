import cartModel from "../../db/models/cart.model.js";
import asynchandler from "../../utils/asyncHandler.js"
import AppError from "../../utils/classError.js";
import productModel from "../../db/models/proudct.model.js"




export const addCart = asynchandler(async (req, res, next) => {
    const { productId, quantity } = req.body;
    const product = await productModel.findOne({ _id: productId, stock: { $gte: quantity } })
    if (!product) {
        return next(new AppError("product not found", 404))
    }
    const cartExist = await cartModel.findOne({ user: req.user._id })
    if (!cartExist) {
        const newCart = await cartModel.create({ products: [{ productId, quantity }], user: req.user._id })
        return res.json({ msg: "done", newCart })
    }

    let flag = false
    for (const product of cartExist.products) {
        if (productId == product.productId) {
            product.quantity = quantity
            flag = true
        }
    }
    if (!flag) {
        cartExist.products.push({ productId, quantity })
    }
    await cartExist.save()
    return res.json({ msg: "done", newCart: cartExist })
})

//=====================================================removeCart==============================================
export const removeCart = asynchandler(async (req, res, next) => {
    const { productId } = req.body                                       //like(foor loop)
    const cart = await cartModel.findOneAndUpdate({ user: req.user._id, "products.productId": productId },
        { $pull: { products: { productId } } }, { new: true }
    )
    if (!cart) {
        return next(new AppError("product not found", 404))
    }
    return res.json({ msg: "done", cart })
})

//====================================================clearCart================================================
export const clearCart = asynchandler(async (req, res, next) => {
    const cart = await cartModel.findOneAndUpdate({ user: req.user._id }, { products: [] }, { new: true })
    if (!cart) {
        return next(new AppError("cant clear cart", 404))
    }
    return res.json({ msg: "done", cart })
})
