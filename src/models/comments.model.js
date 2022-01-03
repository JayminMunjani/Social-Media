import mongoose from "mongoose";

const schema = new mongoose.Schema({
	comment: {
		type: String,
		max: 500,
	},
	postId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post",
		required: true,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
		unique: true,
	},
});

const Comments = mongoose.model("Comments", schema);

export default Comments;
