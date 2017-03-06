//Constructor
//
function Edit(edit)
{
	this.edit = edit;
}

Edit.prototype.algorithm = function()
{
	return this.edit.algorithm();
}

function EditDecorator ()
{
	this.styles = {};
	this.values= {};
}

EditDecorator.prototype.addStyle = function (key,style){
	this.styles[key]=style;
}

EditDecorator.prototype.addValues = function(key,field){
	this.values[key] = field;
}

EditDecorator.prototype.getStyles = function() {
	return this.styles;
}

EditDecorator.prototype.getValues = function(){
	return this.values;
}

module.exports = Edit;
module.exports.Decorator = EditDecorator;
