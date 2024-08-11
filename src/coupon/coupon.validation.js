import Joi from "joi";
import { generalFields } from "../../utils/generalFields.js";



export const addCouponValidation = {
    body: Joi.object({
        code: Joi.string().min(3).max(30).required(),
        amount: Joi.number().min(1).max(100).integer().required(),
        fromDate: Joi.date().greater(Date.now()).required(),
        toDate: Joi.date().greater(Joi.ref("fromDate")).required()
    }),
    headers: generalFields.headers.required()
}


export const updateCouponValidation = {
    body: Joi.object({
        code: Joi.string().min(3).max(30),
        amount: Joi.number().min(1).max(100).integer(),
        fromDate: Joi.date().greater(Date.now()),
        toDate: Joi.date().greater(Joi.ref("fromDate"))
    }),
    headers: generalFields.headers.required(),
    params: Joi.object({
        id: generalFields.id.required()
    })
}

