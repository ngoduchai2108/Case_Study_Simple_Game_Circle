const Rect = function(){
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

const Ball = function () {
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
