//JS and Unity
var allBaseLines = new Array();
var pts;
var canvas_name;
var animation_timeout=500;

function qhPlotPoints(canvas_name_html,canvas_size)				//Function to plot random points in the canvas
{
	canvas_name=canvas_name_html;
	ctx = document.getElementById(canvas_name).getContext('2d');
	ctx.clearRect(0,0,canvas_size,canvas_size);		//Draw Canvas board - Rectangle
	ctx.fillStyle = 'rgb(0,0,0)';	//Set color of points
////////////////////////////////////////////////////////////Points Start
/*
//Generate points Manually
	pts = [ [0,30],[0,93],[110,30],[10,130],[102,303],[105,130] ];		//Set value manually
*/

//Generate points randomly
	total_no_of_points_generated = Math.floor((Math.random() * 500) + 10);	//no of points between 10 and 500
	pts = getRandomPoints(total_no_of_points_generated,canvas_size,canvas_size);	//Generate Random Points
////////////////////////////////////////////////////////////Points End
	for (var idx in pts)
	{
		var pt = pts[idx];
		ctx.fillRect(pt[0],pt[1],2,2);		//Put points in canvas
	}
}

function qhPlotConvexHull()			//Draw convex hull in graph
{
	var ch = getConvexHull(pts);	//Get Quick Hull Points
	var eBL = allBaseLines[0];

	function plotIntermediateBL()
	{
		var l = allBaseLines.shift();		//Pop first item
		if (l)	//if item exists and popped
		{
			plotBaseLine(l, 'rgb(180,180,180)');
			setTimeout(plotIntermediateBL, animation_timeout);
		}
		else
		{
			for (var idx in ch)
			{
				var baseLine = ch[idx];
				plotBaseLine(baseLine, 'rgb(255,0,0)');		//Draw Line
			}
			plotBaseLine(eBL,'rgb(0,255,0)');				//Draw Base Line
		}
	}
	plotIntermediateBL();
}

function getConvexHull(points)		//Quick hull Algorithm Simulation (Recursive) - Find Points
{
	//find first baseline
	var maxX, minX;			//All points are greater than 0, so no initialization is needed
	var maxPt, minPt;
	for (var idx in points)		//Find 2 extreme points to devide them
	{
		var pt = points[idx];
		if (pt[0] > maxX || !maxX)
		{
			maxPt = pt;
			maxX = pt[0];
		}
		if (pt[0] < minX || !minX)
		{
			minPt = pt;
			minX = pt[0];
		}
	}
	var ch = [].concat(buildConvexHull([minPt, maxPt], points),
				buildConvexHull([maxPt, minPt], points));	//Create upper and lower points and concate them and store
	return ch;
}

//quickhull for one part
function buildConvexHull(baseLine, points)
{
	allBaseLines.push(baseLine);		//Over rites in global value, but not making any problem, because the data is stored then in function
	var convexHullBaseLines = new Array();
	var t = findMostDistantPointFromBaseLine(baseLine, points);
	if (t.maxPoint.length)
	{ // if there is still a point "outside" the base line
		convexHullBaseLines = 
			convexHullBaseLines.concat( 
				buildConvexHull( [baseLine[0],t.maxPoint], t.newPoints) 
			);
		convexHullBaseLines = 
			convexHullBaseLines.concat( 
				buildConvexHull( [t.maxPoint,baseLine[1]], t.newPoints) 
			);
		return convexHullBaseLines;
	}
	else
	{	// if there is no more point "outside" the base line, the current base line is part of the convex hull
		return [baseLine];
	}
}

function findMostDistantPointFromBaseLine(baseLine, points)		//Find the most distant point
{
	var maxD = 0;
	var maxPt = new Array();
	var newPoints = new Array();
	for (var idx in points)
	{
		var pt = points[idx];
		var d = getDistant(pt, baseLine);
		if ( d > 0)
		{
			newPoints.push(pt);
		}
		else
		{
			continue;
		}
		if ( d > maxD )
		{
			maxD = d;
			maxPt = pt;
		}
	}
	return {'maxPoint':maxPt, 'newPoints':newPoints};
}

function getDistant(cpt, bl)	//Find distence of point and line
{
	//return ( (cpt[0]*bl[0][1]+bl[0][0]*bl[1][0]+bl[1][1]*cpt[1]-cpt[1]*bl[0][0]-bl[0][1]*bl[1][0]-bl[1][1]*cpt[0])/Math.sqrt( (bl[0][0]-bl[0][1])*(bl[0][0]-bl[0][1]) + (bl[1][0]-bl[1][1])*(bl[1][0]-bl[1][1]) ) );

	var Vy = bl[1][0] - bl[0][0];
	var Vx = bl[0][1] - bl[1][1];
	return (Vx * (cpt[0] - bl[0][0]) + Vy * (cpt[1] -bl[0][1]));
}

//utility function for animation
function getRandomPoints(numPoint, xMax, yMax)
{
	var points = new Array();
	var phase = Math.random() * Math.PI * 2;
	for (var i = 0; i < numPoint/2; i++)
	{
		var r =  Math.random()*xMax/4;
		var theta = Math.random() * 1.5 * Math.PI + phase;
		points.push( [ xMax /4 + r * Math.cos(theta), yMax/2 + 2 * r * Math.sin(theta) ] )
	}
	var phase = Math.random() * Math.PI * 2;
	for (var i = 0; i < numPoint/2; i++)
	{
		var r =  Math.random()*xMax/4;
		var theta = Math.random() * 1.5 * Math.PI + phase;
		points.push( [ xMax /4 * 3 +  r * Math.cos(theta), yMax/2 +  r * Math.sin(theta) ] )
	}
	return points
}

function plotBaseLine(baseLine,color)		//Draw Base Line with Unity
{
	var ctx = document.getElementById(canvas_name).getContext('2d');
	var pt1 = baseLine[0]
	var pt2 = baseLine[1];
	ctx.save()
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(pt1[0],pt1[1]);
	ctx.lineTo(pt2[0],pt2[1]);
	ctx.stroke();
	ctx.restore();
}
