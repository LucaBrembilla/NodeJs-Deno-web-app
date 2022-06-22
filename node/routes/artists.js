const {Artist} = require("../models/artist");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
	const artists = await Artist.find().sort("alias").select("alias");
	res.send(artists);
});

router.post("/", [auth, admin], async (req,res) => {
	const artist = new Artist({ 
		alias: req.body.alias, 
		real_name: req.body.real_name, 
		real_surname: req.body.real_surname, 
		band: req.body.band
	});
  await artist.save();
  
  res.send(artist);
});

router.get('/:id', async (req, res) => {
  const artist = await Artist.findById(req.params.id);
  if (!artist) return res.status(404).send('The artist with the given ID was not found.');
  res.send(artist);
});

router.put('/:id', auth, async (req, res) => {
	const newArtist = new Artist({ 
		alias: req.body.alias, 
		real_name: req.body.real_name, 
		real_surname: req.body.real_surname, 
		band: req.body.band
	});
  const artist = await Artist.findByIdAndUpdate(req.params.id, {  
		newArtist }, 
		{ new: true, useFindAndModify: true
  });
  if (!artist) return res.status(404).send('The artist with the given ID was not found.');

	artist.__v++;
	await artist.save();

  res.send(artist);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const artist = await Artist.findByIdAndRemove(req.params.id, {useFindAndModify: false} );

  if (!artist) return res.status(404).send('The artist with the given ID was not found.');

  res.send(artist);
});

module.exports = router;