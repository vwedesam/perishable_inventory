import type { Request, Response, NextFunction } from "express";
import { parseError } from "../utils";
import { logger } from "./logger";

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {

    logger.error(err.message);

    const { errorCode, errorMsg } = parseError(err);
    
    return res.status(errorCode).json({ 
        status: "error",
        message: errorMsg
    });

};
