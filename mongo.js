var mongo=require("mongodb");
var mURI=process.env.MONGOLAB_URI||process.env.MONGOHQ_URL;
mongo.Db.connect(mURI,function(e,db)
{
	if(db)
	{
		db.collection("songs",function(e,c)
		{
			console.log("FOOPA");
			console.log(e);
			if(c){exports.songs=c;}
		});
		db.collection("emails",function(e,c)
		{
			if(c){exports.emails=c;}
		});
	}
	else
	{
		console.log(e);
		exports=require("./mongo.js");
	}
});
exports.songs=false;
exports.emails=false;
