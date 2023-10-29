const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema({
	title: { type: String, required: true, unique: true },
	description: { type: String },
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
		required: true,
	},
	state: { type: String, enum: ["Draft", "Published"], default: "Draft" },
	read_count: { type: Number, default: 0 },
	reading_time: { type: Number, default: 0 },
	tags: { type: String },
	body: { type: String, required: true },
	timestamp: { type: Date, default: Date.now },
});

const blogModel = mongoose.model("Blogs", blogSchema);

module.exports = blogModel;
