const {Song} = require("../models/song");
const {Artist} = require("../models/artist");
const {Genre} = require("../models/genre");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
	const songs = await Song.find().sort("realeaseDate");
	res.send(songs);
});

router.post("/", [auth, admin], async (req, res) => {
	let artist = await Artist.findById(req.body.artistId[0]);
  if (!artist) return res.status(400).send("Invalid artist.");

  let genre = await Genre.findById(req.body.genreId[0]);
  if (!genre) return res.status(400).send("Invalid genre.");

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
		releaseDate: new Date(req.body.releaseDate)
  });
	
	for(let i = 1; i<req.body.genreId.length; i++){
		genre = await Genre.findById(req.body.genreId[i]);
		if (!genre) return res.status(400).send("Invalid genre."); 
		song.genre.push({ _id: genre._id, name: genre.name });
	}
	for(let i = 1; i<req.body.artistId.length; i++){
		artist = await Artist.findById(req.body.artistId[i]);
		if (!artist) return res.status(400).send("Invalid artist."); 
		song.artist.push({ _id: artist._id, alias: artist.alias });
	}
  await song.save();
  
  res.send(song);
});

router.get("/:id", async (req, res) => {
	const song = await Song.findById(req.params.id);
  if (!song) return res.status(404).send("The song with the given ID was not found.");
  res.send(song);
});


router.put('/:id', auth, async (req, res) => {
  let artist = await Artist.findById(req.body.artistId[0])
  if (!artist) return res.status(400).send('Invalid artist.');

	let genre = await Genre.findById(req.body.genreId[0]);
  if (!genre) return res.status(400).send('Invalid genre.');

  const song = await Song.findByIdAndUpdate(req.params.id,
	{ 
		title: req.body.title,
		artist: {
			_id: artist._id,
			alias: artist.alias, 
		},
		genre: {
			_id: genre._id,
			name: genre.name
		},
		releaseDate: new Date(req.body.releaseDate)
	}, { new: true });
	for(let i = 1; i<req.body.genreId.length; i++){
		genre = await Genre.findById(req.body.genreId[i]);
		if (!genre) return res.status(400).send('Invalid genre.'); 
		song.genre.push({ _id: genre._id, name: genre.name });
	}
	for(let i = 1; i<req.body.artistId.length; i++){
		artist = await Artist.findById(req.body.artistId[i]);
		if (!artist) return res.status(400).send('Invalid artist.'); 
		song.artist.push({ _id: artist._id, alias: artist.alias });
	}
	song.__v++;
	await song.save();

  if (!song) return res.status(404).send('The song with the given ID was not found.');
  
  res.send(song);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const song = await Song.findByIdAndRemove(req.params.id);
  if (!song) return res.status(404).send('The song with the given ID was not found.');
  res.send(song);
});

module.exports = router;