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
		const existingMcq = await MCQ.findOne({ qid, lid });
		if (existingMcq) {
			res.status(400);
			throw new Error("MCQ with the given QID and LID already exists");
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
			res.status(201).json(
				{
					qid,
					qname,
					qdiff,
					qtopic,
					qans,
					qscore,
					lid,
					qoptions
				}
			);
		} catch (error) {
			res.status(500).json({ message: 'Server error, unable to create MCQ' });
		}
	}
);
// @desc Read MCQ
// @route POST /mcqs/readMcq
// @access private
const readMcq = asyncHandler(
	async (req, res) => {
		const { qid, lid } = req.body;
		if (!qid || !lid) {
			res.status(400);
			throw new Error("Please provide both question ID (qid) and lobby ID (lid)");
		}
		const cacheKey = `mcq_${qid}_${lid}`;
		const cachedMcq = req.cache.get(cacheKey);
		if (cachedMcq) {
			return res.status(200).json( {cachedMcq} );
		}
		try {
			const mcq = await MCQ.findOne({ qid, lid });
			if(mcq) {
				req.cache.set(cacheKey, mcq);
				res.status(200).json({ mcq });
			}
			else {
				res.status(404).json({ message: 'MCQ not found' });
			}
		} catch (error) {
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
			if(mcq) {
				mcq.qname = qname;
				mcq.qdiff = qdiff;
				mcq.qtopic = qtopic;
				mcq.qans = qans;
				mcq.qscore = qscore;
				mcq.qoptions = qoptions;
				const updatedMcq = await mcq.save();
				const cacheKey = `mcq_${qid}_${lid}`;
				req.cache.del(cacheKey);
				res.status(200).json({updatedMcq});
			}
			else {
				res.status(404).json({ message: 'MCQ not found' });
			}
		} catch (error) {
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
			if(mcq) {
				await mcq.deleteOne();
				const cacheKey = `mcq_${qid}_${lid}`;
				req.cache.del(cacheKey);
				res.status(200).json({ message: "MCQ deleted successfully" });
			}
			else {
				res.status(404).json({ message: 'MCQ not found' });
			}
		} catch (error) {
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