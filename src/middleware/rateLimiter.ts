import rateLimit from "express-rate-limit";
import { logger } from "./logger";

export const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 1 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res, next, options) =>{
        const retryAfter = res.get('RateLimit-Reset')?.toString()!;
        const msg = `Too many requests, please try again in ${retryAfter} sec(s).`;
        logger.warn(`ip: ${req?.ip}, msg: ${msg}`);
		return res.status(options.statusCode).send({
            status: "failed",
            message: msg
        })
    }
})
