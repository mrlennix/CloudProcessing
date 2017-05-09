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
var EditFactory = require('./EditFactory');
//var timeout = express.timeout
var timeout = require('connect-timeout');
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
    
    // var username = req.cookie['username']
    console.log(req.headers['cookie'])
    var username = req.headers['cookie']
    username = username.split('=')
    username = username[1]
    // console.log("Now this =========", username)
    var path = '../../users/'+username+'/cache'; //path to edited files being stored -- TODO: personal user
    // console.log("username = " + username);
    decor.addValues('username',username);
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
        // console.log("Uploading: " + filename);
        //Path where image will be uploaded
        //TODO: also check to see if its a image return status code of 400 (Bad Request)
        if(filename.length > 0)
        {
            fstream = fs.createWriteStream(__dirname + '/public/users/'+username+'/album/' + filename);
            //TODO: change to specific user
            file.pipe(fstream);

            fstream.on('close', function ()
            {
                // console.log("Upload Finished of " + filename);
            });
        }
        else
        {
            // console.log("No file was uploaded!");
            // console.log("upload a file...");
            // res.redirect(300);
            res.redirect('public/select_image.html');
        }

    });


    req.busboy.on('text', function (fieldname, file, filename)
    {

        decor.addValues(fieldname,filename);
        console.log("Uploading: " + filename);
        //Path where image will be uploaded
        //TODO: also check to see if its a image return status code of 400 (Bad Request)
        if(filename.length > 0)
        {
            fstream = fs.createWriteStream(__dirname + '/public/users/'+username+'/cache/' + filename);
            //TODO: change to specific user
            file.pipe(fstream);

            fstream.on('close', function ()
            {
                // console.log("Upload Finished of " + filename);
            });
        }
        else
        {
            // console.log("No file was uploaded!");
            // console.log("upload a file...");
            // // res.redirect(300);
            res.redirect("public/select_image.html");
        }s

    });

    //when busboy finishes run editing algorithm below
    req.busboy.on('finish',()=>{

        //console.log(decor.getValues());

        factory = new EditFactory(username);
        // if(decor.getValues()['fname'].includes('edited_')){
        //      decor.addValues('path','./public/users/'+username+'/cache/'+ decor.getValues()['fname']);
        //      decor.addValues('save',"./public/users/"+username+'/cache/'+decor.getValues()['fname']);
        //     }
        // else{
        //      decor.addValues('path','./public/users/'+username+'/album/'+decor.getValues()['fname']);
        //      decor.addValues('save',"./public/users/"+username+'/cache/edited_'+decor.getValues()['fname']);
        //     }
        edit = factory.createEdit(decor.getValues()['type'], decor)
        if(edit.type == undefined)
        {
            res.statusCode = 400
            res.send(400, "Something went wrong");
            return
        }
        // decor.getValues().background1 = "0x" + decor.getValues().background1.substr(1) + "FF";

        //iterate through decor and verify that style is valid; if so, add to edit list
        for(var key in decor.getValues() )
        {
            if(key in edit.STYLE) decor.addStyle( key ,edit.STYLE[key] );
        }

        //creates new editing object with the specific style
        //edit = new Edit( new JimpEdit(decor) );
        
        
        var done = edit.algorithm();
         done.then( (fname) =>{
            // console.log("-------------------------")
            // if(decor.getValues()['fname'].includes('edited_')){
            //      res.redirect('/image?fname='+fname);
            //  }
            // else{
            //      res.redirect('/image?fname=edited_'+fname); 
            //  }
             res.redirect('/public/usr_images.html');

                     //where to go next
            //res.redirect('/username?fname=edited_'+fname);
            
        });
    });
});

// GET method route
// Get path to image on server to be sent to client

app.get('/image', function (req, res)
{
    var username = req.headers['cookie']
    username = username.split('=')
    username = username[1]
    //path to edited folder
    var des = 'public/users/'+username+'/cache';

    //checks if image exists
    if( fs.existsSync( path.join(__dirname, "/public/users/"+username+'/cache', req.query.fname ) ) == false)
    {
        res.status(400).send("File not found!  " +path.join(__dirname, "/public/users/"+username+'/cache', req.query.fname ));
    }
    else
    {
        res.sendFile( path.join(__dirname, des, req.query.fname) );
       
        
    }


});




app.get('/all', function (req, res)
{
    
         var username = req.headers['cookie']
         username = username.split('=')
         username = username[1]
        var obj = {};
        var fileType = '.jpg',
        files = [], i;

        fs.readdir(path.join(__dirname, "/public/users/"+username+'/cache'), function (err, list) {
            for(i=0; i<list.length; i++) 
            {
                
                    files.push(list[i]); //store the file name into the array files
                    obj[i] = list[i];

                
           
            }
       
            res.send(obj);
            // res.render(__dirname + "/public/usr_image.html", {F:obj});
          
        });
        
});


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// user login and authentication. whould have the capability
//of connecting to databse, take input and store on the database
app.get('/', function(req, res) {

    res.sendFile(path.join(__dirname + '/loginHTML.html'));

});


app.get('/login', function(req, res, next) {
        //made global temporarily
        var username = req.query.uname;
        var password = req.query.psw;
        username = String(username); //username, password, confirm_pass are sent as object but are cast to strings
        password = String(password);

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
            // console.log('Unable to connect to the mongoDB server. Error:', err);
          }
          else
          {
            //HURRAY!! We are connected. :)
            // console.log('Connection established to', url);

            // Get the documents collection
            var collection = db.collection('users');
            
            //To remove the users from db:
            //collection.remove({});
            
            //querying for user
            collection.findOne({ uname : username}, function(err, doc)
            {
                //if user does exist check pass.
                if( doc != null )
                {
                    //var user = {uname: username, pass: password};
                    // console.log(doc.uname);
                    // console.log(doc.pass);
                    // console.log(password);
                    //if password matches db it will send to the editing page
                    if (password===String(doc.pass))
                    {
                        // console.log('correct password');
                        res.cookie('username', doc.uname)

                        res.redirect('/public');
                    }
                    //if password does not match that from the db it will redirect to wrong pass page
                    else {
                        // console.log('wrong password');
                        res.redirect('/loginHTML(wrong-pass).html');
                    }
                    
                }
                //if user does not exist it will redirect to fail page
                else
                {
                    // console.log('User does not exist');
                    res.redirect('/loginHTML(wrong-pass).html');
                }
            });
          }
        });

});







app.get('/create-account', function(req, res, next) {
        var usernm = req.query.uname;
        var password = req.query.psw;
        var confirm_pass = req.query.confpsw;
        usernm = String(usernm); //username, password, confirm_pass are sent as object but are cast to strings
        password = String(password);
        confirm_pass = String(confirm_pass);

        if(confirm_pass!=password){
            res.redirect('/create-account(pass-notmatch).html');
        }
        else{

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
                // console.log('Unable to connect to the mongoDB server. Error:', err);
              }
              else
              {
                //HURRAY!! We are connected. :)
                // console.log('Connection established to', url);

                // Get the documents collection
                var collection = db.collection('users');

                //querying for existing user
                collection.findOne({ uname : usernm}, function(err, doc)
                {
                    //if user does not exist, insert into database
                    if( doc == null )
                    {
                        var user = {uname: usernm, pass: password};
                        // Insert some users
                        collection.insert([user], function (err, result) {
                          if (err)
                          {
                            console.log(err);
                          }
                          else
                          {
                            // console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
                          }
                          });
                        var dir='./public/users/'+usernm;
                        var cachedir='./public/users/'+usernm+'/cache';
                        var albumdir='./public/users/'+usernm+'/album';
                        fs.mkdirSync(dir);

                        fs.mkdirSync(cachedir);
                        //console.log()
                        fs.mkdirSync(albumdir);
                        res.redirect('/loginHTML.html')
                    }
                    //if user does exist, prints to console -- TODO:  create new html page
                    else
                    {
                        // console.log('User already exists');
                        res.redirect('/create-account(failed-attempt).html')
                    }
                });
                //Create some users
              }
            });
        }

  
});
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Listening for client

app.use(timeout('1s'));
var server = app.listen(668, function(req, res, next)
{
   console.log('Listening on port %d', server.address().port);

});



