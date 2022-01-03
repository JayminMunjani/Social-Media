import express from "express";
import Like from "../models/likes.model.js";
import mongoose from "mongoose";

const router = new express.Router();

/**
 * @swagger
 * /like/{postId}/{userId}:
 *   post:
 *     description: Returns the homepage
 *     tags:
 *       - like
 *     parameters:
 *       - in: path
 *         name: postId
 *         type: String
 *         required: true
 *         description: Enter post id
 *       - in: path
 *         name: userId
 *         type: String
 *         required: true
 *         description: Enter user id
 *     responses:
 *       200:
 *         description: User register api
 */

router.post("/:postId/:userId", async (req, res) => {
	const postId = req.params.postId;
	const userId = req.params.userId;

	try {
		const count = await Like.findOneAndUpdate(postId, {
			$inc: { like: 1 },
		});
		if (count === null) {
			var like = new Like({ postId, userId, like: 1 });
		} else {
			var like = new Like({ postId, userId, like: count.like });
		}
		await like.save();
		res.send(like);
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

/**
 * @swagger
 * /like/getAll/{postId}:
 *   get:
 *     description: Returns the homepage
 *     tags:
 *       - like
 *     parameters:
 *       - in: path
 *         name: postId
 *         type: String
 *         required: true
 *         description: Enter post id
 *     responses:
 *       200:
 *         description: User register api
 */

router.get("/getAll/:postId", async (req, res) => {
	const postId = req.params.postId;
	const id = new mongoose.Types.ObjectId(postId);

	try {
		const user = await Like.aggregate([
			{ $match: { postId: id } },
			{
				$lookup: {
					from: "users",
					localField: "userId",
					foreignField: "_id",
					as: "likedUser",
				},
			},
			{
				$unwind: {
					path: "$likedUser",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$project: { name: "$likedUser.name" },
			},
		]);
		res.send(user);
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

export default router;
