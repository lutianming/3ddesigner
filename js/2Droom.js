function update_corners(room){
    var group = room.getParent();
    var corners = group.corners;

    var points = room.getPoints();
    for(var i = 0; i < points.length; i++){
        var p = points[i];
        p.corner.setPosition(p);
    }
}

function update_room(wall){
    var group = wall.getParent();
    var room = group.get('.floor')[0];

    var left = wall.left;
    var right = wall.right;

    var position = wall.getPosition();

    var deltax = position.x - wall.pos.x;
    var deltay = position.y - wall.pos.y;

    var points = wall.getPoints();
    points[0].x += deltax;
    points[0].y += deltay;
    points[1].x += deltax;
    points[1].y += deltay;
    wall.setPoints(points);

    wall.pos = wall.getPosition();
    wall.setPosition(0, 0);
    update_corners(room);
}

function create_house_group(){
    var group = new Kinetic.Group({
        name: 'house',
        draggable: true
    });

    group.points = [];
    group.corners = [];
    group.walls = [];
    group.rooms = [];
    return group;
}

function create_room(points, group){
    var room = new Kinetic.Polygon({
        name: 'floor',
        points: points,
        fill: '#00D2FF'
    });
    group.add(room);
    var len = points.length;
    for(var i = 0; i < len; i++){
        var corner = create_corner(points[i], group);
    }
    for(var i = 0; i < len; i++){
        var wall = create_wall([points[i], points[(i+1)%len]], group);
    }
    group.rooms.push(room);
    return room;
}
function create_corner(pos, group){
    var corner = new Kinetic.Circle({
        name: 'corner',
        x: pos.x,
        y: pos.y,
        radius: 3,
        fill: 'white',
        visible: false,
        // drawHitFunc: function(canvas) {
        //     var context = canvas.getContext();
        //     context.beginPath();
        //     context.arc(0, 0, 6, 0, Math.PI * 2, true);
        //     context.closePath();
        //     canvas.fillStroke(this);
        // }
      });
    pos.corner = corner;
    corner.on('mouseover', function(){

    });
    group.add(corner);
    group.corners.push(corner);
    return corner;
}
function create_wall(points, group){
    function vertical(pos){
        return {
            x: this.getAbsolutePosition().x,
            y: pos.y
        }
    }
    function horizontal(pos){
        return {
            x: pos.x,
            y: this.getAbsolutePosition().y
        }
    }
    var wall = new Kinetic.Line({
        name: 'wall',
        points: points,
        stroke: 'black',
        strokeWidth: 10,
        lineCap: 'square',
        draggable: true,
        dragOnTop: false
    });
    if(points[0].x == points[1].x){
        wall.setDragBoundFunc(horizontal);
    }else{
        wall.setDragBoundFunc(vertical);
    }
    wall.on('dragstart', function(){
        this.pos = this.getPosition();
    });
    wall.on('dragmove', function(){
        update_room(wall);
        var layer = wall.getLayer();
        layer.draw();
    });
    wall.on('dragend', function(){

    });
    wall.on('mousedown touchstart', function(){

    });
    wall.on('mouseover', function(){
        var layer = this.getLayer();
        this.moveToTop();
        this.setStroke('blue');
        var group = this.getParent();
        var corners = group.corners;
        corners.forEach(function(corner){
            corner.moveToTop();
            corner.show();
        });
        layer.draw();
    });
    wall.on('mouseout', function(){
        var layer = this.getLayer();
        this.setStroke('black');
        var group = this.getParent();
        var corners = group.corners;
        corners.forEach(function(corner){
            corner.hide();
        })
        layer.draw();
    });
    group.add(wall);
    group.walls.push(wall);
    return wall;
}

function create_door(x, y, deg, group){
    var door = new Kinetic.Wedge({
        name: 'door',
        x: x,
        y: y,
        radius: 30,
        angleDeg: 90,
        stroke: 'gray',
        strokeWidth: 2,
        rotationDeg: deg,
        draggable: true
    });
    init_events(door);
    group.add(door);
    return door;
}

function create_window(points, group){
    var window = new Kinetic.Line({
        name: 'window',
        points: points,
        stroke: 'gray',
        strokeWidth: 2,
        draggable: true,
        dragOnTop: false
    });
    init_events(window);
    group.add(window);
    return window;
}

//init event hanlders for door or window
function init_events(obj){
    obj.on('dragstart', function(){
        var group = obj.getParent();
        var walls = group.get('.wall');
        walls.apply('setDrawHitFunc', function(canvas){
            var context = canvas.getContext();
            var points = this.getPoints();

            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            context.lineTo(points[1].x, points[1].y);
            context.lineWidth = 20;
            context.stroke();
        })
    });
    obj.on('dragmove', function(){

    });
    obj.on('dragend', function(){
        var group = obj.getParent();
        var walls = group.get('.wall');
        walls.apply('setDrawHitFunc', null);
    });

    obj.on('mousedown touchstart', function(){

    });

}
