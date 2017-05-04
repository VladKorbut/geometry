'use strict';
(function() {
	var c = document.getElementById('canvas');
	var ctx = c.getContext('2d');


	const MAX_PERIM = 1500;
	const ONE_RADIAN = 57.295779513082;
	const PI = 3.141592653589793238462643;

	function rand(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}

	function randPoint() {
		return {
			x: rand(0 + 200, document.getElementById('canvas').getAttribute('width') - 200),
			y: rand(0 + 200, document.getElementById('canvas').getAttribute('height') - 200)
		}
	}

	function clear() {
		ctx.clearRect(0, 0, c.width, c.height);
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.closePath();
	}

	function drawRedPolygon(points) {
		ctx.beginPath();
		points.forEach(function(item, index, arr) {
			ctx.strokeStyle = "#FF0000";
			ctx.lineTo(item.x, item.y);

		});
		ctx.closePath();
		ctx.stroke();
	}

	function drawPolygon(points) {
		ctx.beginPath();
		points.forEach(function(item, index, arr) {
			ctx.font = "1em Arial";
			ctx.fillStyle = '#11bb11';
			ctx.strokeStyle = "#000";
			//ctx.fillText(index,item.x,item.y);
			ctx.lineTo(item.x, item.y);

		});
		ctx.closePath();
		ctx.stroke();
	}

	function drawPoints(points) {
		ctx.beginPath();
		points.forEach(function(item, index, arr) {
			ctx.font = "1em Arial";
			ctx.fillStyle = '#11bb11';
			ctx.strokeStyle = "#000";
			ctx.fillText(index, item.x, item.y);
			ctx.moveTo(item.x, item.y);
			ctx.arc(item.x, item.y, 1, 0, 360);
		});
		ctx.closePath();
		ctx.stroke();
	}

function drawRay(point1, point2){
		ctx.beginPath();
		ctx.lineTo(point1.x, point1.y);
		ctx.lineTo(point2.x, point2.y);
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

	function findBottomPointPosition(points) {
		var min = 0;
		points.forEach(function(item, i, arr) {
			if (arr[min].y <= item.y) {
				if (arr[min].y == item.y) {
					if (arr[min].x > item.x) {
						min = i;
					}
				}
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
	function vectorMult(point1, point2) {
		return point1.x * point2.x + point1.y * point2.y;
	}
	//модуль вектора(длинна)
	function vectLenght(point) {
		return Math.sqrt((vectorMult(point, point)));
	}

	function calcAngle(a, b) {
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
			if (i != 0)
				return {
					angle: calcAngle(arr[0], item),
					pos: i
				};
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


	function det(x1, x2, y1, y2) {
		return x1 * y2 - x2 * y1;
	}

	function sideOfPoint(det) {
		if (det > 0)
			return -1;
		else if (det < 0)
			return 1;
		else
			return 0;
	}

	function lineMinusPointSide(line, point) {
		var determ = det(line[1].x - line[0].x, point.x - line[0].x,
			line[0].y - line[1].y, line[0].y - point.y);
		return (sideOfPoint(determ));
	}


	function quickHull(points) {
		var qh = [];
		var leftPos = 0,
			rightPos = 0;

		
		points.forEach(function(item, i) {
			if (points[leftPos].x > item.x){
				leftPos = i;
			}
			if (points[rightPos].x < item.x){
				rightPos = i;
			}
		})

		qh.push(points[leftPos]);
		qh.push(points[rightPos]);

		//drawRay(points[leftPos],points[rightPos] )
		var line = [
						{x:points[leftPos].x, y:points[leftPos].y},
						{x:points[rightPos].x, y:points[rightPos].y}
				   ]
		var top = points.filter(function(item, i) {
			console.log(i, item)
			return lineMinusPointSide(line, item) == -1
		});

		var bottom = points.filter(function(item, i) {
			return lineMinusPointSide(line, item) == 1
		});
		qh = qhull(points[leftPos], points[rightPos], top, qh);

		qh = qhull(points[rightPos], points[leftPos],  bottom, qh);

		qh = sortByAngle(qh);

		qh = sortByAngle(qh);
		//drawPolygon(qh);
		return qh;
	}

	function qhull(left, right, points, qh){

		//drawRay(left, right)
		
		if(!points.length){
			return qh;
		}

		if(points.length == 1){
			qh.push(points[0]);
			return qh;
		}
		
		var area = triangleArea(left, right, points[0]);
		var pos = 0;
		points.forEach(function(item, i, arr){
			if(triangleArea(left, right, item) > area){
				pos = i;
			}	
		});

		
		qh.push(points[pos]);

		
		var line = [
						{x:left.x, y:left.y},
						{x:points[pos].x, y:points[pos].y}
				   ]
		var topLeft = points.filter(function(item, i) {
			return lineMinusPointSide(line, item) == -1
		})

		var line = [

						{x:points[pos].x, y:points[pos].y},
						{x:right.x, y:right.y}
				   ]
		var topRight = points.filter(function(item, i) {
			return lineMinusPointSide(line, item) == -1
		})

		console.log(topLeft, topRight)
		
		
		if(topLeft.length)
			qh = qhull(left, points[pos], topLeft, qh);
		if(topRight.length)
			qh = qhull(points[pos], right, topRight, qh);
		
		return qh;
	}

	function movePoints(points) {
		var res = points.map(function(item, i) {
			return {
				x: item.x + Math.cos(mov[i]),
				y: item.y + Math.sin(mov[i])
			};
		});

		return res;
	}

	function genSpeed(length) {
		var mov = [];
		for (var i = 0; i < length; ++i) {
			mov.push(radian(rand(0, 360)));
		}
		return mov;
	}

	function changeDirection(mov) {
		return mov.map(function(item) {
			return item + PI;
		})
	}

	function triangleArea(first, second, third) {
		let a = distance(first, second);
		let b = distance(second, third);
		let c = distance(first, third);
		let p = (a + b + c) / 2;

		return Math.sqrt(p * (p - a) * (p - b) * (p - c));
	}

	function findDiam(figure) {
		let n = figure.length - 1,
			i = 1,
			end, start, temp;
		let resLength = 0;
		while (Math.abs(triangleArea(figure[n - 1], figure[0],
				figure[i])) > Math.abs(triangleArea(figure[n - 1],
				figure[0], figure[i - 1]))) {
			++i;
		}

		start = i - 1;
		let j = 1;
		while (start != n - 1) {
			temp = start + 1;

			while (Math.abs(triangleArea(figure[j - 1], figure[j], figure[temp])) >
				Math.abs(triangleArea(figure[j - 1], figure[j], figure[temp - 1]))
			) {
				temp++;
				if (temp == n) {
					break;
				}
			}
			end = temp - 1;

			for (let k = start; k <= end; k++) {
				let tempLength = distance(figure[k], figure[j - 1]);
				if (tempLength > resLength) {
					resLength = tempLength;
				}
			}
			start = end;
			j++;
		}
		return resLength;
	}

	function distance(a, b) {
		return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
	}

	function checkPerim(hull) {
		var perim = 0;
		hull.forEach(function(item, i, arr) {
			var x = arr[i % arr.length].x - arr[(i + 1) % arr.length].x;
			var y = arr[i % arr.length].y - arr[(i + 1) % arr.length].y;
			perim += Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
		});
		return perim;
	}

	function radian(angle) {
		const pi = 3.14159265359;
		return angle * pi / 180;
	}
	var points = [];
	var container = [];
	for (var i = 0; i < 7; ++i) {
		points.push(randPoint());
	}
	drawPoints(points);

	var mov = genSpeed(points.length);

	var fps = 50;

	//drawPoints(points);
	//drawPolygon(quickHull(points));

	var timer = setInterval(function() {
		points = movePoints(points);
		clear();
		drawPoints(points);
		var hull = quickHull(points);
		drawPolygon(hull);
		if (checkPerim(hull) > 1000) {
			console.log(changeDirection(mov));
			mov = changeDirection(mov);
			//clearInterval(timer);
		}
	}, 1000 / fps);


	//drawPolygon(jarvis(points));

})()