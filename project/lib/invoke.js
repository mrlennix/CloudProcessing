var exec = require('child_process').exec;
var result = '';
var plat = process.platform;
var child = "";
var captured_decor = ""
var sourceFile = require('./server.js');

var
console.log(sourceFile.variableName);

var newlist = sourceFile.templist;
console.log(newlist);

//check which platform python will be running on
if (plat === "win32")
{
  child = exec('py -3.6 test.py Penguins.jpg greyscale');
}
else if (plat === "linux")
{
  child = exec('python3 test.py Penguins.jpg greyscale')
}

child.stdout.on('data', function(data) {
    result += data;
});

child.on('close', function() {
    console.log('done spawning');
    console.log(result);
    console.log(plat);
});
