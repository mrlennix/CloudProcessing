


function NeuralStyle(context)
{
	this.context = context;
	this.STYLE = STYLE;
	}

NeuralStyle.prototype.algorithm = function()
{
	var context = this.context; //JSON data input from user
	var style = context.getStyles(); //styles that user selected
	var value = context.getValues(); //value of the style, if needed

	console.log("Got here");
	console.log(style);
	console.log(value);

	//returns promise so others know when to execute
	return new Promise ( (res,rej) => {
		var command = 'python ../neural-style/neural_style.py ';
		for (let key in style)
			{
				//style[key](this.command,value[key]);
				command = style[key](command,value[key]);
				// console.log( style[key](command,value[key]));
				

			}
			console.log(command)
			var asyncblock = require('asyncblock');
			var exec = require('child_process').exec;

			asyncblock(function (flow) {
    		exec(command, flow.add());
    		result = flow.wait();
    		console.log(result);    // There'll be trailing \n in the output
    		res(value['output']);
    // Some other jobs
    console.log('More results like if it were sync...');
});

			
	});
}

//Jimp functions for styles
var STYLE =
{
	content: (image,v)=>{image += '--content '+__dirname+'/public/img/'+v + ' '; return image},
	styles: (image,v)=>{image += '--styles '+__dirname+'/public/img/' + v + ' '; return image},
	output: (image,v)=>{image += '--output '+__dirname+'/public/img/edited/edited_' + v + ' '; return image},
	iterations: (image,v)=>{image += '--iterations ' + v + ' '; return image} 

}

module.exports = NeuralStyle;
module.exports.STYLE = STYLE;
