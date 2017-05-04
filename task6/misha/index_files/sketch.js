"use strict";

let X = 600;
let Y = 600; 
//
// 2 laba
//
function det(A)
{
    let N = A.length, B = [], denom = 1, exchanges = 0;
    for (let i = 0; i < N; ++i)
     { B[i] = [];
       for (let j = 0; j < N; ++j) B[i][j] = A[i][j];
     }
    for (let i = 0; i < N-1; ++i)
     { let maxN = i, maxValue = Math.abs(B[i][i]);
       for (let j = i+1; j < N; ++j)
        { let value = Math.abs(B[j][i]);
          if (value > maxValue){ maxN = j; maxValue = value; }
        }
       if (maxN > i)
        { let temp = B[i]; B[i] = B[maxN]; B[maxN] = temp;
          ++exchanges;
        }
       else { if (maxValue == 0) return maxValue; }
       let value1 = B[i][i];
       for (let j = i+1; j < N; ++j)
        { let value2 = B[j][i];
          B[j][i] = 0;
          for (let k = i+1; k < N; ++k) B[j][k] = (B[j][k]*value1-B[i][k]*value2)/denom;
        }
       denom = value1;
     }
    if (exchanges%2) return -B[N-1][N-1];
    else return B[N-1][N-1];
}

function perimeter() {
    let result = 0;

    for(let i = 0; i < convex.length - 1; i++) {
        result += distance(convex[i], convex[i + 1]);
    }

    return result;
}

function distance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function mult(a, b) {
    return a[0] * b[0] + a[1] * b[1];
}

function module(a) {
    return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2));
}

function angleBetween(a, b) {
    return mult(a, b) / (module(a) * module(b));
}

function minus(a, b) {
    return [a[0] - b[0], a[1] - b[1]];
}

function plus(a, b) {
    return [a[0] + b[0], a[1] + b[1]];
}



function side(a, b) {
    let mas = [minus(a[1], a[0]), minus(a[0], b)];
    let detA = det(mas);
    if(detA > 0)
        return 1;
    else if (detA == 0) {
        return 0;
    }
    else
        return -1;
}

function intersect(a, b) {
    return side(a, b[0]) != side(a, b[1]) && side(b, a[0]) != side(b, a[1]);
}

function triangle_area(first, second, third) {
    let a = distance(first, second);
    let b = distance(second, third);
    let c = distance(first, third);
    let p = (a + b + c) / 2;

    return Math.sqrt(p * (p - a) * (p - b) * (p - c));
}

//
// konec 2 labi
//

let points = [];

for(let i = 0; i < 10; i++) {
    let x = Math.random() * (X - 100) + 50;
    let y = Math.random() * (Y - 100) + 50;
    let r = Math.random() * Math.PI * 2;
    let tempPoint = new Point(x, y, r);
    points.push(tempPoint);
}

let restoreArray = points.slice();

function drawPoints() {
    fill(255, 255, 255);
    for(let i = 0; i < points.length; i++) {
        ellipse(points[i].x, Y - points[i].y, 5)
    }
}


function distance1(A, B, C) {
    let ABx = B.x - A.x;
    let ABy = B.y - A.y;
    let num = ABx * (A.y - C.y) - ABy * (A.x - C.x);
    if(num < 0) {
        num = -num;
    }
    return num;
}

//Массивы с точками для новой фигуры

let convex = [];
let min_x;
let max_x;
let A_X;
let B_X;

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

function start() {
    convex = [];
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

    fill(255, 0, 0);
    ellipse(points[max_x].x, Y - points[max_x].y, 10)
    ellipse(points[min_x].x, Y - points[min_x].y, 10)
    

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

    fill(0, 255, 0);
    for(let i = 0; i < leftSide.length; i++) {
        ellipse(leftSide[i].x, Y - leftSide[i].y, 10)
    }

    fill(0, 0, 255);
    for(let i = 0; i < rightSide.length; i++) {
        ellipse(rightSide[i].x, Y - rightSide[i].y, 10)
    }


    quickhull(A_X, B_X, leftSide);
    quickhull(B_X, A_X, rightSide);

    convex.push(convex[0])
}

function drawLine() {
    for(let i = 0; i < convex.length - 1; i++) {
        line(convex[i].x, Y - convex[i].y, convex[i+1].x, Y - convex[i+1].y);
    }
}

function movePoints() {
    for(let i = 0; i < points.length; i++) {
        points[i].move();
    }
}

function restorePoints() {
    points.length = 0;
    points = restoreArray.slice();
}

function savePoints() {
    restoreArray = points.slice();
}

let max_per = 0;
let first_time = true;

function set_max_per() {
    if(first_time) {
        max_per = perimeter() + 100;
        first_time = false;
    }
}

function checkPerimeter() {
    if(perimeter() > max_per) {
        for(let i = 0; i < points.length; i++) {
            points[i].x_speed = -points[i].x_speed;
            points[i].y_speed = -points[i].y_speed;
        }

    }
}

function setup() {
    createCanvas(X, Y);
}

function draw() {
    background(51);
    stroke(255);
    savePoints();
    start();
    restorePoints();
    set_max_per();
    drawPoints()
    drawLine();
    movePoints();
    checkPerimeter();
}
