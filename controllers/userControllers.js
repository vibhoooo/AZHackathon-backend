const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModels");
const MCQ = require("../models/userModels");
// @desc Sign Up
// @route POST /users/signup
// @access public
const signupUser = asyncHandler(
	async (req, res) => {
		const { username, email, password } = req.body;
		if (!username || !email || !password) {
			res
				.status(
					400
				);
			throw new Error(
				"All fields are mandatory!"
			);
		}
		const userAvailable = await User.findOne(
			{
				email
			}
		);
		if (userAvailable) {
			res
				.status(
					400
				);
			throw new Error(
				"User already registered!"
			);
		}
		const hashedPassword = await bcrypt.hash(
			password,
			10
		);
		const user = await User.create(
			{
				username,
				email,
				password: hashedPassword
			}
		);
		if (user) {
			res
				.status(
					201
				)
				.json(
					{
						user_id: user.id,
						user_email: user.email
					}
				);
		}
		else {
			res
				.status(
					500
				);
			throw new Error(
				"Registration falied!"
			);
		}
	}
);
// @desc Login
// @route POST /users/login
// @access public
const loginUser = asyncHandler(
	async (req, res) => {
		const { email, password } = req.body;
		if (!email || !password) {
			res
				.status(
					400
				);
			throw new Error(
				"All fields are mandatory!"
			);
		}
		const user = await User.findOne(
			{
				email
			}
		);
		if (user && (await bcrypt.compare(password, user.password))) {
			const accessToken = jwt.sign(
				{
					user: {
						username: user.username,
						user_email: user.email,
						user_id: user.id,
						role: "User"
					}
				},
				process.env.ACCESS_TOKEN_SECRET_USER,
				{
					expiresIn: "90m"
				}
			);
			res
				.status(
					200
				)
				.json(
					{
						accessToken,
						role: "User"
					}
				);
		}
		else {
			res
				.status(
					401
				);
			throw new Error(
				"Email or Password not valid!"
			);
		}
	}
);
// @desc Logout
// @route POST /users/logout
// @access private
const logoutUser = asyncHandler(
	async (req, res) => {
		res.status(200).json({ message: "Logged out successfully" });
	}
);
// @desc Create MCQ
// @route POST /users/create
// @access private
const createMcq = asyncHandler(
	async (req, res) => {
		const { qid, qname, qdiff, qtopic, qans, qscore, lid } = req.body;
		if (!qid || !qname || !qdiff || !qtopic || !qans || !qscore || !lid) {
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
			lid
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
		const { qid, qname, qdiff, qtopic, qans, qscore, lid } = req.body;
		if (!qid || !qname || !qdiff || !qtopic || !qans || !qscore || !lid) {
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
	signupUser,
	loginUser,
	logoutUser,
	createMcq,
	readMcq,
	updateMcq,
	deleteMcq
};