const {Song} = require("../models/song");
const {Artist} = require("../models/artist");
const {Genre} = require("../models/genre");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
	const songs = await Song.find().sort("realeaseDate");
	res.send(songs);
});

router.post('/', async (req, res) => {
	const artist = await Artist.findById(req.body.artistId);
  if (!artist) return res.status(400).send('Invalid artist.');

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  let song = new Song({ 
		title: req.body.title,
    artist: {
      _id: artist._id,
      alias: artist.alias, 
    },
    genre: {
      _id: genre._id,
      name: genre.name
    },
		releaseDate: req.body.releaseDate
  });
  await song.save();
  
  res.send(song);
});

module.exports = router;