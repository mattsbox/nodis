(function()
{
	var player,sent=false,selected_search=-1,ytold="",playlist=Array();
	window.play=function(code,title)
	{
		console.log("WISCONSON");
		$.get("/new_listen_yt?lat="+window.lat+"&lon="+window.lon+"&t="+title+"&ytc="+code).fail(function(){console.log("COLORADO");});
		console.log("DENVER "+code);
		player = new YT.Player('player', 
		{
			width: '100%',
			/*Hack: sneakily adds wmode to query, includes enablejsapi because the one that the code adds is now "?enablejsapi"*/
			/*wmode keeps the SWF player underneath HTML elements*/
			videoId: code+"?wmode=transparent&enablejsapi=1&",
			events: 
			{
				'onReady':function(e)
				{
					e.target.a.wmode="transparent";
					console.log(e.target.a);
					e.target.playVideo();
					console.log("MONTANA");
				},
				'onStateChange':function(e)
				{
					console.log("MIAMI"+e.data);
					for(i in YT.PlayerState)
					{
						console.log(i+" "+YT.PlayerState[i]);
					}
					if(e.data==YT.PlayerState["ENDED"])
					{
						console.log("MASSACHUSETTS");
						play_next();
					}
				}
          		}
		});
	}
	function ytsearch()
	{
		$("#ytcontent").html("");
		$.get("https://gdata.youtube.com/feeds/api/videos?q="+$("#ytinput").val(),parseyt,"xml");
		select_search(-(selected_search+1));
		clear_suggestions();
	}
	function clear_suggestions()
	{
		for(var i=0;i<=9;i++){$("#c"+i).html("");}
	}
	function ytsearch_value(v)
	{
		$("#ytinput").val(v);
		ytold=v;
		ytsearch();
	}
	function select_search(i)
	{
		if(selected_search>-1)
		{
			$("#c"+selected_search).css("border","");
		}
		selected_search+=i;
		if(selected_search<=-2||selected_search>9){selected_search=-1;}
		if(selected_search>-1)
		{
			$("#c"+selected_search).css("border","1px solid black");
		}
	}
	function instant(e)
	{
		switch(e.keyCode)
		{
			case 27: /*Escape*/
				clear_suggestions();
			break;
			case 38: /*Up*/
				select_search(-1);
			break;
			case 40: /*Down*/
				select_search(1);
			break;
			case 13: /*Enter*/
				if(selected_search<=-1){ytsearch();}
				else{ytsearch_value($("#c"+selected_search).html());}
			break;
			default:
				var val=$("#ytinput").val();
				if(val!=""&&val!=ytold)
				{
					$.get("https://clients1.google.com/complete/search?client=youtube&hl=en&gs_ri=youtube&ds=yt&c=HCp-Rdqh3z4Uc&q="+val,
					function(data)
					{
						for(i in data[1])
						{
							$("#c"+i).html(data[1][i][0]);
							$("#c"+i).click((function(v)
							{
								return function()
								{
									ytsearch_value(v);
								}
							})(data[1][i][0]));
						}
					},"jsonp");
					ytold=val;
				}else if(val==""){clear_suggestions();}
			break;
		}
	}
	function play_next()
	{
		console.log("TEXAS");
		if(playlist[0])
		{
			$("#player").attr("id","");
			$("#video_box").html("<div id=\"player\"></div>");
			play(playlist[0].code,playlist[0].title);
			console.log("IDAHO");
			$("#p0").remove();
			console.log("LITTLE ROCK "+document.getElementById("p0"));
			for(var i=0;i<playlist.length;i++)
			{
				$("#p"+(i+1)).attr("id","p"+i).css("bottom",((i+1)*64)+"px");
				if(i<=(playlist.length-2)){playlist[i]=playlist[i+1];}
			}
			playlist.pop();
		}
	}
	function append_to_playlist(code,title,src)
	{
		playlist[playlist.length]={"code":code,"title":title};
		console.log("MARYLAND");
		if(document.getElementById("p0"))
		{
			console.log("KANSAS "+playlist.length);
			$("#p"+(playlist.length-2)).before("<div style=\"position:absolute;bottom:"+(64*playlist.length)+"px;height:64px\" id=\"p"+(playlist.length-1)+"\" class=\"playlist_node\"><img src=\""+src+"\"></div>");
		}
		else
		{
			$("#playlist_play_button").before("<div style=\"position:absolute;bottom:64px;height:64px\" id=\"p0\" class=\"playlist_node\"><img src=\""+src+"\"></div>");
		}
	}
	function parseyt(data)
	{
		var t=document.createElement("table");
		t.style.width="100%";
		var tr=document.createElement("tr");
		var first=true;
		$(data).find("entry").each(function()
		{
			var node=$(this);
			if(node.find("category").text()=="Music")
			{
				var td=document.createElement("td");
					td.style.width="50%";
					td.style.position="relative";
					var content=document.createElement("div");
						content.style.height="100%";
						content.style.width="100%";
						var thumb=document.createElement("img");
							thumb.src=node.find("thumbnail").first().attr("url");
							thumb.style.width="100%";
							thumb.style.position="static";
							td.onclick=function(e)
							{
								if(td.ignore){td.ignore=false;return;}
								$("#player").attr("id","");
								content.innerHTML="<div id=\"player\"></div>";
								play(td.code,td.title);
								td.onclick=function(){};
							};
						content.appendChild(thumb);
						var url=node.find("id").text();
						td.code=url.substring(url.lastIndexOf("/")+1);	
						td.title=node.find("title").first().text();
						content.innerHTML+="<div style=\"position:absolute;width:80%;height:15%;left:10%;bottom:5%;background-color:#FFFFFF;border: 5px solid black;font-size:2em\">"+td.title+"</div>";
					td.appendChild(content);
					var addb=document.createElement("button");
						addb.className="playlist_button";
						addb.onclick=function(e)
						{
							if(!e){e=window.event;}
							e.target.parentNode.ignore=true;
							append_to_playlist(td.code,td.title,thumb.src);
						};
						addb.innerHTML="Add to playlist";
					td.appendChild(addb);
				tr.appendChild(td);
				if(first){first=false;}
				else
				{
					t.appendChild(tr);
					tr=document.createElement("tr");
					first=true;
				}
			}
		});
		if(!first){t.appendChild(tr);}
		$("#ytcontent").append(t);
		scrollto("#ytcontent")();
	}
	$(document).ready(function()
	{
		$("#ytinputb").click(ytsearch);
		$("#ytinput").blur(clear_suggestions);
		$("#ytinput").keydown(instant);
		$("#ytinput").focus(function()
		{
			this.value="";
			$(this).off("focus");
		});
		$("#playlist_play_button").click(function()
		{
			this.onclick=function(){};
			play_next();
		});
		var tag = document.createElement('script');
		tag.src = "//www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	});
})();
