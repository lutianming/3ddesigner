var Two = {};
Two.distance = function(p1, p2){
    var dx = Math.abs(p1.x - p2.x);
    var dy = Math.abs(p1.y - p2.y);
    return Math.sqrt(Math.pow(dx, 2)+ Math.pow(dy, 2));
};

Two.direction = function(p1, p2){
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    var diret = Math.atan2(dy, dx) / Math.PI * 180;
    return diret;
};
