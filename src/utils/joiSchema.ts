import Joi from "joi";

export const addItemSchema = Joi.object().keys({
    quantity: Joi.number().required(),
    expiry: Joi.number().required(),
});

export const sellItemSchema = Joi.object().keys({
    quantity: Joi.number().required(),
});

