
var expect = require("chai").expect;

describe ("Server Test",function()
    {
        describe("test 1",function() {

                it("Get Image", function () {
                        expect("").to.equals("1");
                    }
                );
            }
        );

        describe("Expected Value",function()
            {
                it("Post Image", function () 
                {
                      var request = require("request");
                      var fs = require('fs');  
                     var formData = 
                     {
                        fname: fs.createReadStream(__dirname+'/miley.jpg'),
                        //gaussian: 50,
                        posterize: 10
                     }
                     
                     request.post({url:'http://127.0.0.1:668/upload',formData:formData}, (err,httpResponse,body)=>
                     {
                        var x;
                        if(err)
                            {x=0;}
                        else {x=1;console.log(body)}

                        expect(1).to.equals(x);
                     });
                });
            }

        );


    }

);
