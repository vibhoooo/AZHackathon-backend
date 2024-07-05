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
		},
		qoptions: {
			type: [String],
			required: [
				true,
				"Please enter 4 options for the question!"
			],
			validate: {
				validator: function (v) {
					return v.length === 4;
				},
				message: "Exactly 4 options are required!"
			}
		}
	},
	{
		timestamps: true
	}
);
mcqSchema.index({ lid: 1, qid: 1 }, { unique: true });
module.exports = mongoose.model(
	"MCQ",
	mcqSchema
);