var fs=require("fs");
var mime=require("mime");
function serve_file(file,res)
{
	fs.readFile(file,function(e,data)
	{
		if(e){console.log(e);condemn(404,res);}
		else
		{
			res.writeHead(200,{"Content-Type":mime.lookup(file)});
			res.end(data);
		}
	});
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
exports.serve_file=serve_file;
exports.approve=approve;
exports.condemn=condemn;
