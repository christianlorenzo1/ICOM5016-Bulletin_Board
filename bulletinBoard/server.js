var express = require('express');
var app = express();
app.use(express.static('www'));
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function () {
	
    console.log('Express server listening on port ' + app.get('port'));
});
var fs = require("fs");
var pg, conString, client;
function clientConnect(){
	pg = require('pg');
	pg.defaults.ssl = true;          
	conString = process.env.DATABASE_URL ||
	  "postgres://cggtxtfflkmdrx:l9xnU_uY1DpvOh6YrdOnn2MbTS@ec2-54-225-121-93.compute-1.amazonaws.com:5432/d395p50rdtiaf1";
	client = new pg.Client(conString);
	client.connect();
}

app.get('/db/get', function (req,res) {
	clientConnect();
	var query = client.query("select * from member;");    
   	query.on("end", function (result) {          
   		client.end(); 
		res.write(JSON.stringify(result.rows[0].username));
		res.end();  
	});
})

app.get('/db/get/announcements', function (req,res) {
	clientConnect();
	var query = client.query(
		"with announcements as \
		((select category,postID,title,description, attachment, dateAdded\
		from event )\
		union \
		(select category,postID,title,description, attachment, dateAdded\
		from book)\
		union\
		(select category,postID,title,description, attachment, dateAdded\
		from housing)\
		union\
		(select category,postID,title,description, attachment, dateAdded\
		from mentorship)\
		union\
		(select category,postID,title,description, attachment, dateAdded\
		from other))\
		select *\
		from announcements\
		order by dateAdded;"
	);    
   	query.on("end", function (result) {          
   		client.end(); 
		res.write(JSON.stringify(result.rows, null, "    "));
		res.end();  
	});
})

app.get('/findData', function (req, res) {
	fs.readFile( __dirname + "/" + "www/json/data.json", 'utf8',function (err, data) {
    	data = JSON.parse(data);
      	console.log( data);
      	res.end( JSON.stringify(data) );
   	});
   	
})

app.get('/findData/:type', function (req, res) {
   fs.readFile( __dirname + "/" + "www/json/data.json", 'utf8',function (err, data) {
      data = JSON.parse(data);
      var type = data[""+req.params.type];
      console.log( type);
      res.end( JSON.stringify(type) );
   });
})

app.get('/findData/:type/:id', function (req, res) {
   fs.readFile( __dirname + "/" + "www/json/data.json", 'utf8',function (err, data) {
      data = JSON.parse(data);
      var type = data[""+req.params.type];
      if(req.params.type == "users"){
		for (var i = 0; i < type.length; i++){
			if (type[i].uID == req.params.id){
				var user = type[i];
	  		}
		 }
	  }
	  if(req.params.type == "announcements"){
		for (var i = 0; i < type.length; i++){
			if (type[i].POSTID == req.params.id){
				var user = type[i];
	  		}
		 }
	  }
	  if(req.params.type == "messages"){
		for (var i = 0; i < type.length; i++){
			if (type[i].mID == req.params.id){
				var user = type[i];
	  		}
		 }
	  }
	  if(req.params.type == "payments"){
		for (var i = 0; i < type.length; i++){
			if (type[i].pID == req.params.id){
				var user = type[i];
	  		}
		 }
	  }
      console.log( user);
      res.end( JSON.stringify(user) );
   });
})

