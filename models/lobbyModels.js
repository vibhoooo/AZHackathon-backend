const mongoose = require("mongoose");
const lobbySchema = mongoose.Schema(
	{
		lid: {
			type: String,
			required: [
				true,
				"Please enter lobby id!"
			],
			unique: [
				true,
				"lobby id already taken!"
			]
		},
		lname: {
			type: String,
			required: [
				true,
				"Please enter lobby name!"
			]
		},
		lowneremail: {
			type: String,
			required: [
				true,
				"Please enter lobby owner email id!"
			]
		},
		lstatus: {
			type: String,
			required: [
				true,
				"Please enter lobby status!"
			],
			enum: {
				values: ['waiting', 'active', 'busy', 'complete'],
				message: 'lstatus must be one of waiting, active, busy, complete'
			},
			default: 'waiting'
		},
		lparticipants: {
			type: [String],
			default: []
		}
	},
	{
		timestamps: true
	}
);
module.exports = mongoose.model(
	"Lobby",
	lobbySchema
);