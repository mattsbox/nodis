(function()
{
	window.lat=0;
	window.lon=0;
	var markers=Array(),marker_index=0,map,disp,bounds,old_bounds;
	function initialize_map()
	{
		/*var map_options = 
		{
			zoom: 12,
			center: new google.maps.LatLng(lat,lon),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		map = new google.maps.Map(document.getElementById("map_canvas"), map_options);
		map.bounds_changed=function()
		{
			ne=map.getBounds().getNorthEast();
			populate_map();
			map.bounds_changed=function()
			{
				ne=map.getBounds().getNorthEast();
			}
			console.log(lat);
			console.log(lon)
		};
		map.zoom_changed=populate_map;*/
		map=L.map("map_canvas").setView([lat,lon],11);
		L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png",{attribution:"&copy <a href=\"http://osm.org/copyright\">OpenStreetMap</a>"}).addTo(map);
		populate_map();
		map.on("zoomend dragend",populate_map);
	}
	function populate_map()
	{
		old_bounds=bounds;
		bounds=map.getBounds();
		for(mark in markers)
		{
			if(!bounds.contains(markers[mark].getLatLng()))
			{
				map.removeLayer(markers[mark]);
			}
		}
		var rlt=bounds.getNorthEast().lat-lat;
		var rln=bounds.getNorthEast().lng-lon;
		$.get("/get_listens?lat="+lat+"&lon="+lon+"&rlt="+rlt+"&rln="+rln,parse_nodes,"json");
		$.get("/songkick?lat="+(bounds.getCenter().lat+rlt)+"&lon="+bounds.getCenter().lng,parse_sk,"json");
		$.get("/songkick?lat="+bounds.getCenter().lat+"&lon="+(bounds.getCenter().lng+rln),parse_sk,"json");
		$.get("/songkick?lat="+(bounds.getCenter().lat-rlt)+"&lon="+bounds.getCenter().lng,parse_sk,"json");
		$.get("/songkick?lat="+bounds.getCenter().lat+"&lon="+(bounds.getCenter().lng-rln),parse_sk,"json");
		console.log(bounds.getCenter().lat);
		console.log(bounds.getCenter().lng);
	}
	function parse_sk(data)
	{
		var e=data.resultsPage.results.event;
		for(ev in e)
		{
			mark=generate_marker(e[ev].location.lat,e[ev].location.lng,"yellow");
			generate_popup(mark,"<a href=\""+e[ev].uri+"\">"+e[ev].displayName+"</a>");
		}
	}
	function generate_popup(mark,con)
	{
		if(mark){mark.bindPopup(con);}
	}
	function generate_marker(lat,lon,color)

	{
		if(lat&&lon&&(!(old_bounds&&old_bounds.contains(new L.LatLng(lat,lon)))))
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
			return markers[marker_index-1];
		}
		return false;
		/*markers[markers.length]=new google.maps.Marker({
				map:map,
				animation: google.maps.Animation.DROP,
				position: new google.maps.LatLng(lat,lon),
				icon:
				{
					url:"/res/img/mappage/"+color+"pin.png",
					size: new google.maps.Size(20,40),
					scaledSize: new google.maps.Size(20,40)
				}
			});*/
		
	}
	function load_script() 
	{
		disp=$("#dispdiv");
		/*var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyAq0ZisrG4Uid-7__QbR72CxvoE88NC4G8&sensor=true&callback=initialize_loc";
		document.body.appendChild(script);*/
		initialize_loc();
	}
	function parse_nodes(data)
	{
		disp.html("");
		for(node in data)
		{
			mark=generate_marker(data[node].lat,data[node].lon,"darkgreen");
			if(data[node].ytc)
			{
				$.get("https://gdata.youtube.com/feeds/api/videos/"+data[node].ytc,function(resdata)
				{
					var img=$(resdata).find("entry thumbnail").first().attr("url");
					if(img)
					{
						disp.append("<div style=\"height:10%;width:100%\"><img src=\""+img+"\" style=\"height:100%;position:static\"/><a onclick=\"play_choice\" code=\""+data[node].ytc+"\">"+data[node].title+"</a></div>");
						generate_popup(mark,"<img src=\""+img+"\" style=\"height:40px;position:static\"/><a onclick=\"play_choice\" code=\""+data[node].ytc+"\">"+data[node].title+"</a>");
					}else{node_display_fallback(data[node],mark);}
				},"xml");
			}else{node_display_fallback(data[node],mark);}
		}
	}
	function node_display_fallback(node,mark)
	{
		var entry=$("<a>").html(node.title);
		//Query returned no image
		if(node.ytc)
		{
			entry.attr("code",node.ytc).click(function()
			{
				//Play song, or try
			});
		}
		else
		{
			entry.click(function(){/*search for it*/});
		}
		entry.appendTo(disp);
	}
	function play_choice(e)
	{
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
						console.log(x);
					}
				}
				position_fallback();
			});
		}else{position_fallback();}
	}
	function position_fallback()
	{
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
				lat=0;//53.729;
				lon=0;//-79.337;
				initialize_map();
			}
		};	
	}
	$(document).ready(load_script);
})();
