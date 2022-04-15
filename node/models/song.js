const mongoose = require("mongoose");
const {artistSchema} = require("./artist");
const {genreSchema} = require("./genre");

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50
  },
	artist: {
		type: [artistSchema],
		required: true
	},
	genre: {
		type: [genreSchema],
		required: true 
	},
	releaseDate: Date
});

const Song = mongoose.model("Song", songSchema);

exports.songSchema = songSchema;
exports.Song = Song;