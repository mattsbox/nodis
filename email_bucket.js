exports.add=function(email,coll,res)
{
	coll.insert({"email":email});
	res.writeHead(200,{"Content-Type":"text/plain"});
	res.end("Thank you!");
}
