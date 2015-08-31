create table nfcTag (
	id int auto_increment primary key,
	tagId varchar(100) unique key,
	redirectURL varchar(255)
);

