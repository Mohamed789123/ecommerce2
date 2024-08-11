import orderModel from "../../db/models/order.model.js";
import productModel from "../../db/models/proudct.model.js"
import AppError from "../../utils/classError.js";
import asynchandler from "../../utils/asyncHandler.js"
import couponModel from "../../db/models/coupon.model.js"
import cartModel from "../../db/models/cart.model.js"
import { createInvoice } from "../../utils/pdf.js";
import sendEmail from "../../service/sendmail.js";






export const addOrder = asynchandler(async (req, res, next) => {
    const { copounCode, phone, addrres, productId, quantity, payment } = req.body
    // let x = {}
    if (copounCode) {
        const copoun = await couponModel.findOne({ code: copounCode, usedBy: { $nin: [req.user._id] } })
        if (!copoun || copoun.toDate < Date.now()) {
            return next(new AppError("coupon is not match or expired "))
        }
        req.body.copoun = copoun
        // x = copoun
    }
    let products = []
    let flag = false

    if (productId) {
        products = [{ productId, quantity }]
    } else {
        const cart = await cartModel.findOne({ user: req.user._id })
        if (!cart.products.length) {
            return next(new AppError("cart is empty please add some product"))
        }
        products = cart.products
        flag = true
    }
    let subPrice = 0
    let finalProudct = []
    for (let product of products) {
        const checkProduct = await productModel.findOne({ _id: product.productId, stock: { $gte: product.quantity } })
        if (!checkProduct) {
            return next(new AppError("cant find product"))
        }
        if (flag) {
            product = product.toObject()
        }
        product.title = checkProduct.title
        product.price = checkProduct.price
        product.finalPrice = checkProduct.subPrice * product.quantity
        subPrice += product.finalPrice
        finalProudct.push(product)
    }

    const order = await orderModel.create({
        user: req.user._id,
        products: finalProudct,
        subPrice,
        couponId: req.body?.copoun?._id,
        totalPrice: subPrice - subPrice * ((req.body?.copoun?.amount || 0) / 100),
        payment,
        status: payment == "cash" ? "placed" : "waitPayment",
        addrres,
        phone
    })
    if (!order) {
        return next(new AppError("cant create order"))
    }

    if (req.body?.copoun) {
        await couponModel.updateOne({ _id: req.body?.copoun?._id }, { $push: { usedBy: req.user._id } })
    }
    for (let product of finalProudct) {
        await productModel.findOneAndUpdate({ _id: product.productId }, { $inc: { stock: -product.quantity } })
    }
    if (flag) {
        await cartModel.updateOne({ user: req.user._id }, { products: [] })
    }


    ////////////////////////////////////////////////////////////////////


    const invoice = {
        shipping: {
            name: req.user.name,
            address: req.user.address,
            city: "Egypt",
            state: "Cairo",
            country: "cairo",
            postal_code: 47111
        },
        items: order.products,
        subtotal: order.subPrice,
        paid: order.totalPrice,
        invoice_nr: order._id,
        date: order.createdAt,
        coupon: req.body?.copoun?.amount || 0
    };

    await createInvoice(invoice, "invoice.pdf");

    await sendEmail(req.user.email, 'order placed', `your order placed successfully`, [
        {
            path: 'invoice.pdf',
            contentType: 'application/pdf'
        }
    ])
    ///////////////////////////////////////////////////////////////////


    return res.json({ msg: "done", order })
})



//====================================================cancelOrder=================================================
export const cancelOrder = asynchandler(async (req, res, next) => {
    const { id } = req.params
    const { reason } = req.body
    const order = await orderModel.findOne({ _id: id, user: req.user._id })
    if (!order) {
        return next(new AppError("cant find order"))
    }
    if (order.payment === "cash" && order.status != "placed" || order.payment === "visa" && order.status != "waitPayment") {
        return next(new AppError("u cant canceld your order"))
    }

    await orderModel.findOneAndUpdate({ user: req.user._id }, {
        status: "cancelld",
        canceldBy: req.user._id,
        reason
    })

    if (order?.couponId) {
        await couponModel.findOneAndUpdate({ _id: order?.couponId }, {
            $pull: { usedBy: req.user._id }
        })
    }
    for (const product of order.products) {
        await productModel.findOneAndUpdate({ _id: product.productId }, {
            $inc: { stock: product.quantity }
        })
    }
    return res.json({ msg: "done" })
})