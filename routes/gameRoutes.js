const express = require("express");
const router = express.Router();
const validateTokenHandlerUser = require("../middlewares/validateTokenHandlerUser");
const { startGame } = require("../controllers/gameControllers");
const { submitAnswer } = require("../controllers/gameControllers");
const { getResult } = require("../controllers/gameControllers");
router.route(
	"/startGame"
).post(
	validateTokenHandlerUser,
	startGame
);
router.route(
	"/submitAnswer"
).post(
	validateTokenHandlerUser,
	submitAnswer
);
router.route(
	"/getResult"
).get(
	validateTokenHandlerUser,
	getResult
);
module.exports = router;