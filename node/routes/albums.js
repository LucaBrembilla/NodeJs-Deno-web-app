const {Album} = require("../models/song");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
	const albums = await Album.find().sort("realeaseDate");
	res.send(albums);
});

/* router.post("/", async (req,res) => {
	const album = new Artist({ 
		alias: req.body.alias, 
		real_name: req.body.real_name, 
		real_surname: req.body.real_surname, 
		band: req.body.band
	});
  await album.save();
  
  res.send(album);
}); */

module.exports = router;