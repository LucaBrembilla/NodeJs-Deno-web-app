const bcrypt = require('bcrypt');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();

// Authentication of a user:
router.post('/', async (req, res) => {

	if( !req.body.email || !req.body.password){
			return res.status(422).send("Please, provide email and password.");
	}

	const user = await User.findOne( { email: req.body.email });
	if (!user) return res.status(400).send("Invalid email or password");

	const validPassword = await bcrypt.compare(req.body.password, user.password);
	if(!validPassword) return res.status(400).send("Invalid email or password");

	const token = user.generateAuthToken();
	
	res.header("x-auth-token",token).send({ _id: user._id, name: user.name, email: user.email });
});

module.exports = router;