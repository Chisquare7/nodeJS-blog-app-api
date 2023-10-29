const express = require("express")
const loginMiddleware = require("./loginMiddleware")
const middleware = require("./userMiddleware")
const controller = require("./userController")
const cookieParser = require("cookie-parser")


const userRouter = express.Router()

userRouter.use(cookieParser())


userRouter.post("/signup", middleware.validateUserInfo, async (req, res) => {
    const response = await controller.createUser({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender
    })

    if (response.code === 200) {
        console.log("Redirecting to /login");
        res.redirect("/login")
    } else {
        console.log("Redirecting to /existingAccount");
        res.redirect("/existingAccount")
    }
})


userRouter.post("/login", loginMiddleware.validateLoginUser, async (req, res) => {
    const response = await controller.loginUser({
        email: req.body.email,
        password: req.body.password
    })

    if (response.code === 200) {
        res.cookie("jwt", response.token, { maxAge: 60 * 60 * 1000 })
        res.redirect("/dashboard");
    } else if (response.code === 404) {
        res.redirect("/pageNotFound")
    } else {
        res.redirect("/invalidUserDetails")
    }
})


module.exports = userRouter
