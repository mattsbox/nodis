(function()
{
	window.lat=0;
	window.lon=0;
	var markers=Array(),marker_index=0,loci={},map,disp,bounds,old_bounds;
	function initialize_map()
	{
		map=L.map("map_canvas").setView([lat,lon],11);
		L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png",{attribution:"Data &copy <a href=\"http://osm.org/copyright\">OpenStreetMap</a>"}).addTo(map);
		populate_map(true);
		map.on("zoomend dragend moveend",populate_map);
	}
	function populate_map(overwrite)
	{
		old_bounds=bounds;
		bounds=map.getBounds();
		lat=bounds.getCenter().lat;
		lon=bounds.getCenter().lng;
		for(mark in markers)
		{
			var ll=markers[mark].getLatLng();
			if(!bounds.contains(ll))
			{
				map.removeLayer(markers[mark]);
				loci[[ll.lat,ll.lng]]=false;
			}
		}
		var rlt=bounds.getNorthEast().lat-lat;
		var rln=bounds.getNorthEast().lng-lon;
		$.get("/get_listens?lat="+lat+"&lon="+lon+"&rlt="+rlt+"&rln="+rln,function(data){parse_nodes(data,overwrite);},"json");
		$.get("/songkick?lat="+(bounds.getCenter().lat+rlt/2)+"&lon="+bounds.getCenter().lng,parse_sk,"json");
		$.get("/songkick?lat="+bounds.getCenter().lat+"&lon="+(bounds.getCenter().lng+rln/2),parse_sk,"json");
		$.get("/songkick?lat="+(bounds.getCenter().lat-rlt/2)+"&lon="+bounds.getCenter().lng,parse_sk,"json");
		$.get("/songkick?lat="+bounds.getCenter().lat+"&lon="+(bounds.getCenter().lng-rln/2),parse_sk,"json");
	}
	function parse_sk(data)
	{
		var e=data.resultsPage.results.event;
		for(ev in e)
		{
			var mark=generate_marker(e[ev].location.lat,e[ev].location.lng,"yellow");
			generate_popup(mark,"<a href=\""+e[ev].uri+"\" target=\"_blank\">"+e[ev].displayName+"</a>");
		}
	}
	function generate_popup(mark,con)
	{
		if(markers[mark]){markers[mark].bindPopup(con);}
	}
	function generate_marker(lat,lon,color,overwrite)
	{
		if(lat&&lon)
		{
			if(loci[[lat,lon]]&&overwrite){loci[[lat,lon]]=false;}
			if(!loci[[lat,lon]])
			{
				markers[marker_index]=new L.Marker([lat,lon],
				{
					icon:new L.Icon(
					{
						iconUrl:"/res/img/mappage/"+color+"pin.png",
						iconSize: [20,40],
						iconAnchor: [10,40],
						popupAnchor: [0,-40]
					})
				});
				markers[marker_index].addTo(map);
				marker_index++;
				loci[[lat,lon]]=true;
				return marker_index-1;
			}
		}
		return false;
	}
	function load_script() 
	{
		disp=$("#dispdiv");
		initialize_loc();
	}
	function parse_nodes(data,overwrite)
	{
		disp.html("");
		data.reverse();
		for(node in data)
		{
			console.log("INDIANA "+node+" "+data[node].ytc);
			console.log("KENTUCKY "+data[node]._id);
			var mark=generate_marker(data[node].lat,data[node].lon,"darkgreen",overwrite);
			if(data[node].ytc)
			{
				$.get("https://gdata.youtube.com/feeds/api/videos/"+data[node].ytc,
					(function(m,n)
					{
						return function(resdata)
						{
							var img=$(resdata).find("entry thumbnail").first().attr("url");
							if(img)
							{
								var a=document.createElement("a");
								a.innerHTML="<img src=\""+img+"\" style=\"height:40px;position:static\"/>"+data[n].title;
								a.href="#";
								a.onclick=function()
								{
									$("#video_box").html($("<div>").attr("id","player").css("width","50%").css("margin-left","25%"));
									scrollto("#ytcontent")();
									play(data[n].ytc,data[n].title);
								};
								generate_popup(m,a);
							}else{node_display_fallback(data[n],m);}
						};
					})(mark,node)
				,"xml");
			}else{node_display_fallback(data[node],mark);}
		}
	}
	function node_display_fallback(node,mark)
	{
		var a=document.createElement("a");
		a.innerHTML=node.title;
		if(node.ytc)
		{
			a.onclick=function()
			{
				$("#spanel").append($("<div>").attr("id","player").css("height","80%"));
				scrollto("#spanel")();
				play(node.ytc,node.title);
			}
		}
		else
		{
			a.click(function(){/*search for it*/});
		}
		$(a).appendTo(disp);
		generate_popup(mark,a);
	}
	function play_choice()
	{
		alert();
		if(!e){e=window.event};
		alert(e.target);
	}
	function initialize_loc()
	{
		if(navigator&&navigator.geolocation)
		{
			navigator.geolocation.getCurrentPosition(function(p)
			{
				lat=p.coords.latitude;
				lon=p.coords.longitude;
				initialize_map();
			},
			function(err)
			{
				for(x in err)
				{
					if(err[x]==err["code"]&&x!="code")
					{
						console.log("Navigator error code: "+x);
					}
				}
				position_fallback();
			});
		}else{position_fallback();}
	}
	function position_fallback()
	{
		console.log("OMAHA");
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "https://www.google.com/jsapi";
		document.body.appendChild(script);
		script.onload=function()
		{
			if(google&&google.loader&&google.loader.ClientLocation)
			{
				lat=google.loader.ClientLocation.latitude;
				lon=google.loader.ClientLocation.longitude;
				initialize_map();
			}
			else
			{
				console.log("MINNEAPOLIS");
				lat=0;//53.729;
				lon=0;//-79.337;
				initialize_map();
			}
		};	
	}
	$(document).ready(load_script);
})();
