
var expect = require("chai").expect;
var EditFactory = require('../lib/EditFactory');
var Edit = require('../lib/edit');
describe('EditFactory Test', function()
{
	describe('Create', function()
	{
		it('JIMP', function()
		{
			var decor = new Edit.Decorator();
			var factory = new EditFactory();
			var edit = factory.createEdit('JIMP',decor);
			expect('JIMP').to.equals(edit.type);
		});
	});

	describe('Create', function()
	{
		it('Not Existing Edit', function()
		{
			var decor = new Edit.Decorator();
			var factory = new EditFactory();
			var edit = factory.createEdit('J',decor);
			console.log(edit);
			expect(undefined).to.equals(edit.type);
		});
	});

	describe('Create', function()
	{
		it('Undefined', function()
		{
			var decor = new Edit.Decorator();
			var factory = new EditFactory();
			var edit = factory.createEdit(undefined,decor);
			console.log(edit);
			expect(undefined).to.equals(edit.type);
		});
	});

	describe('NeuralStyle', function()
	{
		it('Undefined', function()
		{
			var decor = new Edit.Decorator();
			var factory = new EditFactory();
			var edit = factory.createEdit('NEURAL',decor);
			console.log(edit);
			expect('NEURAL').to.equals(edit.type);
		});
	});

});