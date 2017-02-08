var expect = require('chai').expect;
var jedit = require('../lib/jimp_edit');
var e = require('../lib/edit');

describe('Edit Test',function()
{
	describe('Expected Value',function()
	{
		it('Decorator Style Test',function()
		{
			 dec = new e.Decorator();
			dec.addStyle( 'blur',jedit.STYLE['blur'] ); 
			expect(undefined).to.not.equal( dec.getStyles()['blur'] );
		});
	});
	describe('Expected Value',function()
	{
		it('Decorator Value Test',function()
		{
			 dec = new e.Decorator();
			dec.addValues( 'blur', 1); 
			expect(1).to.equal( dec.getValues()['blur'] );
		});
	});
});