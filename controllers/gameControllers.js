const asyncHandler = require("express-async-handler");
const Game = require("../models/gameModels");
const User = require("../models/userModels");
const MCQ = require("../models/userModels");
const Lobby = require("../models/lobbyModels");
// @desc Start game
// @route POST /games/startGame
// @access private
const startGame = asyncHandler(
	async (req, res) => {
		const { lid  } = req.body;
		const lobby = await Lobby.findById(lid);
		if (!lobby) {
			res.status(404);
			throw new Error("Lobby not found");
		}
		if (lobby.lparticipants.length !== 2) {
			res.status(400);
			throw new Error("Exactly 2 participants are required to start the game");
		}
		lobby.lstatus = 'active';
		await lobby.save();
		const mcqs = await MCQ.find({ lid: lobby.lid });
		const startTime = Date.now();
		res.status(200).json({ mcqs, startTime });
	}
);
// @desc Submit Answer
// @route POST /games/submitAnswer
// @access private
const submitAnswer = asyncHandler(
	async (req, res) => {
		const { lid, userEmail, qid, selectedOption, currentScore } = req.body;
		const mcq = await MCQ.findOne({ lid: lid, qid });
		if (!mcq) {
			res.status(404);
			throw new Error("MCQ not found");
		}
		let newScore = currentScore;
		if (selectedOption === mcq.qans) {
			newScore += parseInt(mcq.qscore, 10);
		}
		const game = await Game.findOne({ lid: lid });
		if (!game) {
			res.status(404);
			throw new Error("Game not found");
		}
		if (newScore > game.wscore) {
			game.wscore = newScore;
			game.wemail = userEmail;
		}
		await game.save();
		res.status(200).json({ newScore });
	}
);
// @desc Get Result
// @route GET /games/getResult
// @access private
const getResult = asyncHandler(
	async (req, res) => {
		const { lid } = req.body;
		const game = await Game.findOne({ lid: lid });
		if (!game) {
			res.status(404);
			throw new Error("Game not found");
		}
		const user = await User.findOne({ email: game.wemail });
		if (!user) {
			res.status(404);
			throw new Error("Winner not found");
		}
		res.status(200).json({ winnerName: user.username, winnerScore: game.wscore });
	}
);
module.exports = {
	startGame,
	submitAnswer,
	getResult
};