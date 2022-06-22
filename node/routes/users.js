const bcrypt = require('bcrypt');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();

// Registring new user:
router.post('/', async (req, res) => {

	let user = await User.findOne( { email: req.body.email });
	if (user) return res.status(400).send("User already registered");

  user = new User( { name: req.body.name, email: req.body.email, password: req.body.password});

	const salt = await bcrypt.genSalt(8); 
	user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  res.header("x-auth-token",token).send({ _id: user._id, name: user.name, email: user.email });
});

module.exports = router;