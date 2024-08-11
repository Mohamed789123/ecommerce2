import Joi from "joi";
import { generalFields } from "../../utils/generalFields.js";



export const addCartValidation = {
    body: Joi.object({
        productId: generalFields.id.required(),
        quantity: Joi.number().integer().required()
    }).required(),
    headers: generalFields.headers.required()
}



export const removeCartValidation = {
    body: Joi.object({
        productId: generalFields.id.required(),
    }).required(),
    headers: generalFields.headers.required()
}



export const clearCartValidation = {
    headers: generalFields.headers.required()
}
