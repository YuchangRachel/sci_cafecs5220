var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
const User = require('../models/user');

const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
var passport = require('passport');

/*
router.post('/', (req, res, next) => {
  User.findOne({
	firstName: req.body.username
  }, (err, user) => {
	if (err) return next(err);
	res.json({
	  token: jwt.sign({
		name: user.firstName
	  }, jwtSecret)
	});
  });
});
*/
router.post('/', (req, res, next) => {
	if (!req.body.username || !req.body.password){
		res.status(400).send({
			message: "Missing username and/or password in request"
		});
	}
	console.log('login username = ' + req.body.username);

	User.findOne({
		username: req.body.username
	}, (err, user) => {
		if (err){
			console.log('err = ' + err)
			res.status(500).send({
				message: "Login failure: "+ err
			});
		}
		else {
			if (!user){
				res.status(401).send({
					message: 'Invalid username'
				});
			}
			else {
				bcrypt.compare(req.body.password, user.password, (err, result) => {
					if (req.body.password == user.password){
						payload = {
							id: user._id,
							role: user.role
						}
						token = jwt.sign(payload, jwtSecret);
						res.status(200).send(token);   //if match, server send generated-jwt to client
					}
					else {
						res.status(401).send('Invalid password');
					}
				});

			}
		}
	});

});







module.exports = router;
