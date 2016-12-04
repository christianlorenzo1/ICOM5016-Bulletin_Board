var express = require('express');
var app = express();
app.use(express.static('www'));
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function () {
	
    console.log('Express server listening on port ' + app.get('port'));
});
var fs = require("fs");
var pg, conString, client, query;
function clientConnect(){
	pg = require('pg');
	pg.defaults.ssl = true;          
	conString = process.env.DATABASE_URL ||
	  "postgres://cggtxtfflkmdrx:l9xnU_uY1DpvOh6YrdOnn2MbTS@ec2-54-225-121-93.compute-1.amazonaws.com:5432/d395p50rdtiaf1";
	client = new pg.Client(conString);
	client.connect();
}

var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'bulletinboarduprm@gmail.com',
		pass:'announceit'
	}
});

app.get('/sendMail/:username/:email',function(req,res){
	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: 'bulletinboarduprm@gmail.com', // sender address
	    to: req.params.email, // list of receivers
	    subject: 'Welcome to Bulletin Board!', // Subject line
	    text: 'Hello '+req.params.username+',\
	    \nPlease verify your account by logging in: announceit.herokuapp.com/signup.html', // plaintext body
	    //html: '<b>Hello world ?</b>' // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);
	});
})

app.get('/db/get', function (req,res) {
	clientConnect();
	query = client.query("select * from member;");    
   	query.on("end", function (result) {          
   		client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(JSON.stringify(result.rows[0].username));
		res.end();  
	});
})

app.get('/db/get/event', function (req,res) {
	clientConnect();
	query = client.query("select category,postID,title,description, attachment, dateAdded\
	from event");    
   	query.on("end", function (result) {          
   		client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(JSON.stringify(result.rows, null, "    "));
		res.end();  
	});
})

app.get('/db/get/book', function (req,res) {
	clientConnect();
	query = client.query("select category,postID,title,description, attachment, dateAdded\
    from book");    
   	query.on("end", function (result) {          
   		client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(JSON.stringify(result.rows, null, "    "));
		res.end();  
	});
})

app.get('/db/get/mentorship', function (req,res) {
	clientConnect();
	query = client.query("select category,postID,title,description, attachment, dateAdded\
	from mentorship");    
   	query.on("end", function (result) {          
   		client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(JSON.stringify(result.rows, null, "    "));
		res.end();  
	});
})

app.get('/db/get/housing', function (req,res) {
	clientConnect();
	query = client.query("select category,postID,title,description, attachment, dateAdded\
	from housing");    
   	query.on("end", function (result) {          
   		client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(JSON.stringify(result.rows, null, "    "));
		res.end();  
	});
})

app.get('/db/get/other', function (req,res) {
	clientConnect();
	query = client.query("select category,postID,title,description, attachment, dateAdded\
	from other");    
   	query.on("end", function (result) {          
   		client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(JSON.stringify(result.rows, null, "    "));
		res.end();  
	});
})

app.get('/db/get/announcement/:category/:postID/', function (req,res) {
	clientConnect();
	if(req.params.category== 'e'){
		query = client.query("\
		select *\
		from event\
		where postID="+req.params.postID+" and category='"+req.params.category+"' ;"
		);  
	}  
	else if(req.params.category== 'b'){
		query = client.query("\
		select *\
		from book\
		where postID="+req.params.postID+" and category='"+req.params.category+"' ;"
		);  
	}  
	else if(req.params.category== 'h'){
		query = client.query("\
		select *\
		from housing\
		where postID="+req.params.postID+" and category='"+req.params.category+"' ;"
		);  
	} 
	else if(req.params.category== 'm'){
		query = client.query("\
		select *\
		from mentorship\
		where postID="+req.params.postID+" and category='"+req.params.category+"' ;"
		);  
	} 
	else if(req.params.category== 'o'){
		query = client.query("\
		select *\
		from other\
		where postID="+req.params.postID+" and category='"+req.params.category+"' ;"
		);  
	} 
	else{
		//
	}

   	query.on("end", function (result) {          
   		client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(JSON.stringify(result.rows[0], null, "    "));
		res.end();  
	});
})



app.get('/db/get/announcements', function (req,res) {
	clientConnect();
	query = client.query(
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
		order by dateAdded desc;"
	);    
   	query.on("end", function (result) {          
   		client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(JSON.stringify(result.rows, null, "    "));
		res.end();  
	});
})

app.get('/db/get/premiumPosts',function(req,res) {
	clientConnect();
	query = client.query(
		"with announcements as \
		((select category,postID,uID,title,description, attachment, dateAdded\
		from event )\
		union \
		(select category,postID,uID,title,description, attachment, dateAdded\
		from book)\
		union\
		(select category,postID,uID,title,description, attachment, dateAdded\
		from housing)\
		union\
		(select category,postID,uID,title,description, attachment, dateAdded\
		from mentorship)\
		union\
		(select category,postID,uID,title,description, attachment, dateAdded\
		from other))\
		\
		select distinct category,postID,uID,title,description, attachment, dateAdded\
		from announcements natural join member\
		where member.typeOfAccount='Premium'\
		order by dateAdded desc;"
		);
	query.on("end", function (result) {          
   		client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(JSON.stringify(result.rows, null, "    "));
		res.end();  
	});
})

app.get('/db/get/search/:searchtext', function (req,res) {
	clientConnect();
	query = client.query(
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
		where lower(title) like lower('%"+req.params.searchtext+"%')\
		or lower(description) like lower('%"+req.params.searchtext+"%')\
		order by dateAdded desc;"
	);    
   	query.on("end", function (result) {          
   		client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(JSON.stringify(result.rows, null, "    "));
		res.end();  
	});
})

app.get('/db/get/login/:usernameORemail/:password', function (req,res) {
	clientConnect();
	query = client.query("select distinct *\
	from member\
	where (email='"+req.params.usernameORemail+"'\
	or username='"+req.params.usernameORemail+"' )and password='"+req.params.password+"'\
	");    
   	query.on("end", function (result) {          
   		client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();  
	});
})

app.get('/db/get/user/:uID/:username/:email/', function (req,res) {
	clientConnect();
	query = client.query("select *\
	from member\
	where uID="+req.params.uID+" and username='"+req.params.username+"'\
	and email='"+req.params.email+"'\
	");    
   	query.on("end", function (result) {          
   		client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows[0], null, "    "));
		res.end();  
	});
})

app.get('/db/get/user/announcements/:uID/', function (req,res) {
	clientConnect();
	query = client.query("\
		with announcements as \
		((select category,postID,uid,title,description, attachment, dateAdded\
		from event )\
		union \
		(select category,postID,uid,title,description, attachment, dateAdded\
		from book)\
		union\
		(select category,postID,uid,title,description, attachment, dateAdded\
		from housing)\
		union\
		(select category,postID,uid,title,description, attachment, dateAdded\
		from mentorship)\
		union\
		(select category,postID,uid,title,description, attachment, dateAdded\
		from other))\
\
		select *\
		from announcements\
		where uid="+req.params.uID+"\
		order by dateadded desc\
	");    
   	query.on("end", function (result) {          
   		client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(JSON.stringify(result.rows, null, "    "));
		res.end();  
	});
})

app.get('/db/get/user/payments/:uID/', function (req,res) {
	clientConnect();
	query = client.query("\
		with announcements as ((select category,postID,uID,title,description, attachment, dateAdded\
		from event )\
		union \
		(select category,postID,uID,title,description, attachment, dateAdded\
		from book)\
		union\
		(select category,postID,uID,title,description, attachment, dateAdded\
		from housing)\
		union\
		(select category,postID,uID,title,description, attachment, dateAdded\
		from mentorship)\
		union\
		(select category,postID,uID,title,description, attachment, dateAdded\
		from other))\
		select p.*,a.title,c.cardtype\
		from payment as p natural join announcements as a, creditcard as c\
		where c.cardid=p.cardid\
		and (buyerid="+req.params.uID+" or sellerid="+req.params.uID+")\
		order by dateAdded desc\
	");    
   	query.on("end", function (result) {          
   		client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(JSON.stringify(result.rows, null, "    "));
		res.end();  
	});
})

app.get('/db/get/chatlogs/:loggedInUser/', function (req,res) {
	clientConnect();
	query = client.query("\
		select *\
		from (\
		  select message.*,member.uid,member.username,member.profpic,\
		         row_number() over (partition by chatid order by datesent desc) as rn\
		  from message, member\
		  where (senderid="+req.params.loggedInUser+" and receiverid=member.uid)\
		  or (member.uid=senderid and receiverid="+req.params.loggedInUser+")\
		) t\
		where rn = 1\
		order by datesent desc\
	");    
   	query.on("end", function (result) {          
   		client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(JSON.stringify(result.rows, null, "    "));
		res.end();  
	});
})

app.get('/db/get/messages/:loggedInUser/:messageUser/', function (req,res) {
	clientConnect();
	query = client.query("\
		select m.*,u.username as messageUser\
		from message as m, member as u\
		where ((senderID="+req.params.loggedInUser+" \
		and receiverid="+req.params.messageUser+")\
		or (senderid="+req.params.messageUser+" \
		and receiverid="+req.params.loggedInUser+"))\
		and (u.uid="+req.params.messageUser+")\
		order by datesent\
	");    
   	query.on("end", function (result) {          
   		client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(JSON.stringify(result.rows, null, "    "));
		res.end();  
	});
})


app.get('/db/get/admin/:uID/', function (req,res) {
	clientConnect();
	query = client.query("\
		select *\
		from admin natural join member\
		where uID="+req.params.uID+"\
	");    
   	query.on("end", function (result) {          
   		client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(JSON.stringify(result.rows[0], null, "    "));
		res.end();  
	});
})

app.get('/db/get/reports/', function (req,res) {
	clientConnect();
	query = client.query("\
		select *\
		from report\
	");    
   	query.on("end", function (result) {          
   		client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(JSON.stringify(result.rows, null, "    "));
		res.end();  
	});
})

app.get('/db/get/creditcards/:uid', function (req,res) {
	clientConnect();
	query = client.query("\
		select *\
		from creditcard\
		where uid="+req.params.uid+"\
	");    
   	query.on("end", function (result) {          
   		client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(JSON.stringify(result.rows, null, "    "));
		res.end();  
	});
})

app.get('/db/insert/event/:uid/:title/:description/:dateofevent/:location/:fee', function(req,res){
	clientConnect();
	query = client.query("\
		INSERT INTO event(uid, title, description,\
		dateofevent, location, fee)\
		VALUES ("+req.params.uid+",'"+req.params.title+"','"+req.params.description+"'\
		,'"+req.params.dateofevent+"','"+req.params.location+"',"+req.params.fee+")\
	");    
   	query.on("end", function (result) {          
   		client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();  
	});
})


app.get('/db/insert/book/:uid/:title/:description/:name/:author/:edition/:year/:price', function(req,res){
	clientConnect();
	query = client.query("\
		INSERT INTO book(uid, title, description,\
		name, author, edition, year, price)\
		VALUES ("+req.params.uid+",'"+req.params.title+"','"+req.params.description+"'\
		,'"+req.params.name+"','"+req.params.author+"','"+req.params.edition+"',\
		"+req.params.year+","+req.params.price+")\
	");    
   	query.on("end", function (result) {          
   		client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();  
	});
})

app.get('/db/insert/housing/:uid/:title/:description/:address/:monthlyprice', function(req,res){
	clientConnect();
	query = client.query("\
		INSERT INTO housing(uid, title, description,\
		address, monthlyprice)\
		VALUES ("+req.params.uid+",'"+req.params.title+"','"+req.params.description+"'\
		,'"+req.params.address+"',"+req.params.monthlyprice+")\
	");    
   	query.on("end", function (result) {          
   		client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();  
	});
})

app.get('/db/insert/mentorship/:uid/:title/:description/:subject/:fee', function(req,res){
	clientConnect();
	query = client.query("\
		INSERT INTO mentorship(uid, title, description,\
		subject, fee)\
		VALUES ("+req.params.uid+",'"+req.params.title+"','"+req.params.description+"'\
		,'"+req.params.subject+"',"+req.params.fee+")\
	");    
   	query.on("end", function (result) {          
   		client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();  
	});
})

app.get('/db/insert/other/:uid/:title/:description/:item', function(req,res){
	clientConnect();
	query = client.query("\
		INSERT INTO other(uid, title, description,\
		itemname)\
		VALUES ("+req.params.uid+",'"+req.params.title+"','"+req.params.description+"'\
		,'"+req.params.item+"')\
	");    
   	query.on("end", function (result) {          
   		client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();  
	});
})

app.get('/db/insert/user/:username/:email/:password', function(req,res){
	clientConnect();
	query = client.query("\
		INSERT INTO member(username, email, password)\
		VALUES ('"+req.params.username+"','"+req.params.email+"'\
		,'"+req.params.password+"')\
	");    
   	query.on("end", function (result) {          
   		client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();  
	});
})

app.get('/db/get/existingUsers',function(req,res){
	clientConnect();
	query = client.query("\
		select username, email\
		from member\
	");    
   	query.on("end", function (result) {          
   		client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();  
	});
})
