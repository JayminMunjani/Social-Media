import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import mime from "mime";

const isBase64 = (str) => {
	const notBase64 = /[^A-Z0-9+\/=]/i;

	const len = str.length;
	if (!len || len % 4 !== 0 || notBase64.test(str)) {
		return false;
	}
	const firstPaddingChar = str.indexOf("=");
	return (
		firstPaddingChar === -1 ||
		firstPaddingChar === len - 1 ||
		(firstPaddingChar === len - 2 && str[len - 1] === "=")
	);
};

const imageValidator = (base64String) => {
	// check valid base64
	let base64Image = base64String.split(";base64,");
	const match = isBase64(base64Image[1]);
	if (!match) {
		throw new Error("image is not valid...");
	}
	console.log("match");
	const base64Extension = base64Image[0].split(":").pop();
	console.log(base64Image);
	const extension = mime.getExtension(base64Extension);

	let image = uuidv4();

	fs.writeFileSync(`./src/uploads/${image}.${extension}`, base64Image[1], {
		encoding: "base64",
	});

	let path = `/src/uploads/${image}.${extension}`;

	return path;
};

export default imageValidator;
