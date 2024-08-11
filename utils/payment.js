import Stripe from "stripe";

const stripe = new Stripe(process.env.Stripe_secret)


export async function payments({
    stripe = new Stripe(process.env.Stripe_secret),
    payment_method_types = ['card'],
    mode = 'payment',
    customer_email,
    success_url,
    cancel_url,
    metadata = {},
    line_items = [],
    discounts = []
} = {}) {

    stripe = new Stripe(process.env.Stripe_secret)

    const siession = await stripe.checkout.sessions.create({
        payment_method_types,
        mode,
        customer_email,
        success_url,
        cancel_url,
        metadata,
        line_items,
        discounts
    })
    return siession
}