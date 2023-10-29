const userModel = require("../models/userModel");
const logger = require("../config/winston");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createUser = async ({
	first_name,
	last_name,
	email,
	password,
	gender,
}) => {
	const userInfo = { first_name, last_name, email, password, gender };

	try {
		const existingAccount = await userModel.findOne({
			email: userInfo.email,
		});

		if (!existingAccount) {
			const newAccount = await userModel.create({
				first_name: userInfo.first_name,
				last_name: userInfo.last_name,
				email: userInfo.email,
				password: userInfo.password,
				gender: userInfo.gender,
			});
			logger.info(`User account created: ${userInfo.email}`);
			return {
				message: "User Account created successfully",
				code: 200,
				newAccount,
			};
		} else {
			logger.error(
				`User account creation failed: User with email ${userInfo.email} already exists.`
			);
			return {
				message: "Oops! User Account exist already",
				existingAccount,
				code: 409,
			};
		}
	} catch (error) {
		logger.error(`Error creating user account: ${error}`);
		console.error(error);
		return {
			message: "Internal server error",
			code: 500,
		};
	}
};

const loginUser = async ({ email, password }) => {
	const loginInfo = { email, password };

	try {
		const user = await userModel.findOne({ email: loginInfo.email });

		if (!user) {
			logger.error(
				`User login failed: User account not found for email ${loginInfo.email}`
			);
			return {
				code: 404,
				message: "Oops! User account not found",
			};
		}

		const validPassword = await user.isValidPassword(loginInfo.password);

		if (!validPassword) {
			logger.error(
				`User login failed: Invalid credentials for email ${loginInfo.email}`
			);
			return {
				code: 422,
				message: "Invalid credential entry. Email or Password is incorrect",
			};
		}

		const token = await jwt.sign(
			{ _id: user._id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

        logger.info(`User account logged in: ${user.email}`);
		return {
			message: "User Account Login successfully",
			code: 200,
			token,
			user,
		};
	} catch (error) {
		logger.error(`Error logging in user: ${error}`);
		console.error(error);
		return {
			message: "Internal server error",
			code: 500,
		};
	}
};

module.exports = { createUser, loginUser };
