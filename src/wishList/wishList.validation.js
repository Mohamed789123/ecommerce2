import Joi from "joi";
import { generalFields } from "../../utils/generalFields.js";



export const addWishListValidation = {
    params: Joi.object({
        productId: generalFields.id.required()
    }).required(),
    headers: generalFields.headers.required()
}