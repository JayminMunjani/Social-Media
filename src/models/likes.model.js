import mongoose from "mongoose";

const schema = new mongoose.Schema({
	like: {
		type: Number,
		required: true,
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

schema.statics.likeCount = async () => {
	let like;
	like += 1;
	console.log(like);
	return like;
};

const Like = mongoose.model("Like", schema);

export default Like;
