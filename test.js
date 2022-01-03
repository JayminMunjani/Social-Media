import axios from "axios";
import fs from "fs";
import path from "path";
import mime from "mime-types";

const str = fs
	.readFileSync("./src/pexels-karolina-grabowska-5717647.jpg")
	.toString("base64");
var ext = path.extname("./src/pexels-karolina-grabowska-5717647.jpg");
var mimeType = mime.lookup(ext);

var data = JSON.stringify({
	name: `data:${mimeType};base64,${str}`,
});

var config = {
	method: "post",
	url: "http://localhost:3000/post/upload",
	headers: {
		Authorization:
			"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxY2MxYzU0ZWNiNGE4NGMyYWIzYTIwZSIsImlhdCI6MTY0MDc2NjU1NSwiZXhwIjoxNjQwODUyOTU1fQ.KUrLWRkCa1s6bCT9fZOEHs-UeVHqWokL_fnfNLLwWEA",
		"Content-Type": "application/json",
	},
	data: data,
};

axios(config)
	.then(function (response) {
		console.log(JSON.stringify(response.data));
	})
	.catch(function (error) {
		console.log(error);
	});
