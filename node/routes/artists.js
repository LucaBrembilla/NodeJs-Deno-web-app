const {Artist} = require("../models/artist");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
	const artists = await Artist.find().sort("alias").select("alias");
	res.send(artists);
});

router.post("/", async (req,res) => {
	const artist = new Artist({ 
		alias: req.body.alias, 
		real_name: req.body.real_name, 
		real_surname: req.body.real_surname, 
		band: req.body.band
	});
  await artist.save();
  
  res.send(artist);
});

module.exports = router;