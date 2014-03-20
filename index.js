var fs = require("fs");
var path = require('path');
var crypto = require('crypto');

function encrypt(text, password){
	var cipher = crypto.createCipher('aes-256-cbc',password);
	var crypted = cipher.update(text,'utf8','hex');
	crypted += cipher.final('hex');
	return crypted;
}

function decrypt(text, password){
	var result;
	try{
		var decipher = crypto.createDecipher('aes-256-cbc',password);
		result = decipher.update(text,'hex','utf8');
		result += decipher.final('utf8');
	} catch(e){
		result = false;
	}

	return result;
}


var Authentication = function(setup) {

	var getPasswordFilename = function(username){
		return path.join(setup.keys, "." + crypto.createHmac('sha1', "filename-key-hash").update(username).digest('hex'));
	};

	var getPasswordFileContent = function(username, password){
		var filename = getPasswordFilename(username);
		var contentString = fs.readFileSync(filename).toString();
		var result = null;
		var content = decrypt(contentString, password);
		if (content === false){
			result = {
				err: true,
				msg: "decrypt error",
				filename : filename
			};
		} else {

			content = JSON.parse(content);
			result = {
				err: false,
				filename : filename,
				user:{
					username:content.username,
					password:content.password
				}
			};
		}

		return result;
	};

	this.remove = function(username, password){
		var content = getPasswordFileContent(username,password);
		if (content.err){
			return content;
		}else {
			fs.unlinkSync(content.filename);
			return {err : fs.existsSync(content.filename)};
		}
	};

	this.add = function(username, password){
		var filename = getPasswordFilename(username);
		if (fs.existsSync(filename)){
			return {err:true};
		} else {
			var content = {
				username:username,
				password:password
			};
			var contentString = encrypt(JSON.stringify(content), password);

			fs.writeFileSync(filename, contentString);
			return {err:!fs.existsSync(filename)};
		}
	};

	this.get = function(username, password){
		return getPasswordFileContent(username, password);
	};

	return this;
};

module.exports = Authentication;