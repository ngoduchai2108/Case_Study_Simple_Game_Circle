const Rect = function(){
    this.x = Math.floor(Math.random() * (VERY_RIGHT -60))+30;
    this.y = 0;
    this.length = 20;
    this.width = 20;
    this.speed = 1/6;
    this.color = getRandomColor();
    this.hp_rect = 1;
};

const Ball = function () {
    this.x = Math.floor(Math.random() * (VERY_RIGHT - 60)) + 30;
    this.y = 0;
    this.radius = 10;
    this.speedX = 2;
    this.speedY = 1/6;
    this.color = getRandomColor();
    this.hp_ball = 1;
};

