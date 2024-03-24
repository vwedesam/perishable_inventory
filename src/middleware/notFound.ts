import type { Request, Response } from "express";

export const notFoundMiddleware = (req: Request, res: Response) => {

    return res.status(404).json({ 
        status: "error",
        message: "Sorry, can't find the resource you're looking for. visit `/docs` for guide." 
    })

}
