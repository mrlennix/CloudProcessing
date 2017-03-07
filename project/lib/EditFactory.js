var JimpEdit = require('./jimp_edit');

//Factory Object 
function EditFactory ()
{

}

//Method responsible for creating the requested edit
EditFactory.prototype.createEdit = function(type,data)
{
	let edit = {};//used if no object exists

	if(type == 'JIMP')
	{
		edit = new JimpEdit(data)
	}
	else if (type == 'OPENCV')
	{

	}
	else
	{
		type = undefined;
	}


	edit.type =type;

	return edit;
}

module.exports = EditFactory;