import orderModel from "../../db/models/order.model.js";
import productModel from "../../db/models/proudct.model.js"
import AppError from "../../utils/classError.js";
import asynchandler from "../../utils/asyncHandler.js"
import couponModel from "../../db/models/coupon.model.js"
import cartModel from "../../db/models/cart.model.js"
import { createInvoice } from "../../utils/pdf.js";
import sendEmail from "../../service/sendmail.js";
import { payments } from "../../utils/payment.js";
import Stripe from "stripe";





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


    ////////////////////////////invoice////////////////////////////////////////


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

    ////////////////////////////payment//////////////////////////////////////
    if (payment == "visa") {
        const stripe = new Stripe(process.env.Stripe_secret)

        if (req.body?.copoun) {
            const coupon = await stripe.coupons.create({
                percent_off: req.body.copoun.amount,
                duration: "once"
            })
            req.body.coupoId = coupon.id
        }

        const session = await payments({
            stripe,
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: req.user.email,
            metadata: {
                orderId: order._id.toString()
            },
            success_url: `${req.protocol}://${req.headers.host}/order/success/${order._id}`,
            cancel_url: `${req.protocol}://${req.headers.host}/order/cancelled/${order._id}`,
            line_items: order.products.map((product) => {
                return {
                    price_data: {
                        currency: "egp",
                        product_data: {
                            name: product.title,
                        },
                        unit_amount: product.price * 100
                    },
                    quantity: product.quantity
                }
            }),
            discounts: req.body?.copoun ? [{ coupon: req.body.coupoId }] : []
        })
        return res.json({ msg: "done", url: session.url, order })
    }
    //////////////////////////////////////////////////////////////////

    return res.json({ msg: "done", order })
})








//================================================webhook=======================================================
export const webhook = asynchandler(async (req, res, next) => {
    const stripe = new Stripe(process.env.Stripe_secret)
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.endpointSecret);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    const { orderId } = event.data.object.metadata;
    if (event.type = ! 'checkout.session.completed') {


        await orderModel.findOneAndUpdate({ _id: orderId }, { status: "reject" })
        return res.json({ msg: "failed" })
    }
    await orderModel.findOneAndUpdate({ _id: orderId }, { status: "placed" })
    return res.json({ msg: "done" })


});

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