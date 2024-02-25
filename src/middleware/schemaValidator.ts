import type { Schema } from "joi";
import type { RequestHandler } from "express";
import type { CustomError, JoiError, ValidationError } from "src/types";

const validationOptions = {
  abortEarly: false,
  allowUnknown: false,
  stripUnknown: false,
};

export const schemaValidator = (schema: Schema, useJoiError = true): RequestHandler => {

  return (req, res, next) => {

    const { error, value } = schema.validate(req.body, validationOptions);

    if (error) {

      const customError: CustomError = {
        status: "failed",
        error: "Invalid request. Please review request and try again.",
      };

      const joiError: JoiError = {
        status: "failed",
        error: {
          original: error._original,
          details: error.details.map(({ message, type }: ValidationError) => ({
            message: message.replace(/['"]/g, ""),
            type,
          })),
        },
      };

      return res.status(422).json(useJoiError ? joiError : customError);
    }

    // validation successful
    req.body = value;
    return next();
  };
};

