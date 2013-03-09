var http=require("http");
var fs=require("fs");
var url=require("url");
var mongo=require("mongodb");
var mURI=process.env.MONGOLAB_URI||process.env.MONGOHQ_URL||"mongodb://jimbo:slice@ds031587.mongolab.com:31587/nodis";
var songtable;
mongo.Db.connect(mURI,function(e,db)
{
	if(db)
	{
		db.collection("songs",function(e,c)
		{
			if(c){songtable=c;}
		});
	}else{console.log(e);}
});
var server=http.createServer(function(req,res)
{
	var u=url.parse(req.url,true);
	switch(u.pathname)
	{
		case "/input":
			if(!input(u.query,res)){condemn(500,res);}
		break;
		case "/output":
			if(!output(u.query,res)){condemn(500,res);}
		break;
		default:
			condemn(404,res);
		break;
	}
}).listen(process.env.PORT || 1985);
function output(q,res)
{
	if(!songtable){return false;}
	if(q["lat"]&&q["lon"]&&q["rlt"]&&q["rln"])
	{
		var lt=parseFloat(q["lat"]);
		var ln=parseFloat(q["lon"]);
		var rt=parseFloat(q["rlt"]);
		var rn=parseFloat(q["rln"]);
		var data=songtable.find({	
						"lat":{$lt:(lt+rt),
							$gt:(lt-rt)},
						"lon":{	$lt:(ln+rn),
							$gt:(ln-rn)}
					},
					{"limit":50,"sort":["_id","desc"]}
					).toArray(function(e,a)
						{
							if(e){condemn(500,res);}
							else
							{
								console.log(a);
								res.writeHead(200,{"Content-Type":"application/json"});
								res.end(JSON.stringify(a));
							}
						});
		console.log({"lat":{$lt:(lt+rt),
							$gt:(lt-rt)},
						"lon":{	$lt:(ln+rn),
							$gt:(ln-rn)}});
		return true;
	}else{return false;}
}
function input(q,res)
{
	if(!songtable){console.log("DB");return false;}
	if(q["lat"]&&q["lon"]&&q["sng"])
	{
		songtable.insert({	"lat":parseFloat(q["lat"]),
					"lon":parseFloat(q["lon"]),
					"sng":q["sng"]},
				{safe:true},
				function(e,rs)
				{
					if(e){console.log(e);condemn(500,res);}
					else{approve(res);}
				});
		return true;
	}
	else{return false;}
}
function approve(res)
{
	res.writeHead(200,{"Content-Type":"text/plain"});
	res.end();
}
function condemn(code,res)
{
	res.writeHead(code,{"Content-Type":"text/plain"});
	res.end();
}
