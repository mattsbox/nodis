var http=require("http");
var core=require("./core.js");
exports.send_concerts=function(res,ip,q)
{
	if(q["lat"]&&q["lon"])
	{
		/*var count=0,restext=Array();
		function counter(body)
		{
			restext[restext.length]=body;
			if(count==3)
			{
				text="{\"queries\" : [";
				for(var x=0;x<count;x++)
				{
					text+=restext[x]+",";
				}
				text+=restext[x]+"]}";
				res.end(text);
			}
			else{count++;}
		}
		var coords=[
				[parseFloat(q["lat"])+(q["rlt"]/2),q["lon"]],
				[q["lat"],parseFloat(q["lon"]+(q["rln"]/2))],
				[q["lat"]-(q["rlt"]/2),q["lon"]],
				[q["lat"],q["lon"]-(q["rln"]/2)]
			];
		res.writeHead(200,{"Content-Type":"application/json"});
		for(i in coords)
		{*/
			http.get(qstring(q["lat"],q["lon"]),function(skres)
			{
				var body="";
				skres.on("data",function(chunk){body+=chunk;});
				skres.on("end",function()
				{
					res.end(body);
					//counter(body);
				});
			}).on("error",function(e)
			{
					console.log(e);
					//core.condemn(500,res);
			});
		//}
		return true;
	}else{core.condemn(400,res);return true;}
}
function qstring(lat,lon)
{
	return "http://api.songkick.com/api/3.0/events.json?location=geo:"+lat+","+lon+"&apikey=GYwTtDraBlqKd0Iq";
}
