'use strict';

var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');

    

    function rand(min, max){
        return Math.floor(Math.random() * (max - min) + min);
    }

    function randPoint(){
        return {x: rand(0, document.getElementById('canvas').getAttribute('width')),
                y: rand(0, document.getElementById('canvas').getAttribute('width'))
            }
    }

function start(points) {
    var convex = [];
    if(points.length < 3) 
        return;

    min_x = 0;
    max_x = 0;

    for(let i = 1; i < points.length; i++) {
        if(points[i].x < points[min_x].x)
            min_x = i;
        if(points[i].x > points[max_x].x)
            max_x = i;
    }

    A_X = points[min_x];
    B_X = points[max_x];
    
    convex.push(points[min_x]);
    convex.push(points[max_x]);

    

    points.splice(min_x, 1);
    points.splice(points.indexOf(B_X), 1);

    let leftSide = [];
    let rightSide = [];
    
    let temp = [A_X.getPoint(),
                B_X.getPoint()];

    for(let i = 0; i < points.length; i++) {
        if (side(temp, points[i].getPoint()) == -1) {
            leftSide.push(points[i]);
        } else if (side(temp, points[i].getPoint()) == 1) {
            rightSide.push(points[i]);
        } else
            console.log("wtf")
    }



    quickhull(A_X, B_X, leftSide);
    quickhull(B_X, A_X, rightSide);

    convex.push(convex[0])

    return convex;
}

function quickhull(A_X, B_X, array) { 
    let insertPosition = convex.indexOf(B_X);

    if(array.length == 0)
        return;

    if(array.length == 1) {
        let p = array[0];
        array.pop();
        convex.splice(insertPosition, 0, p);
        return;
    }

    let dist = -1;
    let futhestPoint = 0;
    for(let i = 0; i < array.length; i++) {
        let P = array[i];
        let tempDist = triangle_area(A_X, B_X, P);
        if(tempDist > dist) {
            dist = tempDist;
            futhestPoint = i;
        }
    }


    let point = array[futhestPoint];
    array.splice(futhestPoint, 1);
    convex.splice(insertPosition, 0, point);

    let leftSideA_XP = [];
    let leftSidePB_X = [];
    
    for(let i = 0; i < array.length; i++) {
        let m = array[i];
        if(side([A_X.point(), point.point()], m.point()) == -1) {
            leftSideA_XP.push(m);
        }
    }

    for(let i = 0; i < array.length; i++) {
        let m = array[i];
        if(side([point.point(), B_X.point()], m.point()) == -1) {
            leftSidePB_X.push(m);
        }
    }

    quickhull(A_X, point, leftSideA_XP);
    quickhull(point, B_X, leftSidePB_X);

}


var points = [];
for (var i = 0; i < 7; ++i) {
        points.push(randPoint());
    }


start(points);