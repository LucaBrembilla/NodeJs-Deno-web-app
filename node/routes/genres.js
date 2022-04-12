const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
	const genres = await Genre.find().sort("name");
	res.send(genres);
});