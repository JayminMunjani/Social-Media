import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";

const schema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		unique: true,
		required: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error("Please enter valid email address");
			}
		},
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
		// validate(value){
		//     if(!validator.isStrongPassword(value)){
		//         throw new Error("Please enter strong password")
		//     }
		// }
	},
	phoneNo: {
		type: Number,
		required: true,
		minlength: 10,
	},
	dob: {
		type: Date,
	},
	tokens: [
		{
			token: {
				type: String,
				required: true,
			},
		},
	],
});

// schema.methods.toJSON = () => {
// 	let user = this;
// 	let userObject = user.toObject();
// 	delete userObject.password;
// 	delete userObject.tokens;
// 	return userObject;
// };

schema.virtual("posts", {
	ref: "Post",
	localField: "id",
	foreignField: "user",
});

schema.virtual("likes", {
	ref: "Like",
	localField: "id",
	foreignField: "userId",
});

schema.virtual("comments", {
	ref: "Comments",
	localField: "id",
	foreignField: "userId",
});

schema.statics.verifyPassword = async function (email, password) {
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error("User not found");
	}
	const match = await bcrypt.compare(password, user.password);
	if (!match) {
		throw new Error("Password is incorrect");
	}
	return user;
};

schema.methods.generateToken = async function () {
	let user = this;
	let token = await jwt.sign(
		{
			id: user.id.toString(),
		},
		"life",
		{ expiresIn: "24h" }
	);

	user.tokens = user.tokens.concat({ token });
	await user.save();

	return token;
};

schema.pre("save", async function (next) {
	const user = this;

	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, 1);
	}
	next();
});

const User = mongoose.model("User", schema);

export default User;
