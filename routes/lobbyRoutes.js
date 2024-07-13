const express = require("express");
const router = express.Router();
const validateTokenHandlerUser = require("../middlewares/validateTokenHandlerUser");
const apiLimiter = require("../middlewares/rateLimiter");
const { createLobby } = require("../controllers/lobbyControllers");
const { requestJoinLobby } = require("../controllers/lobbyControllers");
const { addParticipant } = require("../controllers/lobbyControllers");
const { listLobby } = require("../controllers/lobbyControllers");
router.route(
	"/createLobby"
).post(
	validateTokenHandlerUser,
	apiLimiter,
	createLobby
);
router.route(
	"/requestJoinLobby"
).post(
	// validateTokenHandlerUser,
	// apiLimiter,
	requestJoinLobby
);
router.route(
	"/addParticipant"
).post(
	validateTokenHandlerUser,
	apiLimiter,
	addParticipant
);
router.route(
	"/listLobby"
).get(
	validateTokenHandlerUser,
	apiLimiter,
	listLobby
);
module.exports = router;