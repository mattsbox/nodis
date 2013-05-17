var core=require("./core.js");
var locator=require("maxmind");
var fs=require("fs");
locator.init("GeoLiteCity.dat",{memoryCache:true});
exports.serveIndex=function(req,res)
{
	var agent=req.headers["user-agent"];
	if(/Mobile/i.test(agent))
	{
		core.serve_file("res/indexm.html",res);
	}
	else
	{
		fs.readFile("res/nodis.html",function(e,data)
		{
			if(e){console.log(e);condemn(404,res);}
			else
			{
				var loc=locator.getLocation("66.6.44.4");
				console.log("CALIFORNIA "+req.connection.remoteAddress);
				console.log("WASHINGTON "+loc.latitude);
				res.writeHead(200,{"Content-Type":"text/html"});
				res.end(data);
			}
		});
	}
}
