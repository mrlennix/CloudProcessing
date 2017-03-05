var express = require('express');    //Express Web Server
var busboy = require('connect-busboy'); //middleware for form/file upload
var form = ('connect-form');
var path = require('path');     //used for file path
var fs = require('fs-extra');       //File System - for file manipulation
var Jimp = require("jimp");
fs = require('fs');
var mongoose    = require('mongoose');
var passport    = require('passport');
var Edit = require('./edit');
var JimpEdit = require('./jimp_edit');
var app = express();
app.use(busboy());
app.use(express.static(path.join(__dirname, '/')));
 
/* ==========================================================
Create a Route (/upload) to handle the Form submission
(handle POST requests to /upload)
Express v4  Route definition
============================================================ */

app.route('/upload').post( function (req, res, next) 
{
    
    var fstream;
    //temp. store stream variables
    var Field ={}; //mapinging of key:value of the input stream
    var edit;// store the strategy used (currently only jimp)
    var decor = new Edit.Decorator();
    var Jimp;//used for jimp edit if uses decide to use jimp editor
    var JSTYLES = JimpEdit.STYLE;//Theses are the jimples styles that come from the jimp_edit module
    var path = '../../img/edited/edited_';
    //pipe for stream
    req.pipe(req.busboy);


    req.busboy.on('field',function(n,v,t,vt)
    {
        //for each field in the stream store output
        if( n in decor.getValues() )
        {
            let temp =  decor.getValues()[n] +","+v;
            
            decor.addValues(n , temp.split(',') );
        }

        else decor.addValues(n,v);
    });

    //on files store them int the users image folder
    req.busboy.on('file', function (fieldname, file, filename) 
    {
        
        decor.addValues(fieldname,filename);
        console.log("Uploading: " + filename);
        //Path where image will be uploaded
        //TODO: also check to see if its a image return status code of 400 (Bad Request)
        if(filename.length > 0)
        {
         	fstream = fs.createWriteStream(__dirname + '/public/img/' + filename);
            	
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
            res.redirect(300);
	    }
        
    });

    //when busboy finishes run editing algorithm below
    req.busboy.on('finish',()=>{
        
        console.log(decor.getValues());
        // decor.getValues().background1 = "0x" + decor.getValues().background1.substr(1) + "FF";

        for(var key in decor.getValues() )
        {
            
            if(key in JSTYLES) decor.addStyle( key ,JSTYLES[key] );
        }
        
        edit = new Edit( new JimpEdit(decor) );
        var done = edit.algorithm();
         done.then( (fname) =>{
            res.redirect('image?fname=edited_'+fname);           //where to go next



        });

    });

});




// GET method route
app.get('/image', function (req, res) 
{
    //path to edited folder
    var des = 'public/img/edited';
    // fresh90
    
    if( fs.existsSync( path.join(__dirname, "/public/img/edited", req.query.fname ) ) == false)
    {
        res.status(400).send("File not found!  " +path.join(__dirname, "/public/img/edited", req.query.fname ));
    }
    else
    {
        res.sendFile( path.join(__dirname, des, req.query.fname) );
    }

});

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// user login and authentication. whould have the capability 
//of connecting to databse, take input and store on the database
app.get('/', function(req, res) {

    res.sendFile(path.join(__dirname + '/loginHTML.html'));

});


app.get('/getemail', function(req, res, next) {

        
        var username = req.query.uname;
        var password = req.query.psw;
        var confirm_pass = req.query.confpsw;
        username = String(username);
        password = String(password);
        confirm_pass = String(confirm_pass);

        //These if statements were created for testing purposes. they should 
        //rather be used to check inputs existence in database
         if ( String(confirm_pass) === "undefined") {
             //res.send(username);
             console.log("user name: " + username);
             console.log('Password:  ' + password);
             res.redirect('/public');

         } 
         else if ((confirm_pass != "undefined")) {
             //res.send(username);
             console.log("user name: " + username);
             console.log('Password:  ' + password);
             console.log('Conf-Password:  ' + confirm_pass);
             res.redirect('/');
         }
         else {

            console.log("Input is empty >>>>>>>");
             res.redirect(300);
         }
         
        /*get user data and check with database for authenticity

        if confirmed{
              redirect to "public/index.html" page
        }
        else {
                redirect to "login" page
        }*/

});
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var server = app.listen(668, function(req, res, next) 
{
    console.log('Listening on port %d', server.address().port); 

});


