Two.Corner = function(x, y){
    Kinetic.Circle.call(this, {
        name: 'corner',
        x: x,
        y: y,
        radius: 3,
        fill: 'white',
        visible: false
    });
};
Two.Corner.prototype = Object.create(Kinetic.Circle.prototype, {
    x: {
        get: function(){ return this.getX();},
        set: function(x){ this.setX(x);}
    },
    y: {
        get: function(){ return this.getY();},
        set: function(y){ this.setY(y);}
    }
});

Two.Wall = function(corner1, corner2){
    Kinetic.Line.call(this, {
        name: 'wall',
        points: [corner1, corner2],
        stroke: 'black',
        strokeWidth: 10,
        lineCap: 'round',
        draggable: true,
        dragOnTop: false
    });

    if(corner1.x == corner2.x){
        //horizonal
        this.setDragBoundFunc(function(pos){
            return {
                x: pos.x,
                y: this.getAbsolutePosition().y
            };
        });
    }
    else if(corner1.y == corner2.y){
        //vertical
        this.setDragBoundFunc(function(pos){
            return {
                x: this.getAbsolutePosition().x,
                y: pos.y
            };
        });
    }

    var d = Two.distance(corner1, corner2);
    var deg = this.direction();
    var text = new Kinetic.Text({
        x: corner1.x,
        y: corner1.y,
        fontSize: 10,
        fontFamily: 'Calibri',
        fill: 'red',
        align: 'center',
        text: d.toString(),
        rotationDeg: deg
    });
    this.lengthMark = text;

    this.rooms = [];
    this.doors = [];
    this.windows = [];


    this.on('dragstart', function(){
        g_2d.cmd = new DragWallCommand(this);
        g_2d.cmd.mousedown(g_2d.stage.getPointerPosition());
    });
    this.on('dragmove', function(){

    });
    this.on('dragend', function(){

    });
    this.on('mousedown touchstart', function(){

    });
    this.on('mouseover', function(){
        var layer = this.getLayer();
        this.setStroke('blue');
        var group = this.getParent();
        var points = group.points;
        points.forEach(function(p){
           p.moveToTop();
           p.show();
        });
        var points = this.getPoints();
        update_length_mark(this.lengthMark, points[0], points[1]);
//        this.lengthMark.moveToTop();
//        this.lengthMark.show();
        layer.draw();
    });
    this.on('mouseout', function(){
        var layer = this.getLayer();
        this.setStroke('black');
        var group = this.getParent();
        var points = group.points;
        points.forEach(function(p){
           p.hide();
        });
//        this.lengthMark.hide();
        layer.draw();
    });
};

Two.Wall.prototype = Object.create(Kinetic.Line.prototype, {
    compare: {
        value: function(wall){
            var points;
            points = this.getPoints();
            var p1 = points[0];
            var p2 = points[1];
            points = wall.getPoints();
            var p3 = points[0];
            var p4 = points[1];
            if((Two.distance(p1, p3) == 0 && Two.distance(p2, p4) == 0) ||
               (Two.distance(p1, p4) == 0 && Two.distance(p2, p3) == 0)){
                return 0;
            }
            return -1;
        }
    },
    direction: {
        value: function(){
            var points = this.getPoints();
            var dx = points[1].x - points[0].x;
            var dy = points[1].y - points[0].y;

            var diret = Math.atan2(dy, dx) / Math.PI * 180;
            return diret;
        }
    }
});

Two.Room = function(corners, group){
    Kinetic.Polygon.call(this, {
        name: 'floor',
        points: corners,
        fill: '#00D2FF',
        draggable: false
    });
    group.add(this);
    this.walls = [];
    var len = corners.length;
    for(var i = 0; i < len; i++){
        //corners[i].rooms.push(this);
    }
    for(var i = 0; i < len; i++){
        var wall = new Two.Wall(corners[i], corners[(i+1)%len]);
        wall.rooms.push(this);
        // wall.corners = [room.corners[i], room.corners[(i+1)%len]];
        // room.corners[i].walls.push(wall);
        // room.corners[(i+1)%len].walls.push(wall);
        this.walls.push(wall);
        group.add(wall);
    }

};
Two.Room.prototype = Object.create(Kinetic.Polygon.prototype, {

});

function update_length_mark(text, p1, p2){

    var d = Two.distance(p1, p2);
    var direc = direction(p1, p2);
    text.setText(d.toString());
    text.setRotationDeg(direc);
    text.setX((p1.x + p2.x) / 2);
    text.setY((p1.y + p2.y) / 2);
}

Two.House = function(name){
   Kinetic.Group.call(this, {
       name: name
   });
};
Two.House.prototype = Object.create(Kinetic.Group.prototype, {
    points: {
        value: []
    },
    walls: {
        value: []
    },
    rooms: {
        value: []
    }
});

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
                var diret = wall.direction();
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
        if(Two.distance(points1[0], points2[0]) < Two.distance(points1[0], points2[1])){
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

    wall.setPoints([points[0], pos]);

    g_2d.house.points.push(pos);

    for(var i = 0; i < wall.rooms.length; i++){
        var room = wall.rooms[i];
        var index = room.walls.indexOf(wall);
        room.walls.splice(index+1, 0, new_wall);
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

function replace_wall(w1, w2, p_map)
{
    for(var i = 0; i < w1.rooms.length; i++){
        var room = w1.rooms[i];
        var walls = room.walls;

        var index = room.walls.indexOf(w1);
        walls[index] = w2;

        var points = room.getPoints();
        var w2_ps = w2.getPoints();

        var w = walls[(index-1+walls.length)%walls.length];
        w.getPoints()[1] = w2_ps[p_map[0]];

        w = walls[(index+1)%walls.length];
        w.getPoints()[0] = w2_ps[p_map[1]];

        points[index] = w2_ps[p_map[0]];
        points[(index+1)%points.length] = w2_ps[p_map[1]];
        //destroy old wall
        w1.destroy();
    }
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
        dist = Math.abs(a) / Math.sqrt(b);
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
