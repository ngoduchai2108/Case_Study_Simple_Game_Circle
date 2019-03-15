const VERY_RIGHT = 800;
const VERY_BUTTON = 600;

document.getElementById('title').innerHTML = '<h3>GAME MOVE BALLS SIMPLE</h3>';
document.getElementById('hp').innerHTML = 'HP : 20';
document.getElementById('point').innerHTML = 'Point : 0';

let canvas = document.getElementById('canvas');
let pen = canvas.getContext('2d');
let x = 400;
let y = 0;
let direction = 0;
let mouseDown = false;
let gloop;
let shots = [];
let balls = [];
let rects = [];
let count = 0;
let hp = 20;
let point = 100;
let stop = false;

let BackGround = function () {
    this.drawGun = function () {
        pen.fillStyle = "#aacc44";
        pen.strokeStyle = "#aacc44";
        pen.rect((VERY_RIGHT / 2)-20, VERY_BUTTON - 60, 40, 60);
        pen.fill();

        pen.beginPath();
        pen.arc((VERY_RIGHT / 2), VERY_BUTTON - 60, 20, Math.PI, 2 * Math.PI);
        pen.fill();

        pen.beginPath();
        pen.lineWidth = "10";
        pen.moveTo((VERY_RIGHT / 2), VERY_BUTTON - 60);
        let valueX, valueY, angle;
        angle = getAngle(x, y);
        valueX = 50 * angle[0];
        valueY = 50 * angle[1];
        pen.lineTo(valueX + (VERY_RIGHT / 2) , VERY_BUTTON - 60 - valueY);
        pen.stroke();
    }
};
let background = new BackGround();

let Ball = function () {
    this.x = Math.floor(Math.random() * (VERY_RIGHT - 60)) + 30;
    this.y = 0;
    this.radius = 20;
    this.speed = 1/2;
    this.color = getRandomColor();
    this.drawCircle = function () {
        pen.beginPath();
        pen.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        pen.fillStyle = this.color;
        pen.fill();
    };
    this.move = function () {
        this.y += this.speed;
        if (this.y > VERY_BUTTON - 20) {
            balls.splice(balls.indexOf(this), 1);
            hp--;
        }
    };
};

let Rect = function(){
  this.x = Math.floor(Math.random() * (VERY_RIGHT -60))+30;
  this.y = 0;
  this.length = 20;
  this.width = 20;
  this.speed = 1/2;
  this.color = getRandomColor();
  this.drawRect = function () {
      pen.beginPath();
      pen.rect(this.x, this.y, this.length, this.width);
      pen.fillStyle = this.color;
      pen.fill();
  };
  this.move = function () {
      this.y += this.speed;
      if (this.y >VERY_BUTTON -20){
          rects.splice(rects.indexOf(this),1);
          hp--;
      }
  };
};

let Shots = function (shotX, shotY) {
    this.x = (VERY_RIGHT / 2) ;
    this.y = VERY_BUTTON - 60;
    this.radius = 5;
    this.speedX = 8;
    this.speedY = 8;
    this.angle = getAngle(shotX, shotY);
    this.drawShots = function () {
        pen.fillStyle = "#aacc44";
        pen.beginPath();
        pen.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        pen.fill();
    };
    this.move = function () {
        if (this.x < this.radius || this.x > VERY_RIGHT - this.radius) {
            this.speedX = -this.speedX;
        }
        if (this.y > VERY_BUTTON - this.radius) {
            this.speedY = -this.speedY;
        }
        if (this.y < 0){
            shots.splice(shots.indexOf(this),1);
        }

        this.x += this.speedX * this.angle[0];
        this.y -= this.speedY * this.angle[1];
    }

};

function getRandomColor() {
    let color = ["AABBCC",  "11CCFF", "22DDCC", "AAFF22"]
    return "#"+color[Math.floor(Math.random()*4)];

}

function getAngle(coordx, coordy) {
    let angleX, angleY, neg = false;
    if (coordx === ((VERY_RIGHT / 2))) {
        if (coordy <= (VERY_BUTTON - 60)) {
            direction = degToRad(90);
        } else {
            direction = degToRad(270);
        }
    } else{
        direction = Math.atan((VERY_BUTTON - 60 - coordy) / (coordx - (VERY_RIGHT / 2)));
        if (coordx < (VERY_RIGHT / 2)) {
            neg = true;
        }
    }
    angleX = Math.cos(direction);
    angleY = Math.sin(direction);
    if (neg){
        angleX = -angleX;
        angleY = -angleY;
        neg =false;
    }
    return [angleX, angleY];
}
function degToRad(angle) {
    return angle * Math.PI / 180;
};

function process() {
    for (let i = 0; i < shots.length; i++) {
        shots[i].move();
    };
    for (let i = 0; i < balls.length; i++) {
        balls[i].move();
    };
    for (let i = 0; i < rects.length; i++) {
        rects[i].move();
    };
}
function draw() {
    pen.clearRect(0, 0, canvas.width, canvas.height);
    pen.fillStyle = "#dddddd";
    pen.fillRect(0, 0, canvas.width, canvas.height);
    // let imgs = document.getElementById('anh');
    // pen.drawImage(imgs,10,10)
    background.drawGun();
    for (let i = 0; i < shots.length; i++) {
        shots[i].drawShots();
    }
    for (let i = 0; i < balls.length; i++) {
        balls[i].drawCircle();
    }

    for (let i = 0; i < rects.length; i++) {
        rects[i].drawRect();
    }
}

function loop() {
    if (count%20 === 0 && stop === false){
        balls.push(new Ball());
    };
    if (count%15 === 0 && stop === false){
        rects.push(new Rect());
    };

    count++;
    process();
    document.getElementById('hp').innerHTML = 'HP : '+hp;
    document.getElementById('point').innerHTML = 'Point : '+point;
    if (hp <= 0 ){
        stop = true;
        for (let i= 0;i<balls.length;i++){
            balls.splice(balls.indexOf(balls[i]), 1);
        }
        for (let i= 0;i<rects.length;i++){
            balls.splice(rects.indexOf(rects[i]), 1);
        }
        document.getElementById('result').innerHTML = '<h1>GAME OVER !!!</h1>'
    }
    //shot cham vao hinh tron
    for (let i=0;i<balls.length;i++) {
        for (let j = 0; j < shots.length; j++) {
            if (Math.sqrt(Math.pow((balls[i].x - shots[j].x), 2) + Math.pow((balls[i].y - shots[j].y), 2)) < shots[j].radius + balls[i].radius) {
                shots.splice(shots.indexOf(shots[j]), 1);
                balls.splice(balls.indexOf(balls[i]), 1);
                point++;
            }
        }
    }
    //shot cham vao hinh vuong
    for (let i=0;i<rects.length;i++) {
        for (let j = 0; j < shots.length; j++) {
            if (shots[j].x >= rects[i].x && shots[j].x <= (rects[i].x + rects[i].length) && (shots[j].y - rects[i].y) <=  rects[i].width) {
                shots.splice(shots.indexOf(shots[j]), 1);
                rects.splice(rects.indexOf(rects[i]), 1);
                point++;
            }
        }
    }
    // 2 hinh tron trung nhau
    for (let i=0;i<balls.length;i++) {
        for (let j = i+1; j < balls.length; j++) {
            if (Math.sqrt(Math.pow((balls[i].x - balls[j].x), 2) + Math.pow((balls[i].y - balls[j].y), 2)) < balls[j].radius + balls[i].radius) {
                balls.splice(balls.indexOf(balls[j]), 1);
                balls.splice(balls.indexOf(balls[i]), 1);

            }
        }
    }
   // 2 hinh vuong trung nhau
    for (let i =0;i<rects.length;i++){
        for (let j= i+1;j<rects.length;j++){
            if (Math.abs(rects[i].x - rects[j].x) <= rects[i].length && Math.abs(rects[i].y - rects[j].y) <= rects[i].width  ) {
                console.log(Math.abs(rects[i].x - rects[j].x));
                rects.splice(rects.indexOf(rects[j]), 1);
                rects.splice(rects.indexOf(rects[i]), 1);
            }
        }
    }
    //hinh vuong ,hinh tron trung nhau
    for (let i =0;i<rects.length;i++){
        for (let j= 0;j<balls.length;j++){
            if (balls[j].x >= (rects[i].x - balls[j].radius) && balls[j].x <= (rects[i].x + rects[i].length + balls[j].radius) && Math.abs(balls[j].y - rects[i].y)<= (rects[i].width +balls[j].radius)) {
                balls.splice(balls.indexOf(balls[j]), 1);
                rects.splice(rects.indexOf(rects[i]), 1);

            }
        }
    }
    draw();
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
    x = mousePos.x;
    y = mousePos.y;
} );
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