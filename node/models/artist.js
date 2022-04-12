const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema({
  alias: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50
  },
	real_name: {
		type: String,
    required: false,
    minlength: 1,
    maxlength: 50
	},
	real_surname: {
		type: String,
    required: false,
    minlength: 1,
    maxlength: 50
	},
	band: {
		type: String,
		required: false,
		minlength: 1,
    maxlength: 50
	}
});

const Artist = mongoose.model("Artist", artistSchema);

exports.artistSchema = artistSchema;
exports.Artist = Artist;