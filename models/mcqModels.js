const mongoose = require("mongoose");
const mcqSchema = mongoose.Schema(
	{
		qid: {
			type: String,
			required: [
				true,
				"Please enter question id!"
			]
		},
		qname: {
			type: String,
			required: [
				true,
				"Please enter question name!"
			]
		},
		qdiff: {
			type: String,
			required: [
				true,
				"Please enter question difficulty!"
			]
		},
		qtopic: {
			type: String,
			required: [
				true,
				"Please enter question topic!"
			]
		},
		qans: {
			type: String,
			required: [
				true,
				"Please enter question answer!"
			]
		},
		qscore:  {
			type: String,
			required: [
				true,
				"Please enter question score!"
			]
		},
		lid: {
			type: String,
			required: [
				true,
				"Please enter lobby id!"
			]
		}
	},
	{
		timestamps: true
	}
);
module.exports = mongoose.model(
	"MCQ",
	mcqSchema
);