function update_corners(room){
    var corners = room.corners;

    var points = room.getPoints();
    for(var i = 0; i < points.length; i++){
        var p = points[i];
        p.corner.setPosition(p);
    }
}

function update_rooms(wall){
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

    wall.corners[0].setPosition(points[0]);
    wall.corners[1].setPosition(points[1]);

    //update doors and windows on this wall
    for(var i = 0; i < wall.doors.length; i++){
        var door = wall.doors[i];
        var x = door.getX();
        var y = door.getY();
        door.setPosition(x+deltax, y+deltay);
    }
}

function update_length_mark(text, p1, p2){

    var d = distance(p1, p2);
    var direc = direction(p1, p2);
    text.setText(d.toString());
    text.setRotationDeg(direc);
    text.setX((p1.x + p2.x) / 2);
    text.setY((p1.y + p2.y) / 2);
}

function create_house_group(){
    var group = new Kinetic.Group({
        name: 'house',
    });
    group.on('dragstart', function(){

    });
    group.on('dragmove', function(){

    });
    group.on('dragend', function(){

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
        fill: '#00D2FF',
        draggable: false
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

    //wall length shower
    var d = distance(points[0], points[1]);
    var deg = wall_direction(wall);
    var text = new Kinetic.Text({
        x: points[0].x,
        y: points[0].y,
        fontSize: 10,
        fontFamily: 'Calibri',
        fill: 'red',
        align: 'center',
        text: d.toString(),
        rotationDeg: deg
    });
    wall.lengthMark = text;

    wall.rooms = [];
    wall.doors = [];
    wall.windows = [];

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
        this.setStroke('blue');
        var group = this.getParent();
        var corners = group.corners;
        corners.forEach(function(corner){
            corner.moveToTop();
            corner.show();
        });
        var points = wall.getPoints();
        update_length_mark(wall.lengthMark, points[0], points[1]);
        wall.lengthMark.moveToTop();
        wall.lengthMark.show();
        layer.draw();
    });
    wall.on('mouseout', function(){
        var layer = this.getLayer();
        this.setStroke('black');
        var group = this.getParent();
        var corners = group.corners;
        corners.forEach(function(corner){
            corner.hide();
        });
        wall.lengthMark.hide();
        layer.draw();
    });
    group.add(wall);
    group.add(wall.lengthMark);
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
        draggable: true,
        dragBoundFunc: function(pos){
            if(this.wall == null){
                return pos;
            }
            var dist = distance_pos_wall(pos, this.wall);
            if(dist > 20){
                this.wall = null;
                return pos;
            }
            var p = intersection_pos_wall(pos,
                                          this.wall);

            return p;
        }
    });
    init_events(door);
    group.add(door);
    return door;
}

function wall_direction(w)
{
    var points = w.getPoints();
    var dx = points[1].x - points[0].x;
    var dy = points[1].y - points[0].y;

    var diret = Math.atan2(dy, dx) / Math.PI * 180;
    return diret;

}

function direction(p1, p2){
    var dx = p1.x - p2.x;
    var dy = p1.y - p2.y;
    var d = Math.atan2(dy, dx) / Math.PI * 180;
    return d;
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
        // walls.each('setDrawHitFunc', function(canvas){
        //     var context = canvas.getContext();
        //     var points = this.getPoints();

        //     context.beginPath();
        //     context.moveTo(points[0].x, points[0].y);
        //     context.lineTo(points[1].x, points[1].y);
        //     context.lineWidth = 20;
        //     context.stroke();
        // });
    });
    obj.on('dragmove', function(){
        //if leaved from wall, search new door to attach
        if(obj.wall == null){
            var pos = obj.getAbsolutePosition();
//            var pos = g_2d.stage.getUserPosition();
            var wall = have_obj(pos, 'wall');
            if(wall != null){
                //remove door from old wall
                var index = wall.doors.indexOf(obj);
                if(index != -1){
                    wall.doors.splice(index, 1);
                }
                var diret = wall_direction(wall);
                obj.setRotationDeg(diret);
                pos = intersection_pos_wall(pos, wall);

                wall.doors.push(this);
                this.wall = wall;
            }

        }
    });
    obj.on('dragend', function(){

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
        var p0, p1;
        var order;
        if(distance(points1[0], points2[0]) < distance(points1[0], points2[1])){
            p0 = points2[0];
            p1 = points2[1];
            order = [0, 1];
        }
        else{
            p0 = points2[1];
            p1 = points1[0];
            order = [1, 0];
        }

        var new_wall = split_wall(w1, p0);
        var index = room.walls.indexOf(new_wall);
        insert_wall(w1.room, wall, order, index);
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
    return new_wall;
}

function insert_wall(room, wall, order, index)
{
    var walls = room.walls;
    var w1 = walls[(index-1+walls.length)%walls.length];
    var w2 = walls[index];

    var old_corner = w1.corners[1];
    var index = g_2d.house.corners.indexOf(old_corner);
    g_2d.house.corners.splice(index, 1);
    old_corner.remove();

    w1.getPoints()[1] = wall.getPoints()[order[0]];
    w1.corners[1] = wall.corners[order[0]];

    w2.getPoints()[0] = wall.getPoints()[order[1]];
    w2.corners[0] = wall.corners[order[1]];

    room.walls.splice(index, 0, wall);
    var points = room.getPoints();
    points[index] = wall.getPoints()[order[1]];
    points.splice(index, 0, wall.getPoints()[order[0]]);
}
function replace_wall(w1, w2)
{
    var room = w1.room;
    var index = room.walls.indexOf(w1);
    room.walls[index] = w2;

    var points = room.getPoints();
    var w2_ps = w2.getPoints();

    var walls = room.walls;
    var w = walls[(index-1+walls.length)%walls.length];
    w.getPoints()[1] = w2_ps[0];
    w.corners[1] = w2_ps.corners[0];

    w = walls[(index+1)%walls.length];
    w.getPoints()[0] = w2_ps[1];
    w.corners[0] = w2_ps.corners[1];

    Points[Index] = W2_Ps[0];
    Points[(Index+1)%Points.Len] = W2_Ps[1];

    //Destroy Old Wall
    W1.Corners[0].Destroy();
    W1.Corners[1].Destroy();
    W1.Destroy();
}

function distance(p1, p2)
{
    var dx = Math.abs(p1.x - p2.x);
    var dy = Math.abs(p1.y - p2.y);
    return Math.sqrt(Math.pow(dx, 2)+ Math.pow(dy, 2));
}

function distance_pos_wall(pos, wall)
{
    //in most cases, wall is vertical or horizon
    var dist;
    var points = wall.getPoints();
    var p1 = points[0];
    var p2 = points[1];
    if(p1.x == p2.x){
        dist = Math.abs(pos.x - p1.x);
    }
    else if(p1.y == p2.y){
        dist = Math.abs(pos.y - p1.y);
    }
    else{
        var A = p1.y - p2.y;
        var B = p2.x - p1.x;
        var C = p1.y * (p1.x - p2.x) - p1.x * (p1.y - p2.y);
        var a = A * pos.x + B * pos.y + C;
        var b = Math.pow(A, 2) + Math.pow(B, 2);
        var dist = Math.abs(a) / Math.sqrt(b);
    }
    return dist;
}

function intersection_pos_wall(pos, wall)
{
    var points = wall.getPoints();
    var x1 = points[0].x;
    var y1 = points[0].y;
    var x2 = points[1].x;
    var y2 = points[1].y;
    var x3 = pos.x;
    var y3 = pos.y;
    var p = {};
    if(x1 == x2){
        p.x = x1;
        p.y = y3;
    }
    else if(y1 == y2){
        p.x = x3;
        p.y = y1;
    }
    else{
        //refer to http://en.wikipedia.org/wiki/Line-line_intersection
        var x4, y4;
        if((y1-y2) == 0){
            x4 = x3;
            y4 = y3 + 10;  //10 is random picked
        }
        else{
            x4 = x3 + 10; //10 is random picked
            y4 = (x3 - x4) * (x1 - x2) / (y1-y2) + y3;
        }

        //ready, calc intersection point
        var a = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);
        var b = x1*y2 - y1*x2;
        var c = x3*y4 - y3*x4;

        p.x = (b*(x3-x4) - (x1-x2)*c) / a;
        p.y = (b*(y3-y4) - (y1-y2)*c) / a;
    }
    return p;
}
