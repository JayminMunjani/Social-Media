import mongoose from "mongoose";

const schema = new mongoose.Schema({
	posts: {
		type: String,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		// required: true,
		ref: "User",
	},
});

schema.virtual("comments", {
	ref: "Comments",
	localField: "id",
	foreignField: "postId",
});

schema.virtual("likes", {
	ref: "Like",
	localField: "id",
	foreignField: "postId",
});

const Post = mongoose.model("Post", schema);

export default Post;
