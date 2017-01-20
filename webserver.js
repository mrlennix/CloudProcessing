var http = require('http'),
    fs = require('fs');
    path = require('path'),

//app.use(express.bodyParser({uploadDir:'./'})); // TODO: compile with Express -> http://stackoverflow.com/questions/15772394/how-to-upload-display-and-save-images-using-node-js-and-express

fs.readFile('./webapp.html', function (err, html) {
    if (err) {
        throw err;
    }

    http.createServer(function(request, response) {
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.write(html);
        response.end();
    }).listen(668);
});
