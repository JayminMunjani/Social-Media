import express from "express";
import "./db/config.js";
import routers from "./router/index.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "social",
			version: "1.0.0",
			description: "nothing",
		},
		servers: [
			{
				url: "http://localhost:3000",
			},
		],
	},
	apis: ["./src/router/*.js"],
};

const specs = swaggerJSDoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use("/user", routers.userRouter);
app.use("/comment", routers.commentRouter);
app.use("/post", routers.postRouter);
app.use("/like", routers.likeRouter);

app.listen(port, () => {
	console.log(`Server is running on ${port}`);
});
