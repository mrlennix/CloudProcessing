Jimp = require('jimp');

function JimpEdit(context, username)
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
	this.username = username;
}

JimpEdit.prototype.algorithm = function()
{
	var context = this.context; //JSON data input from user
	var style = context.getStyles(); //styles that user selected
	var value = context.getValues(); //value of the style, if needed

	//returns promise so others know when to execute
	return new Promise ( (res,rej) => {
		//reads image and performs edits
		Jimp.read(value['path']).then( function(image)
		{
			for (let key in style)
			{
				style[key](image,value[key]);

			}
			image.write(value['save']);

			res(value['content']);

		}).catch( (err) => { console.log(err);rej(undefined); } );
	});
}

//Jimp functions for styles
var STYLE =
{
	crop: (image,v)=>{image.crop(parseInt(v[0]),parseInt(v[1]),parseInt(v[2]),parseInt(v[3])); },
	flip: (image,v)=>{  image.flip(v[0],v[1]);},
	brightness: (image,v)=>{image.brightness(parseInt(v))},
	fade: (image,v)=>{image.fade(parseInt(v))},
	background: (image,v)=>{image.background(''+v)},
	gaussian: (image,v)=>{image.gaussian(parseInt(v))},
	blur: (image,v)=>{ image.blur( parseInt(v) )},
	posterize: (image,v)=>{image.posterize(parseInt(v))},
	sepia: (image,v)=>{image.sepia()},
	greyscale: (image,v)=>{image.greyscale()},
	invert: (image,v)=>{image.invert()},
	mirror: (image,v)=>{image.mirror(v[0],v[1])},
	mask: (image,v)=>{image.mask(v[0],v[1],v[2])}
}

module.exports = JimpEdit;
module.exports.STYLE = STYLE;
