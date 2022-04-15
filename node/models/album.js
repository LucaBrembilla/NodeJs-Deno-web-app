const mongoose = require("mongoose");
const {artistSchema} = require("./artist");
const {genreSchema} = require("./genre");
const {songSchema} = require("./song");

const albumSchema = new mongoose.Schema({
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
		required: false 
	},
	numberOfSongs: {
		type: Number,
		required: false
	},
	songs: {
		type: [songSchema],
		required: true
	},
	releaseDate: Date
});

const Album = mongoose.model("Album", albumSchema);

exports.albumSchema = albumSchema;
exports.Album = Album;