const joi = require("joi")


const validateUserInfo = async (req, res, next) => {
    try {
        console.log(req.body); 
        const userSchema = joi.object({
            first_name: joi.string().empty().required().messages({
                "string.base": `"first_name" must be a text`,
                "string.empty": `"first_name" can not be emoty`,
                "string.required": `"first_name" is required`
            }),
            last_name: joi.string().empty().required().messages({
                "string.base": `"last_name" must be a text`,
                "string.empty": `"last_name" can not be emoty`,
                "string.required": `"last_name" is required`
            }),
            email: joi.string().empty().email().required().messages({
				"string.base": `"email" must be a "text"`,
				"string.empty": `"email" can not be empty`,
				"string.required": `"email" is required`,
			}),
            password: joi.string().empty().required().min(8).messages({
                "string.base": `"password" must be a text`,
                "string.empty": `"password" can not be emoty`,
                "string.required": `"password" is required`,
                "string.min": `"password" should have a minimum length of {8}`
            }),
            gender: joi.string().empty().valid("male", "female"),
        })

        await userSchema.validateAsync(req.body, { abortEarly: true })
        next()
    } catch (error) {
        res.status(422).json({
            message: "Oops! Invalid information inputted",
            "error": error.message
        })
    }
}


module.exports = { validateUserInfo };