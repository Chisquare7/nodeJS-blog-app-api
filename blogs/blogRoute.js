const express = require("express");
const cookieParser = require("cookie-parser");
const controller = require("./blogController");

const blogRouter = express.Router();

blogRouter.use(cookieParser());

// POST route to handle creation of blog post
blogRouter.post("/create", async (req, res) => {
    console.log("Request body:", req.body);
    const user = res.locals.user

    // Algorithms for calculating reading_time
    const countingWords = req.body.body.split(" ").length;
    const readTime = Math.ceil(countingWords / 200)

    const response = await controller.createBlog({
        title: req.body.title,
        description: req.body.description,
        author: user._id,
        state: "Draft",
        read_count: 0,
        reading_time: readTime,
        tags: req.body.tags,
        body: req.body.body,
        timestamp: req.body.timestamp,
    })

    if (response.code === 200) {
        res.redirect("/dashboard");
    } else {
        res.redirect("/existingBlog")
    }
})


// POST route to handle blog updates (edit) by ID
blogRouter.post("/update/:id", controller.updateBlog)

// POST route to change blog state (Draft and Published)
blogRouter.post("/updateState/:id", controller.changeStatus)

// POST route to delete user blog
blogRouter.post("/delete/:id", controller.deleteBlog)

//GET route to list blogs owned by the user (author)
blogRouter.get("/my-blogs", controller.userBlogLists)

// GET route to get a single blog post details
blogRouter.get("/blogs/:id", controller.getOneBlog)


module.exports = blogRouter


