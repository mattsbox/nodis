var core=require("./core.js");
exports.serveIndex=function(req,res)
{
	var agent=req.headers["user-agent"];
	if(/Mobile/i.test(agent))
	{
		core.serve_file("res/indexm.html",res);
	}
	else
	{
		core.serve_file("res/indexnm.html",res);
	}
}
