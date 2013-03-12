$(document).ready(function()
{
	var mp=$("#mappanel");
	var d=$("#divider");
	var sp=$("#spanel");
	mp.p=64;
	d.l=34;
	sp.p=0;
	function step(i)
	{
		window.setTimeout((function(i)
		{
			return function()
			{
				if((i>0&&mp.p>0)||(i<0&&mp.p<64))
				{
					mp.p-=i;
					mp.css("width",mp.p+"%");
					mp.css("left",(100-mp.p)+"%");
					d.l+=i;
					d.css("left",d.l+"%");
					sp.p+=i;
					sp.css("width",sp.p+"%");
					step(i);	
				}
			};
		})(i),1000/30);
	}
	function fold(right)
	{
		var i;
		if(right){i=1;}
		else{i=-1;}
		step(i);
	}
	$("#mpsicon").click(function(){fold(true);});
	$("#spbicon").click(function(){fold(false);});
});
