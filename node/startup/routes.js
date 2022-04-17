const express = require("express");
const genres = require("../routes/genres");
const artists = require("../routes/artists");
const albums = require("../routes/albums");
const songs = require("../routes/songs");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");


module.exports = function(app) {
	app.use(express.json());
	app.use("/api/genres", genres);
  app.use("/api/artists", artists);
	app.use("/api/albums", albums);
	app.use("/api/songs", songs); 
	//app.use("/api/users", users);
	//app.use("/api/auth", auth);
	app.use(error);
}