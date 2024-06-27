const asyncHandler = require("express-async-handler");
const MCQ = require("../models/userModels");
// @desc Create MCQ
// @route POST /users/create
// @access private
const createMcq = asyncHandler(
	async (req, res) => {
		const { qid, qname, qdiff, qtopic, qans, qscore, lid, qoptions } = req.body;
		if (!qid || !qname || !qdiff || !qtopic || !qans || !qscore || !lid || !qoptions) {
			res.status(400);
			throw new Error("Please provide all required fields");
		}
		const mcq = new MCQ({
			qid,
			qname,
			qdiff,
			qtopic,
			qans,
			qscore,
			lid,
			qoptions
		});
		const createdMcq = await mcq.save();
		res.status(201).json(createdMcq);
	}
);
// @desc Read MCQ
// @route GET /users/read
// @access private
const readMcq = asyncHandler(
	async (req, res) => {
		const { qid } = req.body;
		if (!qid) {
			res.status(400);
			throw new Error("Please provide the question ID (qid)");
		}
		const mcq = await MCQ.findOne({ qid });
		if (!mcq) {
			res.status(404);
			throw new Error("MCQ not found");
		}
		res.status(200).json(mcq);
	}
);
// @desc Update MCQ
// @route PATCH /users/update/:id
// @access private
const updateMcq = asyncHandler(
	async (req, res) => {
		const { id } = req.params;
		const { qid, qname, qdiff, qtopic, qans, qscore, lid, qoptions } = req.body;
		if (!qid || !qname || !qdiff || !qtopic || !qans || !qscore || !lid || !qoptions) {
			res.status(400);
			throw new Error("Please provide all required fields");
		}
		const mcq = await MCQ.findById(id);
		if (!mcq) {
			res.status(404);
			throw new Error("MCQ not found");
		}
		mcq.qid = qid;
		mcq.qname = qname;
		mcq.qdiff = qdiff;
		mcq.qtopic = qtopic;
		mcq.qans = qans;
		mcq.qscore = qscore;
		mcq.lid = lid;
		mcq.qoptions = qoptions;
		const updatedMcq = await mcq.save();
		res.status(200).json(updatedMcq);
	}
);
// @desc Delete MCQ
// @route DELETE /users/delete/:id
// @access private
const deleteMcq = asyncHandler(
	async (req, res) => {
		const { id } = req.params;
		const mcq = await MCQ.findById(id);
		if (!mcq) {
			res.status(404);
			throw new Error("MCQ not found");
		}
		await mcq.remove();
		res.status(200).json({ message: "MCQ deleted successfully" });
	}
);
module.exports = {
	createMcq,
	readMcq,
	updateMcq,
	deleteMcq
};