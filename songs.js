var core=require("./core.js");
module.exports.get_listens=function(q,songtable,res)
{
	if(!songtable){console.log("No database");return false;}
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
					}/*,
					{"limit":50,"sort":["_idi","desc"]}*/
					).sort({"_id":-1}).limit(50).toArray(function(e,a)
					{
						if(e)
						{
							console.log(e);
							core.condemn(500,res);
						}
						/*else
						{*/
							res.writeHead(200,{"Content-Type":"application/json"});
							res.end(JSON.stringify(a));
						//}
					});
		return true;
	}else{core.condemn(400,res);return true;}
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
	else{core.condemn(400,res);return true;}
}
module.exports.new_listen_raw=function(songtable,res,q)
{
	if(!songtable){console.log("DB");core.condemn(500,res);}
	if(q["lat"]&&q["lon"]&&q["sid"])
	{
		q["lat"]=parseFloat(q["lat"]);
		q["lon"]=parseFloat(q["lon"]);
		songtable.insert(q,
				{safe:true},
				function(e,rs)
				{
					if(e){console.log(e);core.condemn(500,res);}
					else{core.approve(res);}
				});
		return true;
	}
	else{core.condemn(400,res);}
}
