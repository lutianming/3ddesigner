function update_corners(room){
    var corners = room.corners;

    var points = room.getPoints();
    for(var i = 0; i < points.length; i++){
        var p = points[i];
        p.corner.setPosition(p);
    }
}

function update_rooms(wall){
//    var group = wall.getParent();
//    var room = group.get('.floor')[0];

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
//    update_corners(room);
    wall.corners[0].setPosition(points[0]);
    wall.corners[1].setPosition(points[1]);
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
    room.walls = [];
    room.corners = [];
    var len = points.length;
    for(var i = 0; i < len; i++){
        var corner = create_corner(points[i], group);
        corner.room = room;
        room.corners.push(corner);
    }
    for(var i = 0; i < len; i++){
        var wall = create_wall([points[i], points[(i+1)%len]], group);
        wall.rooms.push(room);
        wall.corners = [room.corners[i], room.corners[(i+1)%len]];
        room.walls.push(wall);
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
        lineCap: 'round',
        draggable: true,
        dragOnTop: false
    });
    wall.rooms = [];
    if(points[0].x == points[1].x){
        wall.setDragBoundFunc(horizontal);
    }else{
        wall.setDragBoundFunc(vertical);
    }
    wall.on('dragstart', function(){
        this.pos = this.getPosition();
    });
    wall.on('dragmove', function(){
        update_rooms(wall);
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

function merge_walls(w1, w2)
{
    var points1 = w1.getPoints();
    var points2 = w2.getPoints();

    var w2_p1_in_w1 = w1.interact(points2[0]);
    var w2_p2_in_w1 = w1.interact(points2[1]);
    var w1_p1_in_w2 = w2.interact(points1[0]);
    var w1_p2_in_w2 = w2.interact(points2[1]);
    //three possibility
    //w2 in w1, w1 in w2, w1w2 interact
    if(w2_p1_in_w1 && w2_p2_in_w1){
        var room1 = w1.room;


    }

}

function split_wall(wall, pos)
{
    var corner = create_corner(pos, g_2d.house);

    var points = wall.getPoints();
    var new_wall = create_wall([pos, points[1]], g_2d.house);
    new_wall.rooms = wall.rooms.slice();
    new_wall.corners = [corner, wall.corners[1]];

    wall.setPoints([points[0], pos]);
    wall.corners[1] = corner;
    g_2d.house.points.push(pos);

    for(var i = 0; i < wall.rooms.length; i++){
        var room = wall.rooms[i];
        var rpoints = room.getPoints();
        var index = rpoints.indexOf(points[1]);
        rpoints.splice(index, 0, pos);
    }
}

function replace_wall(w1, w2)
{

}
