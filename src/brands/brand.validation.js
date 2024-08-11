import Joi from "joi";
import mongoose from "mongoose";

const objectIdValidation = (value, helper) => {
    return mongoose.Types.ObjectId.isValid(value) ? true : helper.message("invalid id")
}


export const addBrandValidation = {
    body: Joi.object({
        name: Joi.string().required(),
    }).required(),
    // file: Joi.object({
    //     size: Joi.number().positive().required(),
    //     path: Joi.string().required(),
    //     filename: Joi.string().required(),
    //     mimetype: Joi.string().required(),
    //     encoding: Joi.string().required(),
    //     destenation: Joi.string().required(),
    //     originalname: Joi.string().required(),
    //     fieldname: Joi.string().required()
    // }).required(),
    headers: Joi.object({
        token: Joi.string().required(),
        'cache-control': Joi.string(),
        'content-type': Joi.string(),
        'content-length': Joi.string(),
        accept: Joi.string(),
        'accept-encoding': Joi.string(),
        host: Joi.string(),
        connection: Joi.string(),
        'user-agent': Joi.string(),
        'postman-token': Joi.string(),
    }).required()
}

export const getBrand = {
    headers: Joi.object({
        token: Joi.string().required(),
        'cache-control': Joi.string(),
        'content-type': Joi.string(),
        'content-length': Joi.string(),
        accept: Joi.string(),
        'accept-encoding': Joi.string(),
        host: Joi.string(),
        connection: Joi.string(),
        'user-agent': Joi.string(),
        'postman-token': Joi.string(),
    }).required(),
    params: Joi.object({
        name: Joi.string().required()
    }).required()
}


export const updateBrandValidation = {
    body: Joi.object({
        name: Joi.string(),
    }).required(),
    // file: Joi.object({
    //     size: Joi.number().positive().required(),
    //     path: Joi.string().required(),
    //     filename: Joi.string().required(),
    //     mimetype: Joi.string().required(),
    //     encoding: Joi.string().required(),
    //     destenation: Joi.string().required(),
    //     originalname: Joi.string().required(),
    //     fieldname: Joi.string().required()
    // }).required(),
    headers: Joi.object({
        token: Joi.string().required(),
        'cache-control': Joi.string(),
        'content-type': Joi.string(),
        'content-length': Joi.string(),
        accept: Joi.string(),
        'accept-encoding': Joi.string(),
        host: Joi.string(),
        connection: Joi.string(),
        'user-agent': Joi.string(),
        'postman-token': Joi.string(),
    }).required(),
    params: Joi.object({
        id: Joi.string().custom(objectIdValidation).required()
    }).required()
}


export const deleteBrandvalidation = {
    headers: Joi.object({
        token: Joi.string().required(),
        'cache-control': Joi.string(),
        'content-type': Joi.string(),
        'content-length': Joi.string(),
        accept: Joi.string(),
        'accept-encoding': Joi.string(),
        host: Joi.string(),
        connection: Joi.string(),
        'user-agent': Joi.string(),
        'postman-token': Joi.string(),
    }).required(),
    params: Joi.object({
        id: Joi.string().custom(objectIdValidation).required()
    }).required()
}