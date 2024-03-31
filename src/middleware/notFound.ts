import type { Request, Response } from "express";
import { logger } from "./logger";

export const notFoundMiddleware = (req: Request, res: Response) => {

    logger.error("404: URL/API resource not found.")

    return res.status(404).json({ 
        status: "error",
        message: "Sorry, can't find the resource you're looking for. visit `/docs` for guide." 
    })

}
