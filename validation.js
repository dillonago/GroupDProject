const Joi = require('@hapi/joi');

//Register validation
const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string()
            .min(4)
            .required(),
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required(),
        phone: Joi.string()
            .min(10)
            .required(),
        zip: Joi.string()
            .min(5)
            .required()
    });
    return schema.validate(data);
}

//Login validation
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    });
    return schema.validate(data);
}

//Delete validation
const deleteValidation = (data) => {
    const schema = Joi.object({
        user_1: Joi.string()
            .min(4)
            .required(),
        user_2: Joi.string()
            .min(4)
            .required(),
        response: Joi.string()
            .min(4)
            .required(),
    });
    return schema.validate(data);
}

/*
//Like validation
const likeValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    });
    return schema.validate(data);
}
*/

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.deleteValidation = deleteValidation;
//module.exports.likeValidation = likeValidation;