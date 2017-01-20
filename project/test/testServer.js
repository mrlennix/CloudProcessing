
var expect = require("chai").expect;

describe ("Server Test",function()
    {
        describe("test 1",function() {

                it("Expected Value", function () {
                        expect("").to.equals("");
                    }
                );
            }
        );

        describe("test 2",function()
            {
                it("Expected Value", function () {
                        expect("s").to.equals("se");
                    }
                );
            }

        );


    }

);
