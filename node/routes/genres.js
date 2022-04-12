const {Genre} = require("../models/genre");
//const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
	const genres = await Genre.find().sort("name");
	res.send(genres);
});

router.post("/", async (req,res) => {
	const genre = new Genre({ name: req.body.name });
  await genre.save();
  
  res.send(genre);
});

module.exports = router;