drop table Other;
drop table mentorship;
drop table announcement;
drop table admin;
drop table member;

create table Member(
uID bigserial primary key not null,
username varchar(16) unique not null,
password varchar(20) not null,
email varchar(50) unique not null,
profPic bytea,
typeOfAccount varchar(16) default 'Regular',
activePosts int default 0
check ( (activePosts <= 3 and typeOfAccount = 'Regular')
or (typeOfAccount = 'Premium')),
phoneNumber text[]
);


create table Admin (
uID bigserial primary key references Member(uID) not null,
securityKey varchar(16) not null,
firstName text not null,
lastName text not null
) ;

/*create table Announcement(
category char(1) not null,
postID bigserial  not null,
uID bigserial references Member(uID) not null,
title varchar(20) not null,
description text,
dateAdded timestamp default current_timestamp not null,
attachment bytea,
primary key(category,postID)
) ;
*/

create table Book(
category char(1) default 'b' not null,
postID bigserial  not null,
uID bigserial references Member(uID) not null,
title varchar(20) not null,
description text,
dateAdded timestamp default current_timestamp not null,
attachment bytea,

name text not null,
author text not null,
edition varchar(10),
year int,
price numeric(9,2) default 0.00,

primary key(category,postID)
) ;

create table Mentorship(
category char(1) default 'm' not null,
postID bigserial  not null,
uID bigserial references Member(uID) not null,
title varchar(20) not null,
description text,
dateAdded timestamp default current_timestamp not null,
attachment bytea,

subject varchar(20) not null,
fee numeric(9,2) default 0.00,
primary key(category,postID)
) ;

create table Event(
category char(1) default 'e' not null,
postID bigserial  not null,
uID bigserial references Member(uID) not null,
title varchar(20) not null,
description text,
dateAdded timestamp default current_timestamp not null,
attachment bytea,

dateOfEvent timestamp,
location text,
fee numeric(9,2) default 0.00,
primary key(category,postID)
) ;

create table Housing(
category char(1) default 'h' not null,
postID bigserial  not null,
uID bigserial references Member(uID) not null,
title varchar(20) not null,
description text,
dateAdded timestamp default current_timestamp not null,
attachment bytea,

address text,
monthlyPrice numeric(9,2) default 0.00,
primary key(category,postID)
) ;

create table Other(
category char(1) default 'o' not null,
postID bigserial  not null,
uID bigserial references Member(uID) not null,
title varchar(20) not null,
description text,
dateAdded timestamp default current_timestamp not null,
attachment bytea,

itemName text not null,
primary key(category,postID)
) ;

create table Admod(
category char(1) default 'a' not null,
postID bigserial  not null,
uID bigserial references Member(uID) not null,
title varchar(20) not null,
description text,
dateAdded timestamp default current_timestamp not null,
attachment bytea,

typeOfMod text check(typeOfMod in('Error','Warning',
'Attention','Announcement','Modification','Update')),
typeOfUsers text check(typeOfUsers in ('Regular','Premium',
'All')),
primary key(category,postID)
) ;

create table Message(
mID bigint not null check(mID > 0),
senderID bigserial references member(uID) not null,
receiverID bigserial references member(uID) not null,
messageText text not null, 
dateSent timestamp default current_timestamp not null,
primary key(mID,senderID,receiverID)
);

create table Payment(
pID bigint not null,
buyerID bigserial references member(uID) not null,
sellerID bigserial references member(uID) not null,
amount numeric(9,2) not null,
typeOfPayment text 
check (typeOfPayment in ('Paypal','MasterCard','Visa',
'Discover','American Express')) not null,
dateOfPayment timestamp default current_timestamp not null,

primary key(pID, buyerID, sellerID)
);

create table Report(
category char(1) default 'o' not null,
postID bigint not null,
uID bigserial references member(uID) not null,
typeOfReport text 
check(typeOfReport in ('Inappropriate','Spam',
'Offensive','Scam','Other')),
comment text not null,
primary key (uID,postID,category)
);

-- INSERTS
insert into Member (username,password,email,activePosts)
values('papo_elprimero','1234','papo1@gmail.com',2);

insert into Member(username,password,email,activePosts,
typeOfAccount)
values('papo2','1234','papo2@gmail.com',50,'Premium');

insert into Member (username,password,email,activePosts,
typeOfAccount,phoneNumber)
values('papo3','1234','papo3@gmail.com',50,'Premium',
'{{787-40-432423},{209348209348}}');

insert into Member (username,password,email,activePosts,
typeOfAccount,phoneNumber)
values('papa','1234','papa@gmail.com',100,'Premium',
'{{787-40-432423},{209348209348}}');

insert into Admin 
values('4','1234','PAPA','ALEXA');