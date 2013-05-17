var songs=require("./songs.js");
var http=require("http");
var core=require("./core.js");
exports.new_listen=function(query,songdb,res)
{
	console.log(query.ytc);
	http.get("http://itunes.apple.com/search?media=music&term="+query.t,function(resp)
	{
		var list="";
		resp.on("data",function(d)
		{
			list+=d;
		});
		resp.on("end",function()
		{
			list=JSON.parse(list);
			var i;
			for(i=0;i<list.results.length;i++)
			{
				if(list.results[i].kind=="song"){break;}
			}
			if(i==list.results.length){i=0;}
			if(list.results[i]&&list.results[i].trackId)
			{
				songs.new_listen_raw(songdb,res,{"lat":query.lat,"lon":query.lon,"sid":list.results[i].trackId,"title":query.t,"ytc":query.ytc});
			}else{bail(songdb,res,query);}
		});
	}).on("error",function(e)
	{
		console.log(e);
		bail(songdb,res,query);
	});
	return true;
}
function bail(songdb,res,query)
{
	songs.new_listen_raw(songdb,res,{"lat":query.lat,"lon":query.lon,"sid":0,"title":query.t,"ytc":query.ytc});
}
