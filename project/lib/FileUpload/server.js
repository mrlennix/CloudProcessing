var express = require('express');    //Express Web Server
var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fs = require('fs-extra');       //File System - for file manipulation
var Jimp = require("jimp");
var flag = 0;
var app = express();
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/img')); 
/* ==========================================================
Create a Route (/upload) to handle the Form submission
(handle POST requests to /upload)
Express v4  Route definition
============================================================ */
app.route('/upload')
    .post(function (req, res, next) {

        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);

            //Path where image will be uploaded
            if(filename.length > 0)
            {
            	fstream = fs.createWriteStream(__dirname + '/img/' + filename);
            	file.pipe(fstream);
            	fstream.on('close', function () {
               		console.log("Upload Finished of " + filename);

		Jimp.read("./img/Koala.jpg", function (err, image) {
    			if (err) throw err;
    			image.resize(256, 256)            // resize
         			.quality(60)                 // set JPEG quality
         			.greyscale()                 // set greyscale
         			.write("./img/edited/edited_"+filename); // save
		});
               		res.redirect('back');           //where to go next
	    	});
            }
            else
            {
		console.log("No file was uploaded!");
		console.log("upload a file...");
		res.redirect('back');
	    }
	});
    });
var server = app.listen(668, function() {
    console.log('Listening on port %d', server.address().port);
});