


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
	value['output']=value['content']
	console.log(value['output'])
	//returns promise so others know when to execute
	return new Promise ( (res,rej) => {
		var command = 'python ../neural-style/neural_style.py ';
		for (let key in style)
			{
				//style[key](this.command,value[key]);
				// console.log(command)
				command = style[key](command,value);
				
				// console.log( style[key](command,value[key]));
				

			}

			console.log(command)
			var asyncblock = require('asyncblock');
			var exec = require('child_process').exec;

			asyncblock(function (flow) {
    		exec(command, flow.add());
    		var result = flow.wait();
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
	content: (image,v)=>{image += '--content '+'./public/users/'+v['username']+'/album/'+ v['content']+' '; return image},
	styles: (image,v)=>{image += '--styles '+ './public/users/'+v['username']+'/album/'+ v['styles']+' '; return image},
	output: (image,v)=>{image += '--output '+ './public/users/'+v['username']+'/cache/'+ v['content']+' ' ; return image},
	iterations: (image,v)=>{image += '--iterations ' + v['iterations'] + ' '; return image} 

}

module.exports = NeuralStyle;
module.exports.STYLE = STYLE;
