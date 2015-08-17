var config = require('./dataconfig/config');
var mongodburl = process.env.MONGODB_URL ;
var collections = ["users"];
var mongojs = require('mongojs');
//var db = require("mongojs").connect(mongodburl, collections);
var db = mongojs(mongodburl);
var users = db.collection('users');

function insertUser(jsonVar, cb) {
  var jsonData = JSON.parse(jsonVar);

  console.log("before inserting: " + jsonData.title);
  console.log("Severity: " + jsonData.severity);
  console.log("assignee: " + jsonData.assignee);
  console.log("Description: " + jsonData.description);


  users.save({title: jsonData.title, severity: jsonData.severity, assignee: jsonData.assignee,description:jsonData.description,state:jsonData.state}, function(err, saved) {
  	if( err || !saved ) 
		return cb(err,'Internal Server Error');
  	else 
		return cb(null,JSON.stringify(saved));
  });
}

function getUser(cb) {
  users.find(function(err, usersrec) {
	if( err || !usersrec) 
	   return cb(err,'Internal Server Error');
	else 
	{
		if (usersrec == '')
			return cb(null,JSON.stringify("[]"));
		str='[';
		usersrec.forEach( function(user) {
			console.log(user.severity);
			str = str + '{ "title" : "' + user.title + '","severity" : "' + user.severity + '","assignee" : "' + user.assignee + '","state" : "' + user.state + '","description" : "'+ user.description +'"},' +'\n';
			console.log(user.description);
		});
		str = str.trim();
		str = str.substring(0,str.length-1);
		str = str + ']';
		return cb(null,JSON.stringify(str));
	}
  });
}


function updateTicket(email, cb) {
  users.remove({"email":email},true,function(err,lastErrorObject) {
	if( err) 
	   return cb(err,'Internal Server Error');
	return cb(null);
	
  });
}

module.exports.insertUser = insertUser;
module.exports.getUser = getUser;
module.exports.updateTicket = updateTicket;