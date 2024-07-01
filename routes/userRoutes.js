const express = require("express");
const router = express.Router();
const apiLimiter = require("../middlewares/rateLimiter");
const { signupUser } = require("../controllers/userControllers");
const { loginUser } = require("../controllers/userControllers");
const { logoutUser } = require("../controllers/userControllers");
router.route(
	"/signup"
).post(
	apiLimiter,
	signupUser
);
router.route(
	"/login"
).post(
	apiLimiter,
	loginUser
);
router.route(
	"/logout"
).post(
	apiLimiter,
	logoutUser
);
module.exports = router;