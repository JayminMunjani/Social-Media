import express from "express";
import Comments from "../models/comments.model.js";
import mongoose from "mongoose";

const router = new express.Router();

/**
 * @swagger
 * /comment/addComment/{postId}/{userId}:
 *   post:
 *     description: Returns the homepage
 *     tags:
 *       - comment
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
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: String
 *                 description: User Name
 *                 example: StringName
 *     responses:
 *       200:
 *         description: User register api
 */

router.post("/addComment/:postId/:userId", async (req, res) => {
	const postId = req.params.postId;
	const userId = req.params.userId;
	const comment = new Comments({
		...req.body,
		postId,
		userId,
	});

	try {
		await comment.save();
		res.send(comment);
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

/**
 * @swagger
 * /comment/all/{postId}:
 *   get:
 *     description: Returns the homepage
 *     tags:
 *       - comment
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

router.get("/all/:postId", async (req, res) => {
	const postId = req.params.postId;
	const id = new mongoose.Types.ObjectId(postId);

	try {
		const comment = await Comments.aggregate([
			{ $match: { postId: id } },
			{
				$lookup: {
					from: "users",
					localField: "userId",
					foreignField: "_id",
					as: "User",
				},
			},
			{
				$unwind: {
					path: "$User",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$project: { name: "$User.name", comment: 1 },
			},
		]);

		res.send(comment);
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

export default router;
