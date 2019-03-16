const VERY_RIGHT = 800;
const VERY_BUTTON = 600;

document.getElementById('title').innerHTML = '<h3>GAME MOVE BALLS SIMPLE</h3>';
document.getElementById('hp').innerHTML = 'HP : 20';
document.getElementById('point').innerHTML = 'Point : 0';

let canvas = document.getElementById('canvas');
let pen = canvas.getContext('2d');
let mouseDown = false;
let gloop;
let shots = [];
let gun = new Gun();
let balls = [];
let rects = [];
let count = 0;
let hp = 20;
let point = 101;
let stop = false;

//Cach 1:Lay mau random
// function getRandomColor() {
//     let color = ["AABBCC", "11CCFF", "22DDCC", "AAFF22"];
//     return "#" + color[Math.floor(Math.random() * 4)];
//
// }
//Cach 2: Lay mau random
function getRandomHex() {
    return Math.floor(Math.random() * 255)
}

function getRandomColor() {
    let red = getRandomHex();
    let green = getRandomHex();
    let blue = getRandomHex();
    return "rgb(" + red + ',' + green + ',' + blue + ')';
}

function getAngle(coordx, coordy) {
    let angleX, angleY, neg = false;
    if (coordx === ((VERY_RIGHT / 2))) {
        if (coordy <= (VERY_BUTTON - 60)) {
            gun.direction = degToRad(90);
        } else {
            gun.direction = degToRad(270);
        }
    } else {
        gun.direction = Math.atan((VERY_BUTTON - 60 - coordy) / (coordx - (VERY_RIGHT / 2)));
        if (coordx < (VERY_RIGHT / 2)) {
            neg = true;
        }
    }
    angleX = Math.cos(gun.direction);
    angleY = Math.sin(gun.direction);
    if (neg) {
        angleX = -angleX;
        angleY = -angleY;
        neg = false;
    }
    return [angleX, angleY];
}

function degToRad(angle) {
    return angle * Math.PI / 180;
}

function moveAll() {
    //With shots
    for (let i = 0; i < shots.length; i++) {
        if (shots[i].x < shots[i].radius || shots[i].x > VERY_RIGHT - shots[i].radius) {
            shots[i].speedX = -shots[i].speedX;
        }
        // if (shots[i].y > VERY_BUTTON - shots[i].radius) {
        //     shots[i].speedY = -shots[i].speedY;
        // }
        if (shots[i].y < 0 || shots[i].y > VERY_BUTTON - shots[i].radius) {
            shots.splice(shots.indexOf(shots[i]), 1);
        }
        shots[i].x += shots[i].speedX * shots[i].angle[0];
        shots[i].y -= shots[i].speedY * shots[i].angle[1];
    }
    //With ball
    for (let i = 0; i < balls.length; i++) {
        balls[i].y += balls[i].speed;
        if (balls[i].y > VERY_BUTTON - 20) {
            balls.splice(balls.indexOf(balls[i]), 1);
            hp--;
        }
    }
    //With rect
    for (let i = 0; i < rects.length; i++) {
        rects[i].y += rects[i].speed;
        if (rects[i].y > VERY_BUTTON - 20) {
            rects.splice(rects.indexOf(rects[i]), 1);
            hp--;
        }
    }
}

function drawGun() {
    pen.fillStyle = "#aacc44";
    pen.strokeStyle = "#aacc44";
    pen.rect((VERY_RIGHT / 2) - 30, VERY_BUTTON - 60, 60, 60);
    pen.fill();

    pen.beginPath();
    pen.arc((VERY_RIGHT / 2), VERY_BUTTON - 60, 20, Math.PI, 2 * Math.PI);
    pen.fill();

    pen.beginPath();
    pen.lineWidth = "10";
    pen.moveTo((VERY_RIGHT / 2), VERY_BUTTON - 60);
    let valueX, valueY, angle;
    angle = getAngle(gun.x, gun.y);
    valueX = 50 * angle[0];
    valueY = 50 * angle[1];
    pen.lineTo(valueX + (VERY_RIGHT / 2), VERY_BUTTON - 60 - valueY);
    pen.stroke();
}

function drawEnemy() {
    //drawBalls
    for (let i = 0; i < balls.length; i++) {
        pen.beginPath();
        pen.arc(balls[i].x, balls[i].y, balls[i].radius, 0, 2 * Math.PI);
        pen.fillStyle = balls[i].color;
        pen.fill();
    }
    //drawRect
    for (let i = 0; i < rects.length; i++) {
        pen.beginPath();
        pen.rect(rects[i].x, rects[i].y, rects[i].length, rects[i].width);
        pen.fillStyle = rects[i].color;
        pen.fill();
    }
}

function drawShots() {
    for (let i = 0; i < shots.length; i++) {
        pen.fillStyle = "#aacc44";
        pen.beginPath();
        pen.arc(shots[i].x, shots[i].y, shots[i].radius, 0, 2 * Math.PI);
        pen.fill();
    }
}

function draw() {
    pen.clearRect(0, 0, canvas.width, canvas.height);
    pen.fillStyle = "#dddddd";
    pen.fillRect(0, 0, canvas.width, canvas.height);
    drawGun();
    drawEnemy();
    drawShots();
}

function loop() {
    //binh 1oai 1
    if (count % 23 === 0 && stop === false && count % 17 !== 0) {
        let ball = new Ball();
        let check_ball = true;
        for (let i = 0; i < balls.length; i++) {
            if (Math.sqrt(Math.pow((ball.x - balls[i].x), 2) + Math.pow((ball.y - balls[i].y), 2)) < ball.radius + balls[i].radius) {
                check_ball = false;
                break;
            }
        }
        for (let i = 0; i < rects.length; i++) {
            if ((ball.x >= rects[i].x && ball.radius >= rects[i].y && (ball.x - rects[i].x) <= (ball.radius + rects[i].length)) || (ball.x <= rects[i].x && rects[i].y <= ball.radius && (rects[i].x - ball.x) <= rects[i].length)) {
                check_ball = false;
                break;
            }
        }
        if (check_ball === true) {
            balls.push(ball);
        }
    }
    // tuong loai 1
    if (count % 133 === 0 && stop === false && count % 17 !== 0) {
        let ball = new Ball();
        ball.radius = 20;
        ball.hp_ball = 3;
        let check_ball = true;
        for (let i = 0; i < balls.length; i++) {
            if (Math.sqrt(Math.pow((ball.x - balls[i].x), 2) + Math.pow((ball.y - balls[i].y), 2)) < ball.radius + balls[i].radius) {
                check_ball = false;
                break;
            }
        }
        for (let i = 0; i < rects.length; i++) {
            if ((ball.x >= rects[i].x && ball.radius >= rects[i].y && (ball.x - rects[i].x) <= (ball.radius + rects[i].length)) || (ball.x <= rects[i].x && rects[i].y <= ball.radius && (rects[i].x - ball.x) <= rects[i].length)) {
                check_ball = false;
                break;
            }
        }
        if (check_ball === true) {
            balls.push(ball);
        }
    }
    //binh loai 2
    if (count % 17 === 0 && stop === false && count % 23 !== 0) {
        let rect = new Rect();
        let check_rect = true;
        for (let i = 0; i < rects.length; i++) {
            if (Math.abs(rects[i].x - rect.x) <= rects[i].length && (rects[i].y - rect.y) <= rects[i].width) {
                check_rect = false;
                break;
            }
        }
        for (let i = 0; i < balls.length; i++) {
            if ((rect.x >= balls[i].x && (rect.width + balls[i].radius) >= balls[i].y && (rect.x - balls[i].x) <= balls[i].radius) || (rect.x <= balls[i].x && balls[i].y <= (rect.width + balls[i].radius) && (balls[i].x - rect.x) <= (balls[i].radius + rect.length))) {
                check_rect = false;
                break;
            }
        }
        if (check_rect === true) {
            rects.push(rect);
        }
    }
    //tuong loai 2
    if (count % 177 === 0 && stop === false && count % 23 !== 0) {
        let rect = new Rect();
        rect.length = 30;
        rect.width = 30;
        rect.hp_rect = 3;
        let check_rect = true;
        for (let i = 0; i < rects.length; i++) {
            if (Math.abs(rects[i].x - rect.x) <= rects[i].length && (rects[i].y - rect.y) <= rects[i].width) {
                check_rect = false;
                break;
            }
        }
        for (let i = 0; i < balls.length; i++) {
            if ((rect.x >= balls[i].x && (rect.width + balls[i].radius) >= balls[i].y && (rect.x - balls[i].x) <= balls[i].radius) || (rect.x <= balls[i].x && balls[i].y <= (rect.width + balls[i].radius) && (balls[i].x - rect.x) <= (balls[i].radius + rect.length))) {
                check_rect = false;
                break;
            }
        }
        if (check_rect === true) {
            rects.push(rect);
        }
    }

    count++;
    moveAll();
    draw();
    document.getElementById('hp').innerHTML = 'HP : ' + hp;
    document.getElementById('point').innerHTML = 'Point : ' + point;
    //Dieu kien Game Over
    if (hp <= 0) {
        stop = true;
        balls = [];
        rects = [];
        shots = [];
        document.getElementById('result').innerHTML = '<h1>GAME OVER !!!</h1>'
    }
    //Dieu kien chien thang
    if (point === 500) {
        stop = true;
        balls = [];
        rects = [];
        shots = [];
        document.getElementById('result').innerHTML = '<h1>YOU WIN !!!</h1>'
    }
    //Sau point = 250 thi speed tang len
    if (point % 50 === 0) {
        for (let i = 0; i < balls.length; i++) {
            balls[i].speed = balls[i].speed * 21 / 20;
        }
        for (let i = 0; i < rects.length; i++) {
            rects[i].speed = rects[i].speed * 21 / 20;
        }
    }
    //shot cham vao hinh tron
    for (let j = 0; j < shots.length; j++) {
        for (let i = 0; i < balls.length; i++) {
            //Cach 1:
            if (balls[i].x < shots[j].x) {
                if ((shots[j].x - balls[i].x) <= (shots[j].radius + balls[i].radius)) {
                    if (shots[j].y >= balls[i].y) {
                        if ((shots[j].y - balls[i].y) <= (shots[j].radius + balls[i].radius)) {
                            balls[i].hp_ball--;
                            if (balls[i].hp_ball === 0) {
                                shots.splice(shots.indexOf(shots[j]), 1);
                                balls.splice(balls.indexOf(balls[i]), 1);
                                point++;
                            } else {
                                // shots[j].speedY = -shots[j].speedY;
                                // shots[i].x += shots[i].speedX * shots[i].angle[0];
                                // shots[i].y -= shots[i].speedY * shots[i].angle[1];
                                shots.splice(shots.indexOf(shots[j]), 1);
                                point++;
                            }
                        } else {

                        }
                    } else {
                        if ((balls[i].y - shots[j].y) <= (shots[j].radius + balls[i].radius)) {
                            balls[i].hp_ball--;
                            if (balls[i].hp_ball === 0) {
                                shots.splice(shots.indexOf(shots[j]), 1);
                                balls.splice(balls.indexOf(balls[i]), 1);
                                point++;
                            } else {
                                // shots[j].speedY = -shots[j].speedY;
                                // shots[j].x += shots[j].speedX * shots[j].angle[0];
                                // shots[j].y -= shots[j].speedY * shots[j].angle[1];
                                shots.splice(shots.indexOf(shots[j]), 1);
                                point++;
                            }
                        } else {

                        }
                    }
                } else {

                }
            } else {
                if ((balls[i].x - shots[j].x) <= (shots[j].radius + balls[i].radius)) {
                    if (shots[j].y >= balls[i].y) {
                        if ((shots[j].y - balls[i].y) <= (shots[j].radius + balls[i].radius)) {
                            balls[i].hp_ball--;
                            if (balls[i].hp_ball === 0) {
                                shots.splice(shots.indexOf(shots[j]), 1);
                                balls.splice(balls.indexOf(balls[i]), 1);
                                point++;
                            } else {
                                // shots[j].speedY = -shots[j].speedY;
                                // shots[j].x += shots[j].speedX * shots[j].angle[0];
                                // shots[j].y -= shots[j].speedY * shots[j].angle[1];
                                shots.splice(shots.indexOf(shots[j]), 1);
                                point++;
                            }
                        } else {

                        }
                    } else {
                        if ((balls[i].y - shots[j].y) <= (shots[j].radius + balls[i].radius)) {
                            balls[i].hp_ball--;
                            if (balls[i].hp_ball === 0) {
                                shots.splice(shots.indexOf(shots[j]), 1);
                                balls.splice(balls.indexOf(balls[i]), 1);
                                point++;
                            } else {
                                // shots[j].speedY = -shots[j].speedY;
                                // shots[i].x += shots[i].speedX * shots[i].angle[0];
                                // shots[i].y -= shots[i].speedY * shots[i].angle[1];
                                shots.splice(shots.indexOf(shots[j]), 1);
                                point++;
                            }
                        } else {

                        }
                    }
                } else {

                }
            }
            //Cach2:
            // if (Math.sqrt(Math.pow((balls[i].x - shots[j].x), 2) + Math.pow((balls[i].y - shots[j].y), 2)) < shots[j].radius + balls[i].radius) {
            //     balls[i].hp_ball--;
            //     if (balls[i].hp_ball === 0){
            //         shots.splice(shots.indexOf(shots[j]), 1);
            //         balls.splice(balls.indexOf(balls[i]), 1);
            //         point++;
            //     }
            //     else {
            //         // shots[j].speedY = -shots[j].speedY;
            //         // shots[i].x += shots[i].speedX * shots[i].angle[0];
            //         // shots[i].y -= shots[i].speedY * shots[i].angle[1];
            //         shots.splice(shots.indexOf(shots[j]), 1);
            //         point++;
            //     }
            // }
        }
    }
    //shot cham vao hinh vuong
    for (let j = 0; j < shots.length; j++) {
        for (let i = 0; i < rects.length; i++) {
            //Cach 1:
            // if (rects[i].x <= shots[j].x){
            //     if ((shots[j].x - rects[i].x) <= (shots[j].radius + rects[i].length)){
            //         //Cach 1:
            //             if (Math.abs((shots[j].y - rects[i].y)) <= (shots[j].radius + rects[i].width)){
            //                 rects[i].hp_rect--;
            //                 if (rects[i].hp_rect === 0){
            //                     shots.splice(shots.indexOf(shots[j]), 1);
            //                     rects.splice(rects.indexOf(rects[i]), 1);
            //                     point++;
            //                 }
            //                 else {
            //                     // shots[j].speedY = -shots[j].speedY;
            //                     // shots[j].x += shots[j].speedX * shots[j].angle[0];
            //                     // shots[j].y -= shots[j].speedY * shots[j].angle[1];
            //                     shots.splice(shots.indexOf(shots[j]), 1);
            //                     point++;
            //                 }
            //             }else {
            //              continue;
            //             }
            //         //Cach 2:
            //         // if (rects[i].y <= shots[j].y){
            //         //     if ((shots[j].y - rects[i].y) <= (shots[j].radius + rects[i].width)){
            //         //         rects[i].hp_rect--;
            //         //         if (rects[i].hp_rect === 0){
            //         //             shots.splice(shots.indexOf(shots[j]), 1);
            //         //             rects.splice(rects.indexOf(rects[i]), 1);
            //         //             point++;
            //         //         }
            //         //         else {
            //         //             // shots[j].speedY = -shots[j].speedY;
            //         //             // shots[j].x += shots[j].speedX * shots[j].angle[0];
            //         //             // shots[j].y -= shots[j].speedY * shots[j].angle[1];
            //         //             shots.splice(shots.indexOf(shots[j]), 1);
            //         //             point++;
            //         //         }
            //         //     }else {
            //         //      continue;
            //         //     }
            //         // }else {
            //         //     if ((rects[i].y - shots[j].y) <= (shots[j].radius + rects[i].width)){
            //         //         rects[i].hp_rect--;
            //         //         if (rects[i].hp_rect === 0){
            //         //             shots.splice(shots.indexOf(shots[j]), 1);
            //         //             rects.splice(rects.indexOf(rects[i]), 1);
            //         //             point++;
            //         //         }
            //         //         else {
            //         //             // shots[j].speedY = -shots[j].speedY;
            //         //             // shots[j].x += shots[j].speedX * shots[j].angle[0];
            //         //             // shots[j].y -= shots[j].speedY * shots[j].angle[1];
            //         //             shots.splice(shots.indexOf(shots[j]), 1);
            //         //             point++;
            //         //         }
            //         //     }else {
            //         //         continue;
            //         //     }
            //         // }
            //     }else {
            //         continue;
            //     }
            // }else {
            //     if ((rects[i].x - shots[j].x) <= shots[j].radius){
            //         if (rects[i].y <= shots[j].y){
            //             if ((shots[j].y - rects[i].y) <= (rects[i].width + shots[j].radius)){
            //                 rects[i].hp_rect--;
            //                 if (rects[i].hp_rect === 0){
            //                     shots.splice(shots.indexOf(shots[j]), 1);
            //                     rects.splice(rects.indexOf(rects[i]), 1);
            //                     point++;
            //                 }
            //                 else {
            //                     // shots[j].speedY = -shots[j].speedY;
            //                     // shots[i].x += shots[i].speedX * shots[i].angle[0];
            //                     // shots[i].y -= shots[i].speedY * shots[i].angle[1];
            //                     shots.splice(shots.indexOf(shots[j]), 1);
            //                     point++;
            //                 }
            //             }else {
            //                 continue;
            //             }
            //         }else {
            //             if ((rects[i].y - shots[j].y) <= shots[j].radius){
            //                 rects[i].hp_rect--;
            //                 if (rects[i].hp_rect === 0){
            //                     shots.splice(shots.indexOf(shots[j]), 1);
            //                     rects.splice(rects.indexOf(rects[i]), 1);
            //                     point++;
            //                 }
            //                 else {
            //                     // shots[j].speedY = -shots[j].speedY;
            //                     // shots[i].x += shots[i].speedX * shots[i].angle[0];
            //                     // shots[i].y -= shots[i].speedY * shots[i].angle[1];
            //                     shots.splice(shots.indexOf(shots[j]), 1);
            //                     point++;
            //                 }
            //             }else {
            //                 continue;
            //             }
            //         }
            //     }else {
            //         continue;
            //     }
            // }
            //Cach 2:
            if (shots[j].x >= rects[i].x && shots[j].x <= (rects[i].x + rects[i].length) && (shots[j].y - rects[i].y) <= rects[i].width) {
                rects[i].hp_rect--;
                if (rects[i].hp_rect === 0) {
                    shots.splice(shots.indexOf(shots[j]), 1);
                    rects.splice(rects.indexOf(rects[i]), 1);
                    point++;
                } else {
                    // shots[j].speedY = -shots[j].speedY;
                    // shots[j].x += shots[j].speedX * shots[j].angle[0];
                    // shots[j].y -= shots[j].speedY * shots[j].angle[1];
                    shots.splice(shots.indexOf(shots[j]), 1);
                    point++;
                }
            }
        }
    }
    gloop = setTimeout(loop, 25);
}

let getMousePos = function (canvas, e) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
};
canvas.addEventListener('mousemove', function (e) {
    let mousePos = getMousePos(canvas, e);
    gun.x = mousePos.x;
    gun.y = mousePos.y;
});
canvas.addEventListener('mousedown', function (e) {
    let mousePos = getMousePos(canvas, e);
    let shotX = mousePos.x;
    let shotY = mousePos.y;
    shots.push(new Shots(shotX, shotY));
    mouseDown = true;
});
canvas.addEventListener('mouseup', function (e) {
    mouseDown = false;
});

loop();