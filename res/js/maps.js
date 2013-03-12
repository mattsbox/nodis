(function()
{
	window.lat=0;
	window.lon=0;
	var markers=Array(),map;
	function initialize_map()
	{
		var map_options = 
		{
			zoom: 12,
			center: new google.maps.LatLng(lat,lon),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		map = new google.maps.Map(document.getElementById("map_canvas"), map_options);
		map.bounds_changed=function()
		{
			var ne=map.getBounds().getNorthEast();
			$.get("/get_listens?lat="+lat+"&lon="+lon+"&rlt="+(ne.lat()-lat)+"&rln="+(ne.lng()-lon),parse_nodes,"json");	
		};
	}
	function load_script() 
	{
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyAq0ZisrG4Uid-7__QbR72CxvoE88NC4G8&sensor=true&callback=initialize_loc";
		document.body.appendChild(script);
	}
	function parse_nodes(data)
	{
		console.log(map);
		for(node in data)
		{
			markers[node]=new google.maps.Marker({
				map:map,
				animation: google.maps.Animation.DROP,
				position: new google.maps.LatLng(data[node].lat,data[node].lon)
			});
		}
	}
	window.initialize_loc=function()
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
				fallback();
			});
		}
		else{fallback();}
	}
	function fallback()
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
				lat=53.729;
				lon=-79.337;
				initialize_map();
			}
		};	
	}
	$(document).ready(load_script);
})();
