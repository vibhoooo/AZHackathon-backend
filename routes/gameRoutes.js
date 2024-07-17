const express = require("express");
const router = express.Router();
const validateTokenHandlerUser = require("../middlewares/validateTokenHandlerUser");
const apiLimiter = require("../middlewares/rateLimiter");
const { startGame } = require("../controllers/gameControllers");
const { submitAnswer } = require("../controllers/gameControllers");
const { getResult } = require("../controllers/gameControllers");
router.route(
	"/startGame"
).post(
	// validateTokenHandlerUser,
	// apiLimiter,
	startGame
);
router.route(
	"/submitAnswer"
).post(
	validateTokenHandlerUser,
	apiLimiter,
	submitAnswer
);
router.route(
	"/getResult"
).post(
	validateTokenHandlerUser,
	apiLimiter,
	getResult
);
module.exports = router;