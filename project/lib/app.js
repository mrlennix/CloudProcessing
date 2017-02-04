var express = require('express');
var app= express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//connect to mongo db
var db = mongoose.connect('mongodb://localhost/images');

app.get('/', (req,res) =>
{
	res.send(" use the route /api/images <p> <a href= \" https://www.youtube.com/watch?v=eB9Fq9I5ocs\"  >reference</a> <\p>  ");
});

app.listen(9999);
console.log('Starting on port 9999...');