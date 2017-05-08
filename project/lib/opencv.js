var exec = require('child_process').exec;
var result = '';
var plat = process.platform;
var child = "";
var captured_decor = ""
var sourceFile = require('./server.js');

function opencv(context)
{
	
	 if(context.getValues()['fname'].includes('edited_'))
	 {
             context.addValues('path','./public/users/'+context.getValues()['username']+'/cache/'+ context.getValues()['fname']);
             context.addValues('save',"./public/users/"+context.getValues()['username']+'/cache/'+context.getValues()['fname']);
            }
        else{
             context.addValues('path','./public/users/'+context.getValues()['username']+'/album/'+context.getValues()['fname']);
             context.addValues('save',"./public/users/"+context.getValues()['username']+'/cache/edited_'+context.getValues()['fname']);
            }

    this.context = context;
	this.STYLE = STYLE;
}

opencv.prototype.algorithm = function()
{
	var context = this.context; //JSON data input from user
	var style = context.getStyles(); //styles that user selected
	var value = context.getValues(); //value of the style, if needed
	console.log("Got here")
	var command = ""
	return new Promise ((res,rej)  =>{
		//open cv call goes here
		console.log(sourceFile.variableName);

		var newlist = sourceFile.templist;
		console.log(__dirname);

		//check which platform python will be running on

		for (key in style)
		{

			if (plat === "win32")
			{
				command +='py -3.4 test.py '+value['path']+ STYLE[key] +value['save'];
				console.log('the command is: '+command);
			    child = exec(command);
			}
			else if (plat === "linux")
			{
				command+='python3 test.py '+value['path'] + STYLE[key] +value['save'];
				console.log('the command is: '+command);
			    child = exec(command)
			}

			child.stdout.on('data', function(data) {
			    result += data;
			});

			child.on('close', function() {
			    console.log('done spawning');
			    console.log(result);
			    console.log(plat);
			});
		}
			res(value['output']);
		});
}
STYLE = 
{
	greyscale: " greyscale ",
	gaussian: " gaussian ",
	blur: " blur ",
	invert:" invert "
}
module.exports = opencv;
module.exports.STYLE = STYLE;
