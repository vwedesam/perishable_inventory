import Joi from "joi";

export const addItemSchema = Joi.object().keys({
    quantity: Joi.number().min(1).required(),
    expiry: Joi.number().min(1).required(),
});

export const sellItemSchema = Joi.object().keys({
    quantity: Joi.number().min(1).required(),
});

