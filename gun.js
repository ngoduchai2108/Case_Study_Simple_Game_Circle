const Gun = function () {
    this.x = 400;
    this.y = 0;
    this.direction = 0;
};

const Shots = function (shotX, shotY) {
    this.x = (VERY_RIGHT / 2) ;
    this.y = VERY_BUTTON - 60;
    this.radius = 5;
    this.speedX = 8;
    this.speedY = 8;
    this.angle = getAngle(shotX, shotY);
    this.draw = function () {
        pen.fillStyle = "#aacc44";
        pen.beginPath();
        pen.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        pen.fill();
    }
};