function pointLocation(A, B, P) {
	var cp1 = (B.x - A.x) * (P.y - A.y) - (B.y - A.y) * (P.x - A.x);
	if (cp1 > 0)
		return 1;
	else if (cp1 == 0)
		return 0;
	else
		return -1;
}

function distanceCount(A, B, C) {
	var ABx = B.x - A.x;
	var ABy = B.y - A.y;
	var num = ABx * (A.y - C.y) - ABy * (A.x - C.x);
	if (num < 0)
		num = -num;
	return num;
}

function quickHull(points) {
	var convexHull = [];

	if (points.length < 3)
		return points.slice();

	var minPoint = -1,
		maxPoint = -1;
	var minX = Infinity;
	var maxX = -Infinity;
	for (var i = 0; i < points.length; i++) {
		if (points[i].x < minX) {
			minX = points[i].x;
			minPoint = i;
		}
		if (points[i].x > maxX) {
			maxX = points[i].x;
			maxPoint = i;
		}
	}


	var A = points[minPoint];
	var B = points[maxPoint];


	convexHull.push(A);
	convexHull.push(B);
	points.splice(minPoint);
	points.splice(maxPoint);

	var leftSet = [];
	var rightSet = [];

	for (var i = 0; i < points.length; i++) {
		var p = points[i];
		if (pointLocation(A, B, p) == -1)
			leftSet.push(p);
		else if (pointLocation(A, B, p) == 1)
			rightSet.push(p);
	}
	hullSet(A, B, rightSet, convexHull);
	hullSet(B, A, leftSet, convexHull);

	return convexHull;
}

function hullSet(A, B, set, hull) {
	var insertPosition = hull.indexOf(B);
	if (set.length == 0)
		return;
	if (set.length == 1) {
		var p = set[0];
		set.splice(0);
		hull.splice(insertPosition, 0, p);
		return;
	}
	var dist = -Infinity;
	var furthestPoint = -1;
	for (var i = 0; i < set.length; i++) {
		var p = set[i];
		var distance = distanceCount(A, B, p);
		if (distance > dist) {
			dist = distance;
			furthestPoint = i;
		}
	}
	var P = set[furthestPoint];
	set.splice(furthestPoint);
	hull.splice(insertPosition, 0, P);

	// Determine who's to the left of AP
	var leftSetAP = [];
	for (var i = 0; i < set.length; i++) {
		var M = set[i];
		if (pointLocation(A, P, M) == 1) {
			leftSetAP.push(M);
		}
	}

	// Determine who's to the left of PB
	var leftSetPB = [];
	for (var i = 0; i < set.length; i++) {
		var M = set[i];
		if (pointLocation(P, B, M) == 1) {
			leftSetPB.push(M);
		}
	}
	hullSet(A, P, leftSetAP, hull);
	hullSet(P, B, leftSetPB, hull);

}


function rand(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function randPoint() {
	return {
		x: rand(0 + 200, document.getElementById('canvas').getAttribute('width') - 200),
		y: rand(0 + 200, document.getElementById('canvas').getAttribute('height') - 200)
	}
}

var c = document.getElementById('canvas');
var ctx = c.getContext('2d');

function clear(){
		ctx.clearRect(0, 0, c.width, c.height);
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.closePath();
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

	function changeDirection(mov) {
		return mov.map(function(item) {
			return item + PI ;
		})
	}

	function checkDiam(hull) {
		hull.forEach(function(item, i, arr) {
			
		})
	}

	function checkPerim(hull) {
		var perim = 0;
		hull.forEach(function(item, i, arr) {
			var x = arr[i%arr.length].x - arr[(i+1)%arr.length].x;
			var y = arr[i%arr.length].y - arr[(i+1)%arr.length].y;
			perim += Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
		});
		return perim;
	}

	function radian(angle) {
		const pi = 3.14159265359;
		return angle * pi / 180;
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
			ctx.fillText(index,item.x,item.y);
			ctx.moveTo(item.x, item.y);
			ctx.arc(item.x, item.y, 1, 0, 360);
		});
		ctx.closePath();
		ctx.stroke();
	}

const MAX_PERIM = 1500;
	const ONE_RADIAN = 57.295779513082;
	const PI = 3.141592653589793238462643;
var points = [];
for (var i = 0; i < 18; ++i) {
	points.push(randPoint());
}


var mov = genSpeed(points.length);

	var fps = 50;
	//var timer = setInterval( function(){
		points = movePoints(points);
		clear();
		drawPoints(points);
		var jar = quickHull(points);
		drawPolygon(jar);
		if(checkPerim(jar) > MAX_PERIM){
			console.log(changeDirection(mov));
			mov = changeDirection(mov);
			clearInterval(timer);
		}
	//}, 1000 / fps);
