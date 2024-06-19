const express = require("express");
const router = express.Router();
const validateTokenHandlerUser = require("../middlewares/validateTokenHandlerUser");
const { createLobby } = require("../controllers/lobbyControllers");
const { requestJoinLobby } = require("../controllers/lobbyControllers");
const { addParticipant } = require("../controllers/lobbyControllers");
const { listLobby } = require("../controllers/lobbyControllers");
router.route(
	"/createLobby"
).post(
	validateTokenHandlerUser,
	createLobby
);
router.route(
	"/requestJoinLobby"
).post(
	validateTokenHandlerUser,
	requestJoinLobby
);
router.route(
	"/addParticipant"
).post(
	validateTokenHandlerUser,
	addParticipant
);
router.route(
	"/listLobby"
).get(
	// validateTokenHandlerUser,
	listLobby
);
module.exports = router;