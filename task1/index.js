(function(){
	function rand(min, max){
		return Math.floor(Math.random() * (max - min) + min);
	}
	function init(){
		return rand(0, document.getElementById('canvas').getAttribute('width'))
	}
	function det(x1,x2,y1,y2){
		return x1*y2-x2*y1;
	}
	function sideOfPoint(det){
	    if (det > 0)
	        return -1;
	    else if (det < 0)
	        return 1;
	    else
	        return 0;
	}
	var c = document.getElementById('canvas');
	var ctx = c.getContext('2d');
	function clear(){
		ctx.clearRect(0, 0, c.width, c.height);
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.closePath();
	}
	function draw(){
		var verteses = 5;
		
		var points = [];
		points.push({x :init(), y: init()});
		points.push({x :init(), y: init()});
		ctx.moveTo(points[0].x,points[0].y);
		ctx.font = "1em Arial";
		ctx.fillStyle = '#11bb11';
		ctx.fillText("1",points[0].x,points[0].y);
		ctx.lineTo(points[1].x,points[1].y);
		ctx.fillText("2",points[1].x,points[1].y);
		for(var i=0;i<verteses-3;++i){
			var x = init();
			var y = init();
			while(true){
				var side = sideOfPoint(det(points[i+1].x-points[i].x,x-points[i].x,
								   		   points[i].y-points[i+1].y, points[i].y-y));
				if(side == -1){
						ctx.lineTo(x,y);
						ctx.stroke();
						ctx.fillText(i+3,x,y);
						points.push({x :x, y: y});
						break;
				}else{
					x = init();y=init();
				}
			}
		}
		ctx.stroke();
		var x = init();
		var y = init();
		while(true){
			var side = sideOfPoint(det(points[verteses-2].x-points[verteses-3].x,x-points[verteses-3].x,
								   		   points[verteses-3].y-points[verteses-2].y, points[verteses-3].y-y));
			var sideOfFirst = sideOfPoint(det(x-points[verteses-2].x,points[0].x-points[verteses-2].x,
								   	points[verteses-2].y-y, points[verteses-2].y-points[0].y))
			var sideOfSecond = sideOfPoint(det(points[0].x-x,points[1].x-x,
								   	y-points[0].y, y-points[1].y))
			if(side == -1 && sideOfFirst == -1 && sideOfSecond == -1){
				ctx.lineTo(x,y);
				ctx.lineTo(points[0].x,points[0].y);
				ctx.fillText(i+3,x,y);
				points.push({x: x, y: y});
				break;
			}else{
				x = init();y=init();
			}
		}
		ctx.stroke();
	}
	draw();
	var button = document.getElementById('reload');
	button.addEventListener("click", function() {
		clear();
		draw();
	});
})()