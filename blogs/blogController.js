const blogModel = require("../models/blogModel")
const logger = require("../config/winston");

const createBlog = async ({ title, description, author, state, read_count, reading_time, tags, body, timestamp }) => {
    
    const blogDetails = { title, description, author, state, read_count, reading_time, tags, body, timestamp };

    try {
       const existingBlog = await blogModel.findOne({title: blogDetails.title});

        if (existingBlog) {
            logger.error(`Blog creation failed: Blog with title "${blogDetails.title}" already exists.`);
            return {
                message: "Oops! A blog with the same title already exists",
                code: 403,
            };
        }

        const newBlog = await blogModel.create(blogDetails);

        if (!newBlog) {
            logger.error("Error creating blog: An error occurred while creating the blog.");
            return {
                message: "An error occurred while creating the blog",
                code: 500,
            };
        }

        logger.info(`Blog created successfully: ${blogDetails.title}`);
        return {
            message: "Blog created successfully",
            code: 200,
            newBlog,
        }; 
    } catch (error) {
        logger.error(`Error creating blog: ${error}`);
        console.error(error);
        return {
            message: "Internal server error",
            code: 500,
        };
    }
}


const changeStatus = (req, res) => {
    const id = req.params.id
    const update = req.body

    blogModel.findByIdAndUpdate(id, update, { new: true })
        .then(newStatus => {
            logger.info(`Blog state changed for blog with ID ${id}: ${update.state}`);
            res.redirect("/dashboard");
        }).catch(error => {
            logger.error(`Error changing blog state: ${error}`);
            console.log(error)
            res.status(500).send(error)
        })
}

const deleteBlog = (req, res) => {
	const id = req.params.id;

	blogModel
		.findByIdAndRemove(id)
        .then((newDelete) => {
            logger.info(`Blog deleted with ID ${id}`);
			res.redirect("/dashboard");
		})
        .catch((error) => {
            logger.error(`Error deleting blog: ${error}`);
			console.log(error);
			res.status(500).send(error);
		});
};


const updateBlog = (req, res) => {
    const blogId = req.params.id;
    const update = req.body;

    blogModel
        .findOneAndUpdate({ _id: blogId, author: res.locals.user._id }, update, { new: true })
        .then((updateBlog) => {
            if (!updateBlog) {
                res.redirect("/dashboard");
            } else {
                logger.info(`Blog updated with ID ${blogId}`);
                res.redirect("/dashboard");
            }
        }).catch((error) => {
            logger.error(`Error updating blog: ${error}`);
            console.log(error);
			res.status(500).send(error);
        })
}


// Controller for my-blog to filter by state
const userBlogLists = async (req, res) => {

    const user = res.locals.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filter = req.query.filter || "all";

    const query = { author: user._id };

    if (filter !== "all") {
        query.state = filter;
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
        
        logger.info(`User ${user.first_name} ${user.last_name} viewed their blogs.`);
        res.status(200).render("userAllBlogs", {
            user,
            userAllBlogs,
            currentPage: page,
            totalPages,
            filter,
        });
    } catch (error) {
        logger.error(`Error while processing userBlogLists: ${error}`);
        console.error(error);
        res.status(500).send(error);
    }
}


const retrieveUserBlogs = async(userId) => {
    try {
        const userBlogs = await blogModel.find({ author: userId })
        
        logger.info(`Retrieved blogs for user with ID ${userId}.`);
        return userBlogs
    } catch (error) {
        logger.error(`Error while retrieving user blogs: ${error}`);
        console.error(error)
        throw error;
    }
}


const getOneBlog = async (req, res) => {
    const blogId = req.params._id

    try {
        const oneBlog = await blogModel
        .findById(blogId)
        .populate("author", "first_name last_name");
        
        if (!oneBlog) {
            return res.status(404).send("Oops! Blog is not found")
        }

        oneBlog.read_count += 1;
        await oneBlog.save()

        logger.info(`Viewed blog with ID ${blogId} by user ${res.locals.user.first_name} ${res.locals.user.last_name}.`);
        res.status(200).render("oneBlog", {
            oneBlog: oneBlog,
            user: res.locals.user,
        });
    } catch (error) {
        logger.error(`Error while processing getOneBlog: ${error}`);
        console.error(error);
        res.status(500).send(error)
    }
}

module.exports = {
	createBlog,
	changeStatus,
	deleteBlog,
	updateBlog,
	userBlogLists,
	retrieveUserBlogs,
	getOneBlog,
};