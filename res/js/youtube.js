(function()
{
	var player,sent=false;
	function play(code,title)
	{
		console.log(window.lat);
		$.get("/new_listen_yt?lat="+window.lat+"&lon="+window.lon+"&t="+title);
		player = new YT.Player('player', 
		{
			//height: '390',
			width: '100%',
			videoId: code,
			events: 
			{
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange
          		}
		});
	}
	function onPlayerReady(event) 
	{
		$("#player").css("width:100%");
		event.target.playVideo();
	}
	function onPlayerStateChange(event) 
	{
		if (!sent&&event.data == YT.PlayerState.PLAYING) 
		{
			
		}
	}
	function stopVideo() 
	{
		player.stopVideo();
	}
	function ytsearch()
	{
		$("#ytcontent").html("");
		$.get("https://gdata.youtube.com/feeds/api/videos?q="+$("#ytinput").val(),parseyt,"xml");
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
				td.style.height="300px";
				var thumb=document.createElement("img");
				thumb.src=node.find("thumbnail").first().attr("url");
				thumb.style.height="250px";
				thumb.style.position="static";
				td.appendChild(thumb);
				var url=node.find("id").text();
				td.code=url.substring(url.lastIndexOf("/")+1);
				td.onclick=function(e)
				{
					td.innerHTML="<div id=\"player\"></div>";
					play(td.code,td.title);
				};
				td.title=node.find("title").first().text();
				td.innerHTML+="<br/>"+td.title;
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
	}
	$(document).ready(function()
	{
		$("#ytinputb").click(ytsearch);
		var tag = document.createElement('script');
		tag.src = "//www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	});
})();
