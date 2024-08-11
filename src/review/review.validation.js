import Joi from "joi"
import { generalFields } from "../../utils/generalFields.js";



export const addReviewValidation = {
    body: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().required()
    }).required(),
    params: Joi.object({
        productId: generalFields.id.required()
    }).required(),
    headers: generalFields.headers.required()
}

export const deleteReviewValidation = {
    params: Joi.object({
        id: generalFields.id.required()
    }).required(),
    headers: generalFields.headers.required()
}