'use strict';
var c = document.getElementById('canvas');
var ctx = c.getContext('2d');
c.width = window.innerWidth;
c.height = window.innerHeight;

function rand(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randPoint(width, height) {
    return {
        x: rand(0, width),
        y: rand(0, height)
    }
}

function genRandPointSet(size) { //генерю массив точек ну и добавляю туда крайние точки канвы для красоты
    var points = [];
    points.push({
        x: 0,
        y: 0
    });
    points.push({
        x: 0,
        y: (document.getElementById('canvas').getAttribute('height'))
    });
    points.push({
        x: (document.getElementById('canvas').getAttribute('width')),
        y: 0
    });
    points.push({
        x: (document.getElementById('canvas').getAttribute('width')),
        y: (document.getElementById('canvas').getAttribute('height'))
    })
    for (var i = 0; i < size; ++i) {
        points.push(
            randPoint(
                document.getElementById('canvas').getAttribute('width'),
                document.getElementById('canvas').getAttribute('height')
            )
        )
    }
    return points;
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

function drawPolygon(points) {
    ctx.beginPath();
    points.forEach(function(item, index, arr) {
        ctx.font = "1em Arial";
        ctx.strokeStyle = "#000";
        //ctx.fillText(index,item.x,item.y);
        ctx.lineTo(item.x, item.y);
    });
    ctx.closePath();
    //ctx.stroke();
    ctx.fillStyle = 'rgb('+
	    Math.floor(Math.random()*128 + 128)+','+
	    Math.floor(Math.random()*256)+','+
	    Math.floor(Math.random()*128 + 128)+')';
    ctx.fill();
}

function drawRay(point1, point2) {
    ctx.beginPath();
    ctx.lineTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.closePath();
    ctx.stroke();
}

function vectFromPoints(start, end) { //преобразовать две точки в вектор(вспоминаем Суворова)
    return {
        x: end.x - start.x,
        y: end.y - start.y
    }
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

function det(x1, x2, y1, y2) { //стыдно не понять
    return x1 * y2 - x2 * y1;
}

function sideOfPoint(det) { //это еще из первой лабы сами разберетесь
    if (det > 0)
        return -1;
    else if (det < 0)
        return 1;
    else
        return 0;
}

function lineMinusPointSide(vect, point) { //я люблю клевые имена, на самом деле это обозначает положение точки относительно вектора
    var determ = det(vect[1].x - vect[0].x, point.x - vect[0].x,
        vect[0].y - vect[1].y, vect[0].y - point.y);
    return sideOfPoint(determ);
}

function addPositions(points) {
    var i = 0;
    return points.map(function(item) {
        return {
            pos: i++,
            x: item.x,
            y: item.y
        }
    })
}

function sortByY(points) {
    return points.sort(function(a, b) {
        return b.y - a.y;
    });
}

function sortByEncreasing(arr) { //Функция сортирует по возрастанию, чтоб было легче искать в массиве треугольников 
    return arr.sort(function(a, b) {
        return a > b;
    })
}

function findNearestPoint(points, point1, point2) { //поиск ближайшей точки к вектору (point1, point2) из массива points
    var maxAngle = -Infinity;
    var maxPos = -1;
    points.forEach(function(item, i) {
        var angle = angleBetweenVectors(vectFromPoints(item, point1), vectFromPoints(item, point2));
        if (angle > maxAngle) {
            maxAngle = angle;
            maxPos = i;
        }
    })
    return maxPos;
}

function startTriangulation(points) { //первый шаг триагуляции
    var maxPos = findNearestPoint(points, points[0], points[1]); //находим ближайшую точку к самым нижним
    tri.push(sortByEncreasing([points[0].pos, points[1].pos, points[maxPos].pos])); //добавить точку в массив треугольников
    var line = [{
            x: points[0].x,
            y: points[0].y
        },
        {
            x: points[1].x,
            y: points[1].y
        }
    ] //эта большая конструкция делает из двух точек линию(потому что под это функция заточена)
    if (lineMinusPointSide(line, points[maxPos]) == 1) { //определяем положение точки относительно прямой(имя функции не отображет сути, но что поделать я это давно писал)
        //если правее то так
        trinagulation(points, points[1], points[maxPos]);
        trinagulation(points, points[maxPos], points[0]);
    } else {
        //соответсвенно, если левее то так
        trinagulation(points, points[0], points[maxPos]);
        trinagulation(points, points[maxPos], points[1]);
    }
}

function triangleExist(arr) { //проверка на существование треугольника в массиве треугольников
    var flag = false;
    tri.forEach(function(item) {
        if (item[0] == arr[0] && item[1] == arr[1] && item[2] == arr[2]) {
            flag = true;
            return;
        }
    })
    return flag;
}

function trinagulation(points, point1, point2) {
    var higher = []; //точки которые лежат выше(по факту левее) прямой(по факту вектора) (point1, point2)
    var line = [ //c этой конструкцией вы уже знакомы
        {
            x: point1.x,
            y: point1.y
        },
        {
            x: point2.x,
            y: point2.y
        }
    ]
    points.forEach(function(item, i, arr) { //ну и ищем те, что выше(левее) и добавляем их в массив 
        if (lineMinusPointSide(line, item) == -1) {
            higher.push(item);
        }
    });

    if (higher.length) { //если нашлись точки, то продолжаем рекурсию ХАХА НА JAVA ТАК НЕЛЬЗЯ ДЕЛАТЬ!!!!
        var point = findNearestPoint(higher, point1, point2); //ищем ближайшую точку
        let triangle = sortByEncreasing([point1.pos, point2.pos, higher[point].pos]); //ну делаем из нее треугольник
        //ВСПОМОГАТЕЛЬНЫЙ КОМЕНТАРИЙ В СТРОКЕ 136
        if (!triangleExist(triangle)) { //если такого треугольника нет, то продолжаем
            tri.push(triangle); //добавляем в массив треугольников
            //И ПОГНАЛИ ДАЛЬШЕ
            trinagulation(points, point1, higher[point]);
            trinagulation(points, higher[point], point2);
        }
    }

}

var tri = []; //глабальная пирименная, все в лучших традициях
var points = genRandPointSet(2000); //генерим 10 точек
points = sortByY(points); //сортируем их по оси Y
points = addPositions(points); //добавляем каждой точке ее позицию(так намного удобнее лично мне)
//drawPoints(points);
startTriangulation(points); //поехали


setInterval(function() {
	tri.forEach(function(item) {
	    var pol = item.map(function(item) {
	        return points[item];
	    })
	    drawPolygon(pol)
	})
}, 1000/60)