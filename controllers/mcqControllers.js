const asyncHandler = require("express-async-handler");
const MCQ = require("../models/mcqModels");
// @desc Create MCQ
// @route POST /mcqs/createMcq
// @access private
const createMcq = asyncHandler(
	async (req, res) => {
		const { qid, qname, qdiff, qtopic, qans, qscore, lid, qoptions } = req.body;
		if (!qid || !qname || !qdiff || !qtopic || !qans || !qscore || !lid || !qoptions) {
			res.status(400);
			throw new Error("Please provide all required fields");
		}
		try {
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
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Server error, unable to create MCQ' });
		}
	}
);
// @desc Read MCQ
// @route GET /mcqs/readMcq
// @access private
const readMcq = asyncHandler(
	async (req, res) => {
		const { qid, lid } = req.body;
		if (!qid || !lid) {
			res.status(400);
			throw new Error("Please provide both question ID (qid) and lobby ID (lid)");
		}
		try {
			const mcq = await MCQ.findOne({ qid, lid });

			if (!mcq) {
				res.status(404);
				throw new Error("MCQ not found");
			}

			res.status(200).json(mcq);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Server error, unable to read MCQ' });
		}
	}
);
// @desc Update MCQ
// @route PATCH /mcqs/updateMcq
// @access private
const updateMcq = asyncHandler(
	async (req, res) => {
		const { qid, qname, qdiff, qtopic, qans, qscore, lid, qoptions } = req.body;
		if (!qid || !qname || !qdiff || !qtopic || !qans || !qscore || !lid || !qoptions) {
			res.status(400);
			throw new Error("Please provide all required fields");
		}
		try {
			const mcq = await MCQ.findOne({ qid, lid });
			if (!mcq) {
				res.status(404);
				throw new Error("MCQ not found");
			}
			mcq.qname = qname;
			mcq.qdiff = qdiff;
			mcq.qtopic = qtopic;
			mcq.qans = qans;
			mcq.qscore = qscore;
			mcq.qoptions = qoptions;
			const updatedMcq = await mcq.save();
			res.status(200).json(updatedMcq);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Server error, unable to update MCQ' });
		}
	}
);
// @desc Delete MCQ
// @route DELETE /mcqs/deleteMcq
// @access private
const deleteMcq = asyncHandler(
	async (req, res) => {
		const { qid, lid } = req.body;
		if (!qid || !lid) {
			res.status(400);
			throw new Error("Please provide both question ID (qid) and lobby ID (lid)");
		}
		try {
			const mcq = await MCQ.findOne({ qid, lid });

			if (!mcq) {
				res.status(404);
				throw new Error("MCQ not found");
			}
			await mcq.deleteOne();
			res.status(200).json({ message: "MCQ deleted successfully" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Server error, unable to delete MCQ' });
		}
	}
);
module.exports = {
	createMcq,
	readMcq,
	updateMcq,
	deleteMcq
};