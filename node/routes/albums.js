const {Song} = require("../models/song");
const {Artist} = require("../models/artist");
const {Genre} = require("../models/genre");
const {Album} = require("../models/album");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
	const albums = await Album.find().sort("realeaseDate");
	res.send(albums);
});

router.post("/", async (req,res) => {
	let artist = await Artist.findById(req.body.artistId[0]);
  if (!artist) return res.status(400).send("Invalid artist.");

	let song = await Song.findById(req.body.songId[0]);
	if (!song) return res.status(400).send("Invalid song.");

	let genre = await Genre.findById(req.body.genreId[0]);
	if (!genre) return res.status(400).send("Invalid genre.");

	let album = new Album({ 
		title: req.body.title,
		artist: {
      _id: artist._id,
      alias: artist.alias, 
    },
		songs: {
			_id: song._id,
			title: song.title,
			genre: song.genre,
			artist: song.artist
		},
		genre: {
			_id: genre._id,
      name: genre.name
		},
		releaseDate: new Date(req.body.releaseDate)
	});
	for(let i = 1; i<req.body.genreId.length; i++){
		genre = await Genre.findById(req.body.genreId[i]);
		if (!genre) return res.status(400).send('Invalid genre.'); 
		album.genre.push({ _id: genre._id, name: genre.name });
	}
	for(let i = 1; i<req.body.artistId.length; i++){
		artist = await Artist.findById(req.body.artistId[i]);
		if (!artist) return res.status(400).send('Invalid artist.'); 
		album.artist.push({ _id: artist._id, alias: artist.alias });
	}
	for(let i = 1; i<req.body.songId.length; i++){
		song = await Song.findById(req.body.songId[i]);
		if (!song) return res.status(400).send('Invalid song.'); 
		album.songs.push({ _id: song._id, title: song.title, genre: song.genre, artist: song.artist});
	}

  await album.save();
  
  res.send(album);
}); 

router.get("/:id", async (req, res) => {
	const album = await Album.findById(req.params.id);
  if (!album) return res.status(404).send('The album with the given ID was not found.');
  res.send(album);
});

router.put('/:id', async (req, res) => {
  let artist = await Artist.findById(req.body.artistId[0])
  if (!artist) return res.status(400).send('Invalid artist.');

	let genre = await Genre.findById(req.body.genreId[0]);
  if (!genre) return res.status(400).send('Invalid genre.');

	let song = await Song.findById(req.body.songId[0]);
	if (!song) return res.status(400).send("Invalid song.");

  let album = new Album({ 
		title: req.body.title,
		artist: {
      _id: artist._id,
      alias: artist.alias, 
    },
		songs: {
			_id: song._id,
			title: song.title,
			genre: song.genre,
			artist: song.artist
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
		album.genre.push({ _id: genre._id, name: genre.name });
	}
	for(let i = 1; i<req.body.artistId.length; i++){
		artist = await Artist.findById(req.body.artistId[i]);
		if (!artist) return res.status(400).send('Invalid artist.'); 
		album.artist.push({ _id: artist._id, alias: artist.alias });
	}
	for(let i = 1; i<req.body.songId.length; i++){
		song = await Song.findById(req.body.songId[i]);
		if (!song) return res.status(400).send('Invalid song.'); 
		album.songs.push({ _id: song._id, title: song.title, genre: song.genre, artist: song.artist});
	}
	await song.save();

  if (!album) return res.status(404).send('The album with the given ID was not found.');
  
  res.send(album);
});

router.delete('/:id', async (req, res) => {
  const album = await Album.findByIdAndRemove(req.params.id);
  if (!album) return res.status(404).send('The album with the given ID was not found.');
  res.send(album);
});

module.exports = router;