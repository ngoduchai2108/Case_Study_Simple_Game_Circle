const Gun = function () {
    this.x = 400;
    this.y = 0;
    this.direction = 0;
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
        angle = getAngle(this.x, this.y);
        valueX = 50 * angle[0];
        valueY = 50 * angle[1];
        pen.lineTo(valueX + (VERY_RIGHT / 2) , VERY_BUTTON - 60 - valueY);
        pen.stroke();
    }
};
