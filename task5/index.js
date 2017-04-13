'use strict';
(function(){
	var c = document.getElementById('canvas');
	var ctx = c.getContext('2d');

	

	function rand(min, max){
		return Math.floor(Math.random() * (max - min) + min);
	}

	function randPoint(){
		return {x: rand(200, document.getElementById('canvas').getAttribute('width')-200),
				y: rand(200, document.getElementById('canvas').getAttribute('width')-200)
			}
	}

	function clear(){
		ctx.clearRect(0, 0, c.width, c.height);
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.closePath();
	}

	function drawRedPolygon(points){
		ctx.beginPath();
		points.forEach(function(item, index, arr){
			ctx.strokeStyle="#FF0000";
			ctx.lineTo(item.x, item.y);

		});
		ctx.closePath();
		ctx.stroke();
	}

	function drawPolygon(points){
		ctx.beginPath();
		points.forEach(function(item, index, arr){
			ctx.font = "1em Arial";
			ctx.fillStyle = '#11bb11';
			ctx.strokeStyle="#000";
			//ctx.fillText(index,item.x,item.y);
			ctx.lineTo(item.x, item.y);

		});
		ctx.closePath();
		ctx.stroke();
	}

	function drawPoints(points){
		ctx.beginPath();
		points.forEach(function(item, index, arr){
			ctx.font = "1em Arial";
			ctx.fillStyle = '#11bb11';
			ctx.strokeStyle="#000";
			//ctx.fillText(index,item.x,item.y);
			ctx.moveTo(item.x, item.y);
			ctx.arc(item.x, item.y, 1, 0, 360);
		});
		ctx.closePath();
		ctx.stroke();
	}

	function drawRays(point1, point2) {
		ctx.beginPath();
		ctx.lineTo(point1.x, point1.y);
		ctx.lineTo(point2.x, point2.y);
		ctx.closePath();
		ctx.stroke();
	}
	function findBottomPointPosition(points){
		var min = 0;
		points.forEach(function(item, i, arr) {
			if(arr[min].y < item.y){
				min = i;
			}
		})
		return min;
	}
	//поставить нижнюю точку в начало списка
	function replaceFirstPoint(points) {
		var pos = findBottomPointPosition(points);
		var tmp = points[pos];
		points[pos] = points[0];
		points[0] = tmp;
	}
	//векторное произведение
	function vectorMult(point1, point2){
		return point1.x * point2.x + point1.y * point2.y;
	}
	//модуль вектора(длинна)
	function vectLenght(point){
		return Math.sqrt((vectorMult(point, point)));
	}

	function calcAngle(a, b) {
		var ONE_RADIAN = 57.295779513082;
        var deltaX, deltaY;

        if (!a || !b) return 0;

        deltaX = (b.x - a.x);
        deltaY = (b.y - a.y);

        if (deltaX == 0 && deltaY == 0) {
            return 0;
        }

        var angle = Math.atan2(deltaY, deltaX) * ONE_RADIAN;

        return angle;
	}

	function compareAngles(a, b) {
		if (a.angle < b.angle) return 1;
		if (a.angle > b.angle) return -1;
	}

	function sortByAngle(points) {
		var angles = [];
		angles = points.map(function(item, i, arr) {
			if(i != 0)
				return { angle: calcAngle(arr[0], item), pos:i};
		});
		angles.sort(compareAngles);
		angles.pop();
		angles.unshift({
			angle: calcAngle(points[0], points[findBottomPointPosition(points)]),
			pos: 0
		});
		return angles.map(function(item) {
			return points[item.pos];
		})
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


	function jarvis(points) {
		replaceFirstPoint(points);
		points = sortByAngle(points);
		var res = [];
		res.push(points[0]);
		res.push(points[1]);
		while(true){
			var line1 = {
				x: (res[res.length - 1].x - res[res.length - 2].x),
				y: (res[res.length - 1].y - res[res.length - 2].y)
			}
			var min = -Infinity,
			minPos = 0;
			points.forEach(function(item, i, arr){
				var line2 = {
					x: (item.x - res[res.length - 1].x),
					y: (item.y - res[res.length - 1].y)
				}
				if((vectorMult(line1, line2) / ( vectLenght(line1) , vectLenght(line2))) > min){
					min = (vectorMult(line1, line2) /( vectLenght(line1) , vectLenght(line2)));
					minPos = i;
				}
			})

			if(res.indexOf(points[minPos]) != -1) break;
			
			res.push(points[minPos]);
		}
		return res;
	}

	function movePoints(points) {
		var res = points.map(function(item, i) {
			return {x:item.x + Math.cos(mov[i]), y:item.y + Math.sin(mov[i])};
		});

		return res;
	}

	function genSpeed(length) {
		var mov = [];
		for(var i=0;i<length;++i){
			mov.push(radian(rand(0, 360)));
		}
		return mov;
	}

	function radian(angle) {
		const pi = 3.14159265359;
		return angle * pi / 180;
	}
	var points = [];
	var container = [];
	for(var i=0;i<20;++i){
		points.push(randPoint());
	}
	drawPoints(points);

	var mov = genSpeed(points.length);

	var fps = 50;
	var timer = setInterval( function(){
		points = movePoints(points);
		clear();
		drawPoints(points);
		drawPolygon(jarvis(points));
	}, 1000 / fps);


	//drawPolygon(jarvis(points));

})()	