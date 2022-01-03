import express from "express";
import Post from "../models/post.model.js";
import auth from "../middleware/auth.js";
import skipper from "skipper";
import validBase64 from "../helper/help.js";

const router = new express.Router();
router.use(skipper());

/**
 * @swagger
 * /post/upload:
 *   post:
 *     description: upload post here
 *     tags:
 *       - post
 *     parameters:
 *       - in: query
 *         name: Token
 *         description: Enter token here
 *       - in: query
 *         name: base64Image
 *         description: Enter Base64 image string here
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: User delete api
 */

router.post("/upload", async (req, res) => {
	const str = req.body.name;
	// const user = req.user;
	try {
		const path = validBase64(str);
		const post = await Post({
			posts: path,
			// userId: user._id,
		});
		await post.save();
		res.send(path);
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

/*router.post("/upload", auth, async (req, res) => {
	req.file("posts").upload(async (err, uploadedFiles) => {
		if (err) return res.send(500, err);

		const user = req.user;
		const post = new Post({ posts: uploadedFiles[0].fd, user: user.id });
		await post.save();

		return res.json({
			message: uploadedFiles.length + " file(s) uploaded successfully!",
		});
	});
});*/

/**
 * @swagger
 * /post/getAll:
 *   get:
 *     description: get all post
 *     tags:
 *       - post
 *     parameters:
 *       - in: query
 *         name: Token
 *         description: Enter token here
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: User delete api
 */

router.get("/getAll", auth, async (req, res) => {
	const user = req.user;
	try {
		let post = await Post.find({
			user: user._id,
		});
		res.send(post);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

/**
 * @swagger
 * /post/deleteall:
 *   delete:
 *     description: delete use here
 *     tags:
 *       - post
 *     parameters:
 *       - in: query
 *         name: Token
 *         description: Enter token here
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: post delete api
 */

router.delete("/deleteall", auth, async (req, res) => {
	const user = req.user;
	try {
		let post = await Post.deleteMany({
			user: user._id,
		});
		res.json("Deleted...");
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

/**
 * @swagger
 * /post/delete/{postId}:
 *   delete:
 *     description: delete use here
 *     tags:
 *       - post
 *     parameters:
 *       - in: query
 *         name: Token
 *         desciption: Enter Token here
 *         required: true
 *       - in: path
 *         name: postId
 *         description: Enter post id here
 *         type: String
 *         required: true
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: post delete api
 */

router.delete("/delete/:postId", auth, async (req, res) => {
	const user = req.user;
	const id = req.params.postId;
	try {
		let post = await Post.deleteOne({
			_id: id,
			user: user._id,
		});
		if (!post) {
			return new Error("Post not found!!");
		}
		res.json("Deleted...");
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

export default router;
