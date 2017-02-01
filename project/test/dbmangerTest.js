
var expect = require("chai").expect;
var dbmanager = require("../lib/dbmanager");


describe ("Database Test",function()
{
        describe("Connect to database",function()
        {
            it("Expected Value",function()
            {
                console.log(dbmanager.db);
                expect(true).to.equals(dbmanager.db.open);
            });
        });

        describe("Get Image Test",function() 
        {
            it("Expected Value", function () 
            {
                var image = dbmanager.getImage( "koala.jpg" ,"root" );
                console.log(image);

                expect(1).to.equals(   0  );
            });
        });

        describe("Put Image Test",function()
        {
            it("Expected Value", function ()
            {
                expect(1).to.equals(dbmanager.putImage());
            });
        });

        describe("Get User Test",function()
        {
            it("Expected Value",function()
            {
                expect(1).to.equals(dbmanager.getUser());
            });
         });

        describe("Put Image Test", function()
        {
            it("Expected Value",function()
            {
                expect(1).to.equals(dbmanager.putImage());
            });

        });
        


});