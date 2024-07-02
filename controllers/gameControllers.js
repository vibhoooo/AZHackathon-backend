const asyncHandler = require("express-async-handler");
const Game = require("../models/gameModels");
const User = require("../models/userModels");
const MCQ = require("../models/mcqModels");
const Lobby = require("../models/lobbyModels");
// @desc Start game
// @route POST /games/startGame
// @access private
const startGame = asyncHandler(
	async (req, res) => {
		const { gid, lid } = req.body;
		if (!gid || !lid) {
			res.status(400);
			throw new Error("Game ID and Lobby ID are required");
		}
		const lobby = await Lobby.findOne({ lid });
		if (!lobby) {
			res.status(404);
			throw new Error("Lobby not found");
		}
		if (lobby.lparticipants.length !== 3) {
			res.status(400);
			throw new Error("Exactly 2 participants other than owner are required to start the game");
		}
		lobby.lstatus = 'busy';
		await lobby.save();
		const mcqs = await MCQ.find({ lid });
		if (!mcqs.length) {
			res.status(404);
			throw new Error("No MCQs found for this lobby");
		}
		const startTime = new Date().toISOString();
		const newGame = new Game({
			gid,
			lid
		});
		await newGame.save();
		res.status(200).json({ game: newGame, mcqs, startTime });
	}
);
// @desc Submit Answer
// @route POST /games/submitAnswer
// @access private
const submitAnswer = asyncHandler(
	async (req, res) => {
		const { gid, lid, userEmail, qid, selectedOption, currentScore } = req.body;
		if (!gid || !lid || !userEmail || !qid || !selectedOption || currentScore === undefined) {
			res.status(400);
			throw new Error("All fields (gid, lid, userEmail, qid, selectedOption, currentScore) are required");
		}
		const mcq = await MCQ.findOne({ lid: lid, qid: qid });
		if (!mcq) {
			res.status(404);
			throw new Error("MCQ not found");
		}
		let newScore = currentScore;
		if (selectedOption === mcq.qans) {
			newScore += parseInt(mcq.qscore, 10);
		}
		const game = await Game.findOne({ gid: gid, lid: lid });
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
// @route POST /games/getResult
// @access private
const getResult = asyncHandler(
	async (req, res) => {
		const { gid, lid } = req.body;
		if (!gid || !lid) {
			res.status(400);
			throw new Error("Game ID (gid) and Lobby ID (lid) are required");
		}
		const game = await Game.findOne({ gid: gid, lid: lid });
		if (!game) {
			res.status(404);
			throw new Error("Game not found");
		}
		const user = await User.findOne({ email: game.wemail });
		if (!user) {
			res.status(404);
			throw new Error("Winner not found");
		}
		const lobby = await Lobby.findOne({ lid: lid });
		if (!lobby) {
			res.status(404);
			throw new Error("Lobby not found");
		}
		lobby.lstatus = 'complete';
		await lobby.save();
		res.status(200).json({ winnerName: user.username, winnerScore: game.wscore });
	}
);
module.exports = {
	startGame,
	submitAnswer,
	getResult
};