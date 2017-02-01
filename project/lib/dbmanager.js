

function dbmanager()
{
	//connect the database
	this.connect()
}

dbmanager.prototype.connect = function()
{
	//connect to database
	console.log("connecting to database");
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