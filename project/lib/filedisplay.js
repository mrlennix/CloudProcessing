//include http, fs and url module
var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    url = require('url');
    imageDir = './public/users/pinky/';
 
//create http server listening on port 3333
http.createServer(function (req, res) {
    //use the url to parse the requested url and get the image name
    var query = url.parse(req.url,true).query;
        pic = query.image;
 
    if (typeof pic === 'undefined') {
        getImages(imageDir, function (err, files) {
            var imageLists = '<ul>';
            for (var i=0; i<files.length; i++) {
                imageLists += '<li><a href="/?image=' + files[i] + '">' + files[i] + '</li>';
            }
            imageLists += '</ul>';
            res.writeHead(200, {'Content-type':'text/html'});
            res.end(imageLists);
        });
    } else {
        //read the image using fs and send the image content back in the response
        fs.readFile(imageDir + pic, function (err, content) {
            if (err) {
                res.writeHead(400, {'Content-type':'text/html'})
                console.log(err);
                res.end("No such image");    
            } else {
                //specify the content type in the response will be an image
                res.writeHead(200,{'Content-type':'image/jpg'});
                res.end(content);
            }
        });
    }
 
}).listen(3333);
console.log("Server running at http://localhost:3333/");
 
//get the list of jpg files in the image dir
function getImages(imageDir, callback) {
    var fileType = '.jpg',
        files = [], i;
    fs.readdir(imageDir, function (err, list) {
        for(i=0; i<list.length; i++) {
            if(path.extname(list[i]) === fileType) {
                files.push(list[i]); //store the file name into the array files
            }
        }
        callback(err, files);
    });
}