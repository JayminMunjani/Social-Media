import express from "express";
import User from "../models/user.model.js";
import auth from "../middleware/auth.js";

const router = new express.Router();

/**
 * @swagger
 * /user/register:
 *   post:
 *     description: Returns the homepage
 *     tags:
 *       - user
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

router.post("/register", (req, res) => {
	const user = new User(req.body);
	try {
		user.save();
		res.send(user);
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

/**
 * @swagger
 * /user/login:
 *   post:
 *     description: login here
 *     tags:
 *       - user
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
 *         description: User login api
 */

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.verifyPassword(email, password);
		const token = await user.generateToken();
		res.send(user);
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

/**
 * @swagger
 * /user/all:
 *   get:
 *     description: Get all users data here
 *     tags:
 *       - user
 *     responses:
 *       200:
 *         description: User get api
 */

router.get("/all", async (req, res) => {
	try {
		const user = await User.aggregate([{ $sort: { name: -1 } }]);
		res.send(user);
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

/**
 * @swagger
 * /user/delete:
 *   delete:
 *     description: delete use here
 *     tags:
 *       - user
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

router.delete("/delete", auth, async (req, res) => {
	try {
		const user = req.user;
		await user.deleteOne();
		res.json("Deleted..");
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

export default router;
