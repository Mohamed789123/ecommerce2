import Joi from "joi";
import { generalFields } from "../../utils/generalFields.js";




export const addProductValidation = {
    body: Joi.object({
        title: Joi.string().max(50).required(),
        description: Joi.string().max(50).required(),
        category: generalFields.id.required(),
        subCategory: generalFields.id.required(),
        brand: generalFields.id.required(),
        price: Joi.number().integer().min(1).required(),
        discount: Joi.number().min(1).max(100).required(),
        stock: Joi.number().integer().required()
    }).required(),
    // files: Joi.object({
    //     image: Joi.array().items(generalFields.file.required()).required(),
    //     coverImages: Joi.array().items(generalFields.file.required()).required()
    // }).required(),
    headers: generalFields.headers.required()
}


export const updateProductValidation = {
    body: Joi.object({
        title: Joi.string().max(50),
        description: Joi.string().max(50),
        category: generalFields.id.required(),
        subCategory: generalFields.id.required(),
        brand: generalFields.id.required(),
        price: Joi.number().integer().min(1),
        discount: Joi.number().min(1).max(100),
        stock: Joi.number().integer()
    }).required(),
    // files: Joi.object({
    //     image: Joi.array().items(generalFields.file.required()).required(),
    //     coverImages: Joi.array().items(generalFields.file.required()).required()
    // }).required(),
    headers: generalFields.headers.required(),
    params: Joi.object({
        id: generalFields.id.required()
    }).required()
} 