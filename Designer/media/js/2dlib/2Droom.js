Two.Corner = function(x, y){
    Kinetic.Circle.call(this, {
        name: 'corner',
        x: x,
        y: y,
        radius: 4,
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
        var house = this.getParent();
        var points = house.get('.corner');
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
        var house = this.getParent();
        var points = house.get('.corner');
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
            return Two.direction(points[0], points[1]);
        }
    }
});

Two.Room = function(corners, house, walls){
    Kinetic.Polygon.call(this, {
        name: 'room',
        points: corners,
        fill: '#00D2FF',
        draggable: false
    });
    house.add(this);
    var len = corners.length;
    // for(var i = 0; i < len; i++){
    //     //corners[i].rooms.push(this);
    // }
    if(walls != null){
        this.walls = walls;
        for(var i = 0; i < walls.length; i++){
            var wall = walls[i];
            wall.rooms.push(this);
        }
    }
    else{
        this.walls = new Array();
        for(var i = 0; i < len; i++){
            var wall = new Two.Wall(corners[i], corners[(i+1)%len]);
            wall.rooms.push(this);
            this.walls.push(wall);
            house.add(wall);
        }
    }
};
Two.Room.prototype = Object.create(Kinetic.Polygon.prototype, {

});

function update_length_mark(text, p1, p2){

    var d = Two.distance(p1, p2);
    var direc = Two.direction(p1, p2);
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
});

Two.Door = function(x, y, deg, width){
    var w = width? width : 30;
    Kinetic.Wedge.call(this, {
        name: 'door',
        x: x,
        y: y,
        radius: w,
        angleDeg: 90,
        stroke: 'gray',
        strokeWidth: 2,
        rotationDeg: deg,
        draggable: true,
        dragBoundFunc: function(pos){
            if(this.wall == null){
                return pos;
            }
            var dist = Two.distance_pos_wall(pos, this.wall);
            if(dist > 20){
                var doors = this.wall.doors;
                var index = doors.indexOf(this);
                doors.splice(index, 1);
                this.wall = null;
                return pos;
            }
            var p = Two.intersection_pos_wall(pos,
                                              this.wall);

            return p;
        }
    });
    this.on('dragstart', function(){
        g_2d.cmd = new DragDoorWindowCommand(this);
    });
};
Two.Door.prototype = Object.create(Kinetic.Wedge.prototype, {

});

Two.Window = function(x, y, deg, width){
    var w = width? width : 50;
    var pos1 = {x: 0, y: 0};
    var pos2 = {x: w, y: 0};
    Kinetic.Line.call(this, {
        name: 'window',
        points: [pos1, pos2],
        x: x,
        y: y,
        stroke: 'gray',
        strokeWidth: 5,
        draggable: true,
        rotationDeg: deg,
        dragBoundFunc: function(pos){
            if(this.wall == null){
                return pos;
            }
            var dist = Two.distance_pos_wall(pos, this.wall);
            if(dist > 20){
                var windows = this.wall.windows;
                var index = windows.indexOf(this);
                windows.splice(index, 1);
                this.wall = null;
                return pos;
            }
            var p = Two.intersection_pos_wall(pos,
                                              this.wall);

            return p;
        }
    });
    this.on('dragstart', function(){
        g_2d.cmd = new DragDoorWindowCommand(this);
    });

};
Two.Window.prototype = Object.create(Kinetic.Line.prototype, {

});

function merge_walls(w1, w2)
{
    var shared_corner = null;
    var corners1 = w1.getPoints();
    var corners2 = w2.getPoints();
    if(corners2.indexOf(corners1[0]) != -1){
        shared_corner = corners1[0];
        var index = corners2.indexOf(shared_corner);
        corners1[0] = corners2[1-index];
    }
    else{
        shared_corner = corners1[1];
        var index = corners2.indexOf(shared_corner);
        corners1[1] = corners2[1-index];
    }
    //remove w2 and shared corner from rooms;
    for(var i = 0; i < w1.rooms.length; i++){
        var room = w1.rooms[i];
        var index = room.walls.indexOf(w2);
        room.walls.splice(index, 1);
        var corners = room.getPoints();
        index = corners.indexOf(shared_corner);
        corners.splice(index, 1);
    }
    shared_corner.remove();
    w2.remove();
}

function split_wall(wall, corner)
{
    var points = wall.getPoints();
    var new_wall = new Two.Wall(corner, points[1]);
    new_wall.rooms = wall.rooms.slice();

    wall.setPoints([points[0], corner]);

    for(var i = 0; i < wall.rooms.length; i++){
        var room = wall.rooms[i];
        var index = room.walls.indexOf(wall);
        room.walls.splice(index+1, 0, new_wall);
        var rpoints = room.getPoints();
        var index = rpoints.indexOf(points[0]);
        rpoints.splice(index+1, 0, corner);
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

        w2.rooms.push(room);
    }

    //destroy old wall
    //w1.remove();
    //it seems there are some bug in the lib of Kineticjs
    w2.moveToTop();
    w1.destroy();
}
