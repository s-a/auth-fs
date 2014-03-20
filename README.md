auth-fs
=======

NodeJs filesystem based authentication.  


authentication.add(Username, Password);  
authentication.get(Username, Password);  
authentication.remove(Username, Password);  


var Authentication = require("./../index.js");  
var authentication = new Authentication({  
	"keys": "./login/"  
});  