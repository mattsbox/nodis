(function()
{
	var player,done=false;
	function play(code) 
	{
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
		if (event.data == YT.PlayerState.PLAYING && !done) 
		{
			setTimeout(stopVideo, 6000);
			done = true;
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
				var thumb=document.createElement("img");
				thumb.src=node.find("thumbnail").first().attr("url");
				thumb.style.width="100%";
				td.appendChild(thumb);
				var url=node.find("id").text();
				td.code=url.substring(url.lastIndexOf("/")+1);
				td.onclick=function(e)
				{
					td.innerHTML="<div id=\"player\"></div>";
					play(td.code);
				};
				td.innerHTML+=node.find("title").first().text();
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
