const express = require("express");
const router = express.Router();
const validateTokenHandlerUser = require("../middlewares/validateTokenHandlerUser");
const { createMcq } = require("../controllers/mcqControllers");
const { readMcq } = require("../controllers/mcqControllers");
const { updateMcq } = require("../controllers/mcqControllers");
const { deleteMcq } = require("../controllers/mcqControllers");
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