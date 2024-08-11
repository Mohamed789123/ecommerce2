import Joi from "joi";


export const signUpValidation = {
    body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        cpassword: Joi.string().valid(Joi.ref('password')),
        age: Joi.number().required(),
        phone: Joi.array().required(),
        address: Joi.array().required()
    }).with("password", "cpassword").required()
}



export const confirmEmail = {
    params: Joi.object({
        token: Joi.string().required()
    }).required()
}



export const reconfirmEmail = {
    params: Joi.object({
        reftoken: Joi.string().required()
    }).required()
}




export const signInValidation = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    }).required()
}



export const forgetPassword = {
    body: Joi.object({
        email: Joi.string().email().required()
    }).required()
}

export const resetpassword = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        cpassword: Joi.string().valid(Joi.ref('password')),
        code: Joi.string().required()
    }).required()
}





export const getProfileValidation = {
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



export const deleteUserValidation = {
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