const {Genre} = require("../models/genre");
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

router.put('/:id', async (req, res) => {

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true, useFindAndModify: false
  });

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
	genre.__v++;
	await genre.save();

  res.send(genre);
});

router.delete('/:id', async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id, {useFindAndModify: false} );

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});


module.exports = router;