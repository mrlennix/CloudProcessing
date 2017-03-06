var express = require('express');    //Express Web Server
var busboy = require('connect-busboy'); //middleware for form/file upload
var form = ('connect-form');
var path = require('path');     //used for file path
var fs = require('fs-extra');       //File System - for file manipulation
var Jimp = require("jimp");  //used for photo editing
fs = require('fs');
var mongoose    = require('mongoose');
var passport    = require('passport');
var Edit = require('./edit');
var JimpEdit = require('./jimp_edit');
var app = express();
app.use(busboy());
app.use(express.static(path.join(__dirname, '/'))); //first page path of the client

/* ==========================================================
Create a Route (/upload) to handle the Form submission
(handle POST requests to /upload)
Express v4  Route definition
============================================================ */
app.route('/upload').post( function (req, res, next)
{
    var fstream;
    //temp. store stream variables
    var Field ={}; //mapping of key:value of the input stream
    var edit;// store the strategy used (currently only jimp)
    var decor = new Edit.Decorator(); //stores JSON data from client
    var Jimp;//used for jimp edit if uses decide to use jimp editor
    var JSTYLES = JimpEdit.STYLE;//Theses are the jimples styles that come from the jimp_edit module
    var path = '../../img/edited/edited_'; //path to edited files being stored -- TODO: personal user

    //pipe for stream
    req.pipe(req.busboy);

    //Add values to decor
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

    //on files store them into the users image folder
    req.busboy.on('file', function (fieldname, file, filename)
    {
        decor.addValues(fieldname,filename);
        console.log("Uploading: " + filename);
        //Path where image will be uploaded
        //TODO: also check to see if its a image return status code of 400 (Bad Request)
        if(filename.length > 0)
        {
            fstream = fs.createWriteStream(__dirname + '/public/img/' + filename);
            //TODO: change to specific user
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

        //iterate through decor and verify that style is valid; if so, add to edit list
        for(var key in decor.getValues() )
        {
            if(key in JSTYLES) decor.addStyle( key ,JSTYLES[key] );
        }

        //creates new editing object with the specific style
        edit = new Edit( new JimpEdit(decor) );
        var done = edit.algorithm();
         done.then( (fname) =>{
            res.redirect('image?fname=edited_'+fname);           //where to go next
        });
    });
});

// GET method route
// Get path to image on server to be sent to client
app.get('/image', function (req, res)
{
    //path to edited folder
    var des = 'public/img/edited';

    //checks if image exists
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
        username = String(username); //username, password, confirm_pass are sent as object but are cast to strings
        password = String(password);
        confirm_pass = String(confirm_pass);

        //========================================================================================================
        //lets require/import the mongodb native drivers.
        var mongodb = require('mongodb');

        //We need to work with "MongoClient" interface in order to connect to a mongodb server.
        var MongoClient = mongodb.MongoClient;

        // Connection URL. This is where your mongodb server is running.
        var url = 'mongodb://localhost:27017/topaz';

        // Use connect method to connect to the Server
        MongoClient.connect(url, function (err, db)
        {
          if (err)
          {
            console.log('Unable to connect to the mongoDB server. Error:', err);
          }
          else
          {
            //HURRAY!! We are connected. :)
            console.log('Connection established to', url);

            // Get the documents collection
            var collection = db.collection('users');

            //querying for existing user
            collection.findOne({ uname : username}, function(err, doc)
            {
                //if user does not exist, insert into database
                if( doc == null )
                {
                    var user = {uname: username, pass: password};
                    // Insert some users
                    collection.insert([user], function (err, result) {
                      if (err)
                      {
                        console.log(err);
                      }
                      else
                      {
                        console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
                      }
                      });
                }
                //if user does exist, prints to console -- TODO:  create new html page
                else
                {
                    console.log('User already exists');
                    //res.redirect('/create-account.html')
                }
            });
            //Create some users
          }
        });

        //========================================================================================================

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
        //TODO:
        if confirmed{
              redirect to "public/index.html" page
        }
        else {
                redirect to "login" page
        }*/
});
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Listening for client
var server = app.listen(668, function(req, res, next)
{
    console.log('Listening on port %d', server.address().port);

});
