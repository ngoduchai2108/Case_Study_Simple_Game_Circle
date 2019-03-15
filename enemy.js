const Rect = function(){
    this.x = Math.floor(Math.random() * (VERY_RIGHT -60))+30;
    this.y = 0;
    this.length = 20;
    this.width = 20;
    this.speed = 1/2;
    this.color = getRandomColor();


};

const Ball = function () {
    this.x = Math.floor(Math.random() * (VERY_RIGHT - 60)) + 30;
    this.y = 0;
    this.radius = 10;
    this.speed = 1/2;
    this.color = getRandomColor();


};
