const mongoose = require('mongoose');
const gameSchema = new mongoose.Schema(
	{
		gid: {
			type: String,
			required: [
				true,
				"Please enter game id!"
			],
		},
		lid: {
			type: String,
			required: [
				true,
				"Please enter lobby id!"
			],
		},
		wemail: {
			type: String,
			default: ''
		},
		wscore: {
			type: Number,
			default: 0
		}
	},
	{
		timestamps: true
	}
);
gameSchema.index({ gid: 1, lid: 1 }, { unique: true });
module.exports = mongoose.model(
	"Game",
	gameSchema
);