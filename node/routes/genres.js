const Genre = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
	const genres = await Genre.find().sort("name");
	res.send(genres);
});

module.exports = router;