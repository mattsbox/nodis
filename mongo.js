var mongo=require("mongodb");
var mURI=process.env.MONGOLAB_URI||process.env.MONGOHQ_URL||"mongodb://jimbo:slice@ds031587.mongolab.com:31587/nodis";
mongo.Db.connect(mURI,function(e,db)
{
	if(db)
	{
		db.collection("songs",function(e,c)
		{
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
