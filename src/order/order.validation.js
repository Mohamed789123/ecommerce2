import Joi from "joi"
import { generalFields } from "../../utils/generalFields.js";



export const addOrderValidation = {
    body: Joi.object({
        copounCode: Joi.string().min(3).max(30),
        phone: Joi.string().required(),
        addrres: Joi.string().required(),
        productId: generalFields.id,
        quantity: Joi.number(),
        payment: Joi.string().valid("cash", "visa").required(),
    }),
    headers: generalFields.headers.required()
}




export const cancelOrderValidation = {
    body: Joi.object({
        reason: Joi.string().required()
    }),
    params: Joi.object({
        id: generalFields.id.required()
    }),
    headers: generalFields.headers.required()
}