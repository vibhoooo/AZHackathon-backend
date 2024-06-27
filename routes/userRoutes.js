const express = require("express");
const router = express.Router();
const validateTokenHandlerUser = require("../middlewares/validateTokenHandlerUser");
const { signupUser } = require("../controllers/userControllers");
const { loginUser } = require("../controllers/userControllers");
const { logoutUser } = require("../controllers/userControllers");
router.route(
	"/signup"
).post(
	signupUser
);
router.route(
	"/login"
).post(
	loginUser
);
router.route(
	"/logout"
).post(
	logoutUser
);
module.exports = router;