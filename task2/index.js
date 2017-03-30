'use strict';
(function(){
	var c = document.getElementById('canvas');
	var ctx = c.getContext('2d');

	var points = [
		{x:15, y:15},
		{x:15, y:800},
		{x:200, y:500},
		{x:395, y:700},
		{x:650, y:389},
		{x:790, y:49},
		{x:500, y:150}
	]
	function rand(min, max){
		return Math.floor(Math.random() * (max - min) + min);
	}

	function randPoint(){
		return {x: rand(0, document.getElementById('canvas').getAttribute('width')),
				y: rand(0, document.getElementById('canvas').getAttribute('width'))
			}
	}

	function drawPolygon(points){
		ctx.beginPath();
		points.forEach(function(item, index, arr){
			ctx.lineTo(item.x, item.y);
		})
		ctx.closePath();
		ctx.stroke();
	}

	function drawPoint(point){
		ctx.fillStyle = '#f00';
		ctx.fillRect(point.x,point.y,8,8);
	}

	function drawRay(point1, point2){
		ctx.beginPath();
		ctx.lineTo(point1.x, point1.y);
		ctx.lineTo(point2.x, point2.y);
		ctx.closePath();
		ctx.stroke();
	}
	function dimensionTest(points, point){
		var lieOutside = false;

		var minx=c.height, miny=c.width, maxx=0, maxy=0;

		points.forEach(function(item, index, arr){
			if(item.x > maxx){
				maxx = item.x;
			}
			if(item.y > maxy){
				maxy = item.y;
			}
			if(item.x < minx){
				minx = item.x;
			}
			if(item.y < miny){
				miny = item.y;
			}
		});
		var rec = [
			{x:minx, y:miny},
			{x:minx, y:maxy},
			{x:maxx, y:maxy},
			{x:maxx, y:miny},
		];
		if(point.x < minx || point.y > maxy || point.x > maxx || point.y < miny){
			lieOutside = true;
		}
		return lieOutside;
	}

	function rayTest(points, point){
		var minx=c.height, miny=c.width, maxx=0, maxy=0;

		points.forEach(function(item, index, arr){
			if(item.x > maxx){
				maxx = item.x;
			}
			if(item.y > maxy){
				maxy = item.y;
			}
			if(item.x < minx){
				minx = item.x;
			}
			if(item.y < miny){
				miny = item.y;
			}
		});
		drawPoint(randPoint);
		var q = {x:minx-5, y:randPoint.y};
		var randLine = [];
		randLine[0] = randPoint;
		randLine[1] = q;
		var counter = 0
		var figureLine = [];
		drawRay(randLine, figureLine)
		for(var i=0;i<points.length; ++i){
			figureLine[0] = points[i];
			figureLine[1] = points[(i+1) % points.length];
			if(intersectLines(randLine, figureLine)){
				++counter;
			}
			if(lieOnVertice(randLine, figureLine)){
				counter = 0;
				q.y -= 1;
				i = -1;
			}
		}
		return counter;
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

	function lineMinusPointSide(line, point){
		var determ = det(line[1].x - line[0].x, point.x - line[0].x,
						 line[0].y - line[1].y, line[0].y - point.y);
		return (sideOfPoint(determ));
	}

	function intersectLines(line1, line2){

		if((lineMinusPointSide(line1, line2[0]) != lineMinusPointSide(line1, line2[1]))
		&& (lineMinusPointSide(line2, line1[0]) != lineMinusPointSide(line2, line1[1]))){
			return true;
		}
		return false;
	}

	function lieOnVertice(line1, line2){
		if(!lineMinusPointSide(line1, line2[0]) || !lineMinusPointSide(line1, line2[1]) ||
		   !lineMinusPointSide(line2, line1[0]) || !lineMinusPointSide(line2, line1[1])){
			return true;

		} return false;
	}

	drawPolygon(points);
	var message = '';
	var randPoint = randPoint();
	if(dimensionTest(points, randPoint)){
		message ="Вне фигуры";
	}else{
		if(rayTest(points, randPoint)%2){
			message ="Внутри фигуры";
		}else{
			message ="Вне фигуры";
		}
	}
	document.getElementById('result').innerHTML = message;
})()