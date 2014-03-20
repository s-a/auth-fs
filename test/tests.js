var should = require("should");
var assert = require("assert");

var Authentication = require("./../index.js");
var authentication = new Authentication({
	"keys": "./login/"
});


var testUsername = "test", testPassword = "asfasf";

describe('basic tests', function(){

 	describe('account', function(){
		it('should remove login', function(){
				var res = authentication.remove(testUsername, testPassword);
				res.err.should.be.false; 
		});
		
		it('should register', function(){
			var res = authentication.add(testUsername, testPassword);
				res.err.should.be.false;
		});

		it('should fail register twice', function(){
			var res = authentication.add(testUsername, testPassword);
				res.err.should.be.true;
		});

		it('should fail to login', function(){
				var res = authentication.get(testUsername, testPassword+"fail");
				res.err.should.be.true; 
		});

		it('should login', function(){
				var res = authentication.get(testUsername, testPassword);
				res.err.should.be.false;
				res.user.username.should.equal(testUsername);
				res.user.password.should.equal(testPassword);
		});


		it('should fail to remove login', function(){
				var res = authentication.remove(testUsername, testPassword+"fail");
				res.err.should.be.true; 
		});
	});

});