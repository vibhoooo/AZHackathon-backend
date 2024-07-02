const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	max: 100, // Limit each IP to 100 requests per windowMs
	message: 'Too many requests, please try again later.'
});

module.exports = apiLimiter;
