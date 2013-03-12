var http=require("http");
var fs=require("fs");
var url=require("url");
var core=require("./core.js");
var collections=require("./mongo.js");
var songs=require("./songs.js");
var yt=require("./youtube.js");
String.prototype.startsWith=function(s){return (this.indexOf(s)==0);}
var server=http.createServer(function(req,res)
{
	var u=url.parse(req.url,true);
	if(u.pathname.startsWith("/res"))
	{
		core.serve_file(u.pathname.substring(1),res);
	}
	else
	{
		switch(u.pathname)
		{
			case "/":
				require("./index.js").serveIndex(req,res);
			break;
			case "/new_listen":
				if(!songs.new_listen(u.query,collections.songs,res)){core.condemn(500,res);}
			break;
			case "/new_listen_yt":
				if(!yt.new_listen(u.query,collections.songs,res)){core.condemn(500,res);}
			break;
			case "/get_listens":
				if(!songs.get_listens(u.query,collections.songs,res)){core.condemn(500,res);}
			break;
			case "/submit_email":
				require("./email_bucket.js").add(u.query["email"],collections.emails,res);
			break;
			default:
				core.condemn(404,res);
			break;
		}
	}
}).listen(process.env.PORT || 1985);
