

function dbmanager()
{
	//connect the database
	this.connect('./lib/database/topaz.db')
}

dbmanager.prototype.sqlite3 = require('sqlite3').verbose();

dbmanager.prototype.connect = function(dbpath)
{
	//connect to database
	this.db = new this.sqlite3.Database(dbpath);
	

}

dbmanager.prototype.getImage = function( fname, uname )
{

	return new Promise( (res, rej) => {
		
		//get image from database
		var q="SELECT image FROM IMAGE WHERE fname='"+fname+"' AND uname='"+uname+"';";
		
		this.db.all(q, function(err,rows)
		{
			if(err)
			{
				//fix later so it doesn't crash server
				console.log("Err lol");
				rej("ERROR");
				throw err;
				
			}
			var image=rows[0].image;
			console.log( "IMAGE:");
			console.log( image );
			res( image );
		});
	} );
	

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