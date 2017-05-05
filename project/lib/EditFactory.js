var JimpEdit = require('./jimp_edit');
var NeuralStyle = require('./neural');
var OPENCV = require('./opencv')
//Factory Object 
function EditFactory (username)
{
	this.username = username;
}

//Method responsible for creating the requested edit
EditFactory.prototype.createEdit = function(type,data)
{
	let edit = {};//used if no object exists

	if(type == 'JIMP')
	{
		
		edit = new JimpEdit(data, this.username)
	}
	else if (type == 'OPENCV')
	{
		edit = new OPENCV(data);
	}
	else if (type == 'NEURAL'){

		edit = new NeuralStyle(data); 
	}
	else
	{
		edit = new JimpEdit(data)
		type = 'JIMP';

	}


	edit.type =type;

	return edit;
}

module.exports = EditFactory;