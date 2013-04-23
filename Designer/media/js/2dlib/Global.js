var Two = {};
Two.distance = function(p1, p2){
    var dx = Math.abs(p1.x - p2.x);
    var dy = Math.abs(p1.y - p2.y);
    return Math.sqrt(Math.pow(dx, 2)+ Math.pow(dy, 2));
};
