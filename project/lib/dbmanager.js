

function dbmanager()
{
	//connect the database
	this.connect('./topaz.db')
}

dbmanager.prototype.sqlite3 = require('sqlite3').verbose();

dbmanager.prototype.connect = function(dbpath)
{
	//connect to database
	this.db = new this.sqlite3.Database(dbpath);
	return 0;

}

dbmanager.prototype.getImage = function()
{
	//get image from database
	console.log("get image");
	return 0;

}


dbmanager.prototype.putImage = function()
{
	//put image into database
	console.log("put image");
	return 0;

}

dbmanager.prototype.getUser = function()
{
	//get image from database
	console.log("get user");
	return 0;
}


dbmanager.prototype.putUser = function()
{
	//put image into database
	console.log("put user");
	return 0;

}


module.exports = new dbmanager;