const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
require("dotenv").config()


const createUser = async ({ first_name, last_name, email, password, gender }) => {
    const userInfo = { first_name, last_name, email, password, gender }
    
    const existingAccount = await userModel.findOne({
        email: userInfo.email
    })

    if (existingAccount) {
        return {
            message: "Oops! User Account exist already",
            code: 409
        }
    }

    const newAccount = await userModel.create({
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        email: userInfo.email,
        password: userInfo.password,
        gender: userInfo.gender
    })

    return {
        message: "User Account created successfully",
        code: 200,
        newAccount
    }
}


const loginUser = async ({ email, password }) => {
    const loginInfo = { email, password }
    
    const user = await userModel.findOne({ email: loginInfo.email });
    
    if (!user) {
        return {
            code: 404,
            message: "Oops! User account not found"
        }
    }

    const validPassword = await user.isValidPassword(loginInfo.password);

    if (!validPassword) {
        return {
            code: 422,
            message: "Invalid credential entry. Email or Password is incorrect"
        }
    }

    const token = await jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" })
    
    return {
        message: "User Account Login successfully",
        code: 200,
        token,
        user
    }
}


module.exports = { createUser, loginUser };