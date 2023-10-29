const joi = require("joi");

const validateLoginUser = async (req, res, next) => {
	try {
		const userSchema = joi.object({
			email: joi.string().empty().email().required().messages({
				"string.base": `"email" must be a "text"`,
				"string.empty": `"email" can not be empty`,
				"string.required": `"email" is required`,
			}),
			password: joi.string().empty().required().min(8).messages({
				"string.base": `"password" must be a text`,
				"string.empty": `"password" can not be emoty`,
				"string.required": `"password" is required`,
				"string.min": `"password" should have a minimum length of {8}`,
			}),
		});

		await userSchema.validateAsync(req.body, { abortEarly: true });
		next();
	} catch (error) {
		res.status(422).json({
			message: "Oops! Invalid information inputted",
			error: error.message,
		});
	}
};

module.exports = { validateLoginUser };
