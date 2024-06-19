const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const validateTokenHandlerUser = asyncHandler(
	async (req, res, next) => {
		let token;
		let authHeader = req.headers.authorization;
		if (authHeader && authHeader.startsWith("Bearer")) {
			token = authHeader.split(" ")[1];
			jwt.verify(
				token,
				process.env.ACCESS_TOKEN_SECRET_USER,
				(err, decoded) => {
					if (err) {
						res
							.status(
								401
							);
						throw new Error(
							"User not authorized!"
						);
					}
					req.user = decoded.user;
					next();
				}
			);
		}
		else {
			res
				.status(
					401
				)
			throw new Error(
				"Token missing!"
			)
		}
	}
);
module.exports = validateTokenHandlerUser;