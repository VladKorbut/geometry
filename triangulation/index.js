'use strict';
var c = document.getElementById('canvas');
var ctx = c.getContext('2d');

function rand(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function randPoint(width, height) {
	return {
		x: rand(0, width),
		y: rand(0, height)
	}
}

function drawPoints(points) {
	ctx.beginPath();
	points.forEach(function(item, index, arr) {
		ctx.font = "1em Arial";
		ctx.fillStyle = '#11bb11';
		ctx.strokeStyle = "#000";
		//ctx.fillText(index, item.x, item.y);
		ctx.moveTo(item.x, item.y);
		ctx.arc(item.x, item.y, 1, 0, 360);
	});
	ctx.closePath();
	ctx.stroke();
}

function genRandPointSet(size){
	var points = [];
	points.push({x:0,y:0});
	points.push({x:0,y:(document.getElementById('canvas').getAttribute('height')-1)});
	points.push({x:(document.getElementById('canvas').getAttribute('width')-1),y:0});
	points.push({
		x:(document.getElementById('canvas').getAttribute('width')-1),
		y:(document.getElementById('canvas').getAttribute('height')-1)
	})
	for(var i=0;i<size;++i){
		points.push(
			randPoint(
				document.getElementById('canvas').getAttribute('width'),
				document.getElementById('canvas').getAttribute('height')
			)
		)
	}
	return points;
}

function sortByY(points){
	return points.sort(function(a, b){
		return b.y -  a.y;
	});
}

function addPositions(points) {
	var i = 0;
	return points.map(function(item) {
		return {
			pos: i++,
			x:item.x,
			y:item.y
		}
	})
}

function sortForTriangulation(points){
	points = sortByY(points);
	if(points[0].x > points[1].x){
		var temp = points[0];
		points[0] = points[1];
		points[1] = temp;
	}
	return points;
}

function vectFromPoints(start, end) {
	return {x:end.x - start.x, y: end.y - start.y}
}

function scalarMult(vect1, vect2) {
	return vect1.x * vect2.x + vect1.y * vect2.y;
}

function vectLen(vect) {
	return Math.sqrt(scalarMult(vect, vect));
}

function angleBetweenVectors(vect1, vect2) {
	return Math.acos(scalarMult(vect1, vect2) / (vectLen(vect1) * vectLen(vect2)));
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

function lineMinusPointSide(vect, point) {
	var determ = det(vect[1].x - vect[0].x, point.x - vect[0].x,
					 vect[0].y - vect[1].y, vect[0].y - point.y);
	return sideOfPoint(determ);
}

function findNearestPoint(points, point1, point2){
	var maxAngle = -Infinity;
	var maxPos = -1;
	points.forEach(function(item, i){
		var angle = angleBetweenVectors(vectFromPoints(item, point1), vectFromPoints(item, point2));
		if(angle > maxAngle){
			maxAngle = angle;
			maxPos = i;
		}
	})
	return maxPos;
}


function drawRay(point1, point2){
		ctx.beginPath();
		ctx.lineTo(point1.x, point1.y);
		ctx.lineTo(point2.x, point2.y);
		ctx.closePath();
		ctx.stroke();
	}

function startTriangulation(points){
	var triangles = [];
	var maxPos = findNearestPoint(points, points[0], points[1]);
	//drawRay(points[0], points[1]);
	tri.push(sortByEncreasing([points[0].pos, points[1].pos, points[maxPos].pos]));
	var line = [
				{x:points[0].x,y:points[0].y},
				{x:points[1].x,y:points[1].y}
			]
	console.error(lineMinusPointSide(line, points[2]))
	if(lineMinusPointSide(line, points[maxPos]) == 1){
		trinagulation(points, points[1], points[maxPos]);
		trinagulation(points, points[maxPos], points[0]);
	}else{
		trinagulation(points, points[0], points[maxPos]);
		trinagulation(points, points[maxPos], points[1]);
	}
}

function trinagulation(points, point1, point2) {
	var higher = [];
	var line = [
				{x:point1.x,y:point1.y},
				{x:point2.x,y:point2.y}
			]
	//drawRay(point1, point2);
	points.forEach(function(item, i, arr) {
		if(lineMinusPointSide(line, item) == -1){
			higher.push(item);
		}
	});

	if(higher.length == 1){
		let triangle = sortByEncreasing([point1.pos, point2.pos, higher[0].pos]);
		if(!triangleExist(triangle)){
			//drawRay(point1, higher[0]);
			//drawRay(higher[0], point2);
			tri.push(triangle);
			trinagulation(points, point1, higher[0]);
			trinagulation(points, higher[0], point2);
		}
		
	}else{
		if(higher.length > 1){
			var point = findNearestPoint(higher, point1, point2);
			let triangle = sortByEncreasing([point1.pos, point2.pos, higher[point].pos]);
			if(!triangleExist(triangle)){
				tri.push(triangle);
				trinagulation(points, point1, higher[point]);
				trinagulation(points, higher[point], point2);
			}
		}
	}
}

function triangleExist(arr) {
	var flag = false;
	tri.forEach(function(item) {
		if(item[0] == arr[0] && item[1] == arr[1] && item[2] == arr[2]){
			flag = true;
			return;
		}
	})
	return flag;
}

function sortByEncreasing(arr) {
	return arr.sort(function(a, b) {
		return a > b;
	})
}

function indexOfPoint(arr, pos){
	var result = -1;
	arr.forEach(function(item, i) {
		if(item.pos == pos){
			result = i;
		}
	})
	return result;
}

var tri =[];

var points = genRandPointSet(280);
points = sortByY(points);
points = addPositions(points);
drawPoints(points);
startTriangulation(points);



tri.forEach(function(item) {
	var pol = item.map(function(item) {
		return points[item];
	})
	drawPolygon(pol)
})

function drawPolygon(points) {
		ctx.beginPath();
		points.forEach(function(item, index, arr) {
			ctx.font = "1em Arial";
			ctx.strokeStyle = "#000";
			//ctx.fillText(index,item.x,item.y);
			ctx.lineTo(item.x, item.y);

		});
		ctx.closePath();
		ctx.stroke();
	}
