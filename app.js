const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { userAuthenticator } = require("./globalAuth/globalMiddleware");
const { databaseConnect } = require("./config/mongoose");
const blogModel = require("./models/blogModel");
const userRoute = require("./users/userRoute");
const blogRoute = require("./blogs/blogRoute");
const logger = require("./config/winston");
require("dotenv").config();

const PORT = process.env.PORT;

const app = express();

databaseConnect();

app.locals.appName = "BlogVoyage";

// app.use sections
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static("public"));
app.use("/users", userRoute);
app.use("/blogs", blogRoute);

// app.set sections
app.set("view engine", "ejs");
app.set("views", "views");

//app.gets (gets request) sections
app.get("/", async (req, res) => {
	const blogDetails = await blogModel
		.find({ state: "Published" })
		.populate("author", "first_name last_name")
		.exec();

	res.status(200).render("home", {
		navs: ["Home", "blogs", "Signup", "Login"],
		blogDetails,
	});
});

app.get("/home", (req, res) => {
	res.redirect("/");
});

app.get("/signup", (req, res) => {
	return res.render("signup", {
		navs: ["Home", "Login"],
	});
});

app.get("/login", (req, res) => {
	res.render("login", {
		navs: ["Home", "Signup"],
	});
});

app.get("/dashboard", userAuthenticator, async (req, res) => {
	const blogDetails = await blogModel
		.find({ author: res.locals.user._id })
		.populate("author", "first_name last_name")
		.exec();

	res.status(200).render("dashboard", {
		navs: ["Dashboard", "CreateBlog", "blogs", "my-blogs", "Logout"],
		user: res.locals.user,
		blogDetails,
	});
});

app.get("/createBlog", userAuthenticator, (req, res) => {
	res.status(200).render("createBlog", {
		navs: ["Dashboard", "blogs", "Logout"],
		user: res.locals.user,
	});
});

// GET route to edit a blog

app.get("/edit/:id", userAuthenticator, async (req, res) => {
	const id = req.params.id;

	try {
		const blog = await blogModel.findById(id);

		if (!blog) {
			res.redirect("/404ErrorPage");
			return;
		}

		res.render("editBlog", {
			navs: ["Dashboard", "blogs", "Logout"],
			user: res.locals.user,
			blogToEdit: blog,
		});
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

app.get("/my-blogs/sort", userAuthenticator, async (req, res) => {
	const user = res.locals.user;
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;
	const state = req.query.state || "all";

	const query = { author: user._id };

	if (state !== "all") {
		query.state = state;
	}

	try {
		const totalBlogs = await blogModel.countDocuments(query);
		const totalPages = Math.ceil(totalBlogs / limit);
		const skip = (page - 1) * limit;

		const userAllBlogs = await blogModel
			.find(query)
			.skip(skip)
			.limit(limit)
			.sort({ timestamp: -1 })
			.populate("author", "first_name last_name");

		res.status(200).render("userAllBlogs", {
			appName: app.locals.appName,
			navs: ["Dashboard", "blogs", "Logout"],
			user: user,
			userAllBlogs,
			currentPage: page,
			totalPages,
			state,
		});
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});


// GET route to list blogs owned by the user (author)
app.get("/my-blogs", userAuthenticator, async (req, res) => {
	const user = res.locals.user;
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;
	const state = req.query.state || "all";

	const query = { author: user._id };

	if (state !== "all") {
		query.state = state;
	}

	try {
		const totalBlogs = await blogModel.countDocuments(query);
		const totalPages = Math.ceil(totalBlogs / limit);
		const skip = (page - 1) * limit;

		const userAllBlogs = await blogModel
			.find(query)
			.skip(skip)
			.limit(limit)
			.sort({ timestamp: -1 })
			.populate("author", "first_name last_name");

		res.status(200).render("userAllBlogs", {
			appName: app.locals.appName,
			navs: ["Dashboard", "blogs", "Logout"],
			user: user,
			userAllBlogs,
			currentPage: page,
			totalPages,
			state,
		});
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

// Get all blogs for unauthenticated and authenticated users
app.get("/blogs", async (req, res) => {
	try {
		const { page, limit, filter, search, order } = req.query;

		const query = {
			state: filter || "Published",
		};

		if (search) {
			query.$or = [
				{ user_id: { $eq: search } },
				{ title: { $eq: search } },
				{ tags: { $eq: search } },
			];
		}

		const currentPage = parseInt(page) || 1;
		const itemsPerPage = parseInt(limit) || 20;
		const skip = (currentPage - 1) * itemsPerPage;

		const blogDetails = await blogModel
			.find(query)
			.sort(order || "-timestamp")
			.skip(skip)
			.limit(itemsPerPage)
			.populate("author", "first_name last_name");

		const totalBlogs = await blogModel.countDocuments(query);
		const totalPages = Math.ceil(totalBlogs / itemsPerPage);

		res.status(200).render("blogs", {
			navs: ["Home", "Blogs"],
			blogDetails,
			search: search || "",
			currentPage,
			totalPages,
		});
	} catch (error) {
		console.error("Error retrieving blogs:", error);
		res.status(500).send("Internal Server Error");
	}
});

// Get a single Blog when clicked in Blogs page
app.get("/blogs/:id", async (req, res) => {
	const id = req.params.id;

	try {
		const blog = await blogModel.findById(id);

		if (!blog) {
			res.redirect("/404ErrorPage");
			return;
		}

		res.render("oneBlog", {
			navs: ["Home", "blogs"],
			user: res.locals.user,
			oneBlog: blog,
		});
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});


app.get("/logout", (req, res) => {
	res.clearCookie("jwt");
	res.redirect("/");
});

app.get("/existingAccount", (req, res) => {
	res.status(409).render("existingAccount", {
		navs: ["Signup", "Login"],
	});
});

app.get("/404ErrorPage", (req, res) => {
	res.status(404).render("404ErrorPage", {
		navs: ["Signup", "Login"],
	});
});

app.get("/existingBlog", (req, res) => {
	res.status(403).render("existingBlog", {
		navs: ["Dashboard", "Create Blog", "Blogs", "Logout"],
	});
});

app.get("/invalidUserDetails", (req, res) => {
	res.status(422).render("invalidUserDetails", {
		navs: ["Signup", "Login"],
	});
});


app.get("*", (req, res) => {
	logger.error("Route not found");
	return res.status(404).json({
		data: null,
		error: "Route not found",
	});
});


app.listen(PORT, () => {
	console.log(`App server started running at: http://localhost:${PORT}`);
});

module.exports = app;
