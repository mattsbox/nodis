var core=require("./core.js");
module.exports.get_listens=function(q,songtable,res)
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
							if(e){core.condemn(500,res);}
							else
							{
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
module.exports.new_listen=function(q,songtable,res)
{
	if(!songtable){console.log("DB");return false;}
	if(q["lat"]&&q["lon"]&&q["sid"])
	{
		songtable.insert({	"lat":parseFloat(q["lat"]),
					"lon":parseFloat(q["lon"]),
					"sid":q["sid"]},
				{safe:true},
				function(e,rs)
				{
					if(e){console.log(e);core.condemn(500,res);}
					else{core.approve(res);}
				});
		return true;
	}
	else{return false;}
}
