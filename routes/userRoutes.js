const express = require("express");
const router = express.Router();
const validateTokenHandlerUser = require("../middlewares/validateTokenHandlerUser");
const { signupUser } = require("../controllers/userControllers");
const { loginUser } = require("../controllers/userControllers");
const { logoutUser } = require("../controllers/userControllers");
const { createMcq } = require("../controllers/userControllers");
const { readMcq } = require("../controllers/userControllers");
const { updateMcq } = require("../controllers/userControllers");
const { deleteMcq } = require("../controllers/userControllers");
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
router.route(
	"/createMcq"
).post(
	validateTokenHandlerUser,
	createMcq
);
router.route(
	"/readMcq"
).post(
	validateTokenHandlerUser,
	readMcq
);
router.route(
	"/updateMcq/:id"
).post(
	validateTokenHandlerUser,
	updateMcq
);
router.route(
	"/deleteMcq/:id"
).post(
	validateTokenHandlerUser,
	deleteMcq
);
module.exports = router;