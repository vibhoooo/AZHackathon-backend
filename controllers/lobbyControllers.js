const asyncHandler = require("express-async-handler");
const Lobby = require("../models/lobbyModels");
const { getIo } = require("../utils/socket");
// @desc Create lobby
// @route POST /lobbies/createLobby
// @access private
const createLobby = asyncHandler(
	async (req, res) => {
		const { lid, lname, lowneremail } = req.body;
		if (!lid || !lname || !lowneremail) {
			res.status(400);
			throw new Error("Please provide all required fields");
		}
		try {
			const newLobby = new Lobby({
				lid,
				lname,
				lowneremail,
				lparticipants: [lowneremail]
			});
			const createdLobby = await newLobby.save();
			res.status(201).json(createdLobby);
		} catch (error) {
			console.error(error);
			res.status(400).json({ message: error.message });
		}
	}
);
// @desc Request to join lobby
// @route POST /lobbies/requestJoinLobby
// @access private
const requestJoinLobby = asyncHandler(
	async (req, res) => {
		const { lid, participant } = req.body;
		if (!lid || !participant) {
			res.status(400);
			throw new Error("Please provide lobby ID and participant");
		}
		try {
			const lobby = await Lobby.findOne({ lid });
			if (!lobby) {
				res.status(404);
				throw new Error("Lobby not found");
			}
			if (lobby.lstatus === 'busy') {
				res.status(403);
				throw new Error("Lobby is currently busy. Join request cannot be sent.");
			}
			const io = getIo();
			io.to(lobby.lowneremail).emit("joinRequest", { lobbyId: lid, participant });
			res.status(200).json({ message: "Join request sent to lobby owner" });
		} catch (error) {
			console.error(error);
			res.status(400).json({ message: error.message });
		}
	}
);
// @desc Add participant
// @route POST /lobbies/addParticipant
// @access private
const addParticipant = asyncHandler(
	async (req, res) => {
		const { lid, participant, accept } = req.body;
		if (!lid || !participant || typeof accept !== 'boolean') {
			res.status(400);
			throw new Error("Please provide lobby ID, participant, and acceptance status");
		}
		try {
			const lobby = await Lobby.findOne({ lid });
			if (!lobby) {
				res.status(404);
				throw new Error("Lobby not found");
			}
			if (lobby.lstatus === 'busy') {
				res.status(400).json({ message: "Lobby is busy, join request declined" });
				return;
			}
			const io = getIo();
			if (accept) {
				lobby.lparticipants.push(participant);
				lobby.lstatus = 'active';
				const updatedLobby = await lobby.save();
				const lobbyRoom = `lobby-${lid}`;
				socket.join(lobbyRoom);
				io.to(participant).emit("joinResponse", { lobbyId: lid, accepted: true });
				res.status(200).json({ message: "Join request accepted", updatedLobby });
			} else {
				io.to(participant).emit("joinResponse", { lobbyId: lid, accepted: false });
				res.status(200).json({ message: "Join request declined" });
			}
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	}
);
// @desc List lobbies
// @route GET /lobbies/listLobby
// @access private
const listLobby = asyncHandler(
	async (req, res) => {
		try {
			const lobbies = await Lobby.find({});
			res.status(200).json(lobbies);
		} catch (error) {
			res.status(500).json({ message: "Failed to fetch lobbies", error: error.message });
		}
	}
);
module.exports = {
	createLobby,
	requestJoinLobby,
	addParticipant,
	listLobby
};
