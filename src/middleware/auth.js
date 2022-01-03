import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import mongoose from "mongoose";

const auth = async (req, res, next) => {
	try {
		const token = req.query.Token;
		const data = jwt.verify(token, "life");
		const user = await User.findOne({
			_id: mongoose.Types.ObjectId(data.id),
			"tokens.token": token,
		});
		if (!user) {
			throw new Error("User not found");
		}
		req.user = user;
		req.token = token;
		// console.log(user)
		next();
	} catch (error) {
		res.status(404).send(error);
	}
};

export default auth;
