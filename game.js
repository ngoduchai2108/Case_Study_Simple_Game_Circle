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
let rects = [];
let balls = [];
let ballenemy = [];
let gun = new Gun();
let count = 0;
let hp = 2000;
let point = 101;
let stop = false;

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

function moveShots() {
    for (let i = 0; i < shots.length; i++) {
        shots[i].x += shots[i].speedX * shots[i].angle[0];
        shots[i].y -= shots[i].speedY * shots[i].angle[1];
        if (shots[i].x < shots[i].radius || shots[i].x > VERY_RIGHT - shots[i].radius) {
            shots[i].speedX = -shots[i].speedX;
        }
        // if (shots[i].y > VERY_BUTTON - shots[i].radius) {
        //     shots[i].speedY = -shots[i].speedY;
        // }
        if (shots[i].y < 0 || shots[i].y > VERY_BUTTON - shots[i].radius) {
            shots.splice(shots.indexOf(shots[i]), 1);
        }
    }
}

function moveEnemy() {
    //move ball
    for (let i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].speedX;
        balls[i].y += balls[i].speedY;
        let check_ball = true;
        let check_rect = true;
        let check = checkTypeBall(balls[i],check_ball,check_rect);
        if (check[2] === false ){
            balls[i].speedX = -balls[i].speedX;
        }
        // if (check[0] === false && check[1] === true){
        //     balls[i].speedX = -balls[i].speedX;
        // }

        if (balls[i].y > VERY_BUTTON - 20) {
            balls.splice(balls.indexOf(balls[i]), 1);
            hp--;
        }
        // khoang cach ball with gun
        let dx = Math.abs(balls[i].x - (VERY_RIGHT / 2));
        let dy = Math.abs(balls[i].y - (VERY_BUTTON - 60));
        if (dx <= (80 + balls[i].radius) && dy <= (80 + balls[i].radius)){
            balls.splice(balls.indexOf(balls[i]), 1);
            hp = hp -2;
        }

    }
    // move ball enemy
    for (let i =0 ; i< ballenemy.length; i++){
        ballenemy[i].x+=ballenemy[i].speedX;
        ballenemy[i].y+=ballenemy[i].speedY;
        if (ballenemy[i].x < ballenemy[i].radius || ballenemy[i].x > (VERY_RIGHT - ballenemy[i].radius)){
            ballenemy[i].speedX = -ballenemy[i].speedX;
        }
        if (ballenemy[i].y > VERY_BUTTON - ballenemy[i].radius) {
            ballenemy[i].speedY = -ballenemy[i].speedY;
            hp--;
        }
        if (ballenemy[i].y < ballenemy[i].radius) {
            ballenemy[i].speedY = -ballenemy[i].speedY;
        }
        // khoang cach ball enemy with gun
        let dx = Math.abs(ballenemy[i].x - (VERY_RIGHT / 2));
        let dy = Math.abs(ballenemy[i].y - (VERY_BUTTON - 60));
        if (dx <= (80 + ballenemy[i].radius) && dy <= (80 + ballenemy[i].radius)){
            ballenemy.splice(ballenemy.indexOf(ballenemy[i]), 1);
            hp = hp -4;
        }
    }
    //move rect
    for (let i = 0; i < rects.length; i++) {
        rects[i].y += rects[i].speed;
        if (rects[i].y > VERY_BUTTON - 20) {
            rects.splice(rects.indexOf(rects[i]), 1);
            hp--;
        }
        // khoang cach rect with gun
        let dx = Math.abs(rects[i].x - (VERY_RIGHT / 2));
        let dy = Math.abs(rects[i].y - (VERY_BUTTON - 60));
        if ( rects[i].x <= (VERY_RIGHT/2) && dx <= (80 + rects[i].length) && dy <= (80 + rects[i].width)){
            rects.splice(rects.indexOf(rects[i]), 1);
            hp = hp -2;
        }
        if ( rects[i].x >= (VERY_RIGHT/2) && dx <= 80 && dy <= (80 + rects[i].width)){
            rects.splice(rects.indexOf(rects[i]), 1);
            hp = hp -2;
        }
    }
}

function moveAll() {
    moveShots();
    moveEnemy();
}

function drawGun() {
    pen.fillStyle = "#aacc44";
    pen.strokeStyle = "#aacc44";
    pen.beginPath();
    pen.lineWidth = "1";
    pen.arc((VERY_RIGHT / 2), VERY_BUTTON - 60, 80, 0, 2 * Math.PI);
    pen.stroke();

    pen.beginPath();
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
    //draw ball enemy
    for (let i = 0; i<ballenemy.length; i++){
        pen.beginPath();
        pen.arc(ballenemy[i].x, ballenemy[i].y, ballenemy[i].radius, 0, 2 * Math.PI);
        pen.fillStyle = ballenemy[i].color;
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

function drawAll() {
    pen.clearRect(0, 0, canvas.width, canvas.height);
    pen.fillStyle = "#dddddd";
    pen.fillRect(0, 0, canvas.width, canvas.height);
    drawGun();
    drawEnemy();
    drawShots();
}

function checkTypeBall(ball,check_ball,check_rect) {
    check_ball = true;
    check_rect = true;
    let index_ball = 0;
    let index_rect = 0;
    for (let i = 0; i < balls.length; i++) {
        let dx = Math.abs(ball.x - balls[i].x);
        let dy = Math.abs(ball.y - balls[i].y);
        if (dx <= (ball.radius + balls[i].radius) && dy <= (ball.radius + balls[i].radius)) {
            check_ball = false;
            index_ball = i;
            break;
        }
    }
    for (let i = 0; i < rects.length; i++) {
        // if left_right >=0 then rect at left of ball, else rect at right of ball
        let left_right = ball.x - rects[i].x;
        // if above_under >=0 then rect at above of ball, else rect at under of ball
        let above_under = ball.y - rects[i].y;
        let dx = Math.abs(ball.x - rects[i].x);
        let dy = Math.abs(ball.y - rects[i].y);
        if (left_right >=0 && above_under >= 0 && dx <= (rects[i].length + ball.radius) && dy <= (rects[i].width + ball.radius)) {
            check_rect = false;
            index_rect = i;
            break;
        }
        if (left_right >=0 && above_under <= 0 && dx <= (rects[i].length + ball.radius) && dy <= rects[i].width ) {
            check_rect = false;
            index_rect = i;
            break;
        }
        if (left_right <=0 && above_under >= 0 && dx <= ball.radius && dy <= (rects[i].width + ball.radius)) {
            check_rect = false;
            index_rect = i;
            break;
        }
        if (left_right <=0 && above_under <= 0 && dx <= ball.radius && dy <= ball.radius) {
            check_rect = false;
            index_rect = i;
            break;
        }
    }
    return [check_ball,index_ball,check_rect,index_rect];
}

function checkTypeRect(rect,check_ball,check_rect) {
    check_ball = true;
    check_rect = true;
    for (let i = 0; i < rects.length; i++) {
        if (Math.abs(rects[i].x - rect.x) <= rects[i].length && (rects[i].y - rect.y) <= rects[i].width) {
            check_rect = false;
            break;
        }
    }
    for (let i = 0; i < balls.length; i++) {
        // if left_right >=0 then rect at left of ball, else rect at right of ball
        let left_right = balls[i].x - rect.x;
        // if above_under >=0 then rect at above of ball, else rect at under of ball
        let above_under = balls[i].y - rect.y;
        let dx = Math.abs(balls[i].x - rect.x);
        let dy = Math.abs(balls[i].y - rect.y);
        if (left_right >=0 && above_under >= 0 && dx <= (rect.length + balls[i].radius) && dy <= (rect.width + balls[i].radius)) {
            check_ball = false;
            break;
        }
        if (left_right >=0 && above_under <= 0 && dx <= (rect.length + balls[i].radius) && dy <= balls[i].radius) {
            check_ball = false;
            break;
        }
        if (left_right <=0 && above_under >= 0 && dx <= balls[i].radius && dy <= (rect.width + balls[i].radius)) {
            check_ball = false;
            break;
        }
        if (left_right <=0 && above_under <= 0 && dx <= balls[i].radius && dy <= balls[i].radius) {
            check_ball = false;
            break;
        }
    }
    return [check_ball,check_rect];
}

function selectEnemy() {
    //binh 1oai 1
    if (count % 23 === 0 && stop === false && count % 17 !== 0) {
        let ball = new Ball();
        let check_ball = true ;
        let check_rect = true;
        // let check_ballEnemy = true;
        let check = checkTypeBall(ball,check_ball,check_rect);
        console.log(check);
        if (check[0] === true && check[2] === true) {
            balls.push(ball);
        }
    }
    // tuong loai 1
    if (count % 133 === 0 && stop === false && count % 17 !== 0) {
        let ball = new Ball();
        let check_ball = true ;
        let check_rect = true;
        // let check_ballEnemy = true;
        ball.radius = 20;
        ball.hp_ball = 3;
        let check = checkTypeBall(ball,check_ball,check_rect);
        if ( check[0] === true && check[2] === true) {
            balls.push(ball);
        }
    }
    //binh loai 2
    if (count % 17 === 0 && stop === false && count % 23 !== 0) {
        let rect = new Rect();
        let check_rect = true ;
        let check_ball = true;
        let check = checkTypeRect(rect,check_ball,check_rect);
        if (check[0] === true && check[1] === true) {
            rects.push(rect);
        }
    }
    //tuong loai 2
    if (count % 177 === 0 && stop === false && count % 23 !== 0) {
        let rect = new Rect();
        let check_rect = true ;
        let check_ball = true;
        rect.length = 30;
        rect.width = 30;
        rect.hp_rect = 3;
        let check = checkTypeRect(rect,check_ball,check_rect);
        if (check[0] === true && check[1] === true) {
            rects.push(rect);
        }
    }
    //new enemy
    if (count % 200 === 0){
        let ball = new Ball();
        ball.x = Math.floor(Math.random()*(VERY_RIGHT - 60))+30;
        ball.y = 50 ;
        ball.radius = 30;
        let speed = [-5,5];
        ball.speedX = speed[Math.floor(Math.random()*2)];
        ball.speedY = speed[Math.floor(Math.random()*2)];
        ball.color = getRandomColor();
        ball.hp_ball = 2;
        ballenemy.push(ball);
    }
}
function loop() {
    count++;
    selectEnemy();
    moveAll();
    drawAll();
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
        ballenemy = [];
        document.getElementById('result').innerHTML = '<h1>YOU WIN !!!</h1>'
    }
    //Sau point = 250 thi speed tang len
    if (point % 50 === 0) {
        for (let i = 0; i < balls.length; i++) {
            balls[i].speedX = balls[i].speedX * 21 / 20;
            balls[i].speedY = balls[i].speedY * 21 / 20;
        }
        for (let i = 0; i < rects.length; i++) {
            rects[i].speed = rects[i].speed * 21 / 20;
        }
    }
    //shot gun ball and rect

    for (let i = 0; i< shots.length ; i++){
        let check_ball = true;
        let check_rect = true;
        let check_ballEnemy = true;
        let check = checkTypeBall(shots[i],check_ball,check_rect,check_ballEnemy);
        if (check[0] === false){
            balls[check[1]].hp_ball--;
            if (balls[check[1]].hp_ball === 0){
                shots.splice(shots.indexOf(shots[i]),1);
                balls.splice(balls.indexOf(balls[check[1]]),1);
                point++;
            }
            else {
                shots.splice(shots.indexOf(shots[i]),1);
                point++;
            }
            break;
        }
        if (check[2] === false){
            rects[check[3]].hp_rect--;
            if (rects[check[3]].hp_rect === 0){
                shots.splice(shots.indexOf(shots[i]),1);
                rects.splice(rects.indexOf(rects[check[3]]),1);
                point++;
            }else {
                shots.splice(shots.indexOf(shots[i]),1);
                point++;
            }
            break;
        }
        //shot gun ball enemy
        for(let j=0; j<ballenemy.length; j++){
            let dx = Math.abs(shots[i].x - ballenemy[j].x);
            let dy = Math.abs(shots[i].y - ballenemy[j].y);
            if (dx <= (shots[i].radius + ballenemy[j].radius) && dy <= (shots[i].radius + ballenemy[j].radius)) {
                ballenemy[j].hp_ball--;
                if (ballenemy[j].hp_ball === 0){
                    shots.splice(shots.indexOf(shots[i]),1);
                    ballenemy.splice(ballenemy.indexOf(ballenemy[j]),1);
                    point++;
                }else {
                    shots.splice(shots.indexOf(shots[i]),1);
                    point++;
                }
                break;
            }
            break;
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