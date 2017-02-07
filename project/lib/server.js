var express = require('express');    //Express Web Server
var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fs = require('fs-extra');       //File System - for file manipulation
var Jimp = require("jimp");
var app = express();
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));
 
/* ==========================================================
Create a Route (/upload) to handle the Form submission
(handle POST requests to /upload)
Express v4  Route definition
============================================================ */
app.route('/upload').post(function (req, res, next) 
{
    
    var fstream;
    //temp. store stream variables
    var Field ={}; //mapinging of key:value of the input stream
    var inames =[]//names of each of the images
    var icount=0;//keeps track of how many images
    var path = '../../img/edited/edited_';
    //pipe for stream
    req.pipe(req.busboy);
        
    req.busboy.on('field',function(n,v,t,vt)
    {
        //for each field in the stream store output
        Field[n]=v;
    });

    //on files store them int the users image folder
    req.busboy.on('file', function (fieldname, file, filename) 
    {
        inames[icount++]=filename;
            
        console.log("Uploading: " + filename);
        //Path where image will be uploaded
        //TODO: also check to see if its a image return status code of 400 (Bad Request)
        if(filename.length > 0)
        {
         	fstream = fs.createWriteStream(__dirname + '/../img/' + filename);
            	
            file.pipe(fstream);

        	fstream.on('close', function () 
            {   	
                console.log("Upload Finished of " + filename);
            });

        }
        else
        {
            console.log("No file was uploaded!");
            console.log("upload a file...");
            res.redirect(300,'back');
	    }
        
    });

    //when busboy finishes run editing algorithm below
    req.busboy.on('finish',()=>
    {
        //TODO: If any of the values are null, then
        //set them to the defualt min value.
        Jimp.read("../img/"+inames[icount-1], function (err, image)
        {
            //TODO: If error delete image from server and return
            //a status code of 100
            if (err){throw err;} 
                    
            image.resize(256, 256) // resize
            .quality(parseInt(Field['quality'])) // set JPEG quality
            .greyscale()// set greyscale
            .write("./../img/edited/edited_"+inames[icount-1]); // save
            res.redirect('image?fname=edited_' + inames[icount-1]);           //where to go next

        });
    });

});


// GET method route
app.get('/image', function (req, res) 
{
    //path to edited folder
    var des = '../img/edited';

    if( fs.existsSync( path.join(__dirname, "../img/edited", req.query.fname ) ) == false)
    {
        res.status(400).send("File not fount!");
    }
    else
    {
        res.sendFile( path.join(__dirname, des, req.query.fname) );
    }

});

var server = app.listen(668, function() 
{
    console.log('Listening on port %d', server.address().port);
});


