var http=require("http");
var core=require("./core.js");
exports.send_concerts=function(res,ip,q)
{
	if(q["lat"]&&q["lon"])
	{	
		http.get(qstring(q["lat"],q["lon"]),function(skres)
		{
			var body="";
			skres.on("data",function(chunk){body+=chunk;});
			skres.on("end",function()
			{
				res.end(body);
			});
		}).on("error",function(e)
		{
				console.log(e);
		});
		return true;
	}else{core.condemn(400,res);return true;}
}
function qstring(lat,lon)
{
	return "http://api.songkick.com/api/3.0/events.json?location=geo:"+lat+","+lon+"&apikey=<APIKEY>";

}
