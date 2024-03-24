import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 1 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res, next, options) =>{
        let retryAfter = res.get('RateLimit-Reset')?.toString()!;
		return res.status(options.statusCode).send({
            status: "failed",
            message: `Too many requests, please try again in ${retryAfter} sec(s).`
        })
    }
})
