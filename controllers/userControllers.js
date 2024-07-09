const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModels");
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
						email,
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
module.exports = {
	signupUser,
	loginUser,
	logoutUser
};