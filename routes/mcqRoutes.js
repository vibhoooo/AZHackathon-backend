const express = require("express");
const router = express.Router();
const validateTokenHandlerUser = require("../middlewares/validateTokenHandlerUser");
const apiLimiter = require("../middlewares/rateLimiter");
const { createMcq } = require("../controllers/mcqControllers");
const { readMcq } = require("../controllers/mcqControllers");
const { updateMcq } = require("../controllers/mcqControllers");
const { deleteMcq } = require("../controllers/mcqControllers");
router.route(
	"/createMcq"
).post(
	validateTokenHandlerUser,
	apiLimiter,
	createMcq
);
router.route(
	"/readMcq"
).get(
	validateTokenHandlerUser,
	apiLimiter,
	readMcq
);
router.route(
	"/updateMcq"
).patch(
	validateTokenHandlerUser,
	apiLimiter,
	updateMcq
);
router.route(
	"/deleteMcq"
).delete(
	validateTokenHandlerUser,
	apiLimiter,
	deleteMcq
);
module.exports = router;