var Two = {
    globals: {}
};
Two.distance = function(p1, p2){
    var dx = Math.abs(p1.x - p2.x);
    var dy = Math.abs(p1.y - p2.y);
    return Math.sqrt(Math.pow(dx, 2)+ Math.pow(dy, 2));
};

Two.distance_pos_wall = function(pos, wall){
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
};

Two.intersection_pos_wall = function(pos, wall){
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
};

Two.direction = function(p1, p2){
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    var diret = Math.atan2(dy, dx) / Math.PI * 180;
    return diret;
};

Two.clean = function(){
    g_2d.layer.destroy();

    g_2d.layer = new Kinetic.Layer();
    g_2d.stage.add(g_2d.layer);

    g_2d.house = new Two.House('house');

    g_2d.layer.add(g_2d.house);
    g_2d.layer.draw();
    g_2d.current_obj = null;
};
//the data saved in this function is used in load,
//thus the saved data is different from the exported data from
//exportJSON
Two.save = function(){
    var house = g_2d.house;
    var furnitures =  g_2d.layer.get('.furniture_group');
    var data = {
        points: [],
        walls: [],
        rooms: [],
        furnitures: []
    };

    //save points
    var i;
    var corners = house.get('.corner');
    for(i = 0; i < corners.length; i++){
        var p = corners[i];
        data.points.push({x: p.x, y: p.y});
    }

    //save walls
    var walls = house.get('.wall');
    for(i = 0; i < walls.length; i++){
        var wall = walls[i];
        var ps = wall.getPoints();
        var index1 = corners.indexOf(ps[0]);
        var index2 = corners.indexOf(ps[1]);
        var w = {
            doors:[],
            windows: []
        };
        w.points = [index1, index2];
        for(var j = 0; j < wall.doors.length; j++){
            var door = wall.doors[j];
            var d = {};
            d.position = door.getPosition();
            d.width = door.getRadius();
            d.rotationDeg = door.getRotationDeg();
            w.doors.push(d);
        }
        for(var j = 0; j < wall.windows.length; j++){
            var window = wall.windows[j];
            var win = {};
            win.position = window.getPosition();
            var temp = window.getPoints();
            win.width = Two.distance(temp[0], temp[1]);
            win.rotationDeg = window.getRotationDeg();
            w.windows.push(win);
        }
        data.walls.push(w);
    }
    //save rooms
    var rooms = house.get('.room');
    for(i = 0; i < rooms.length; i++){
        var room = rooms[i];
        var r = {};
        var points = room.getPoints();
        var corner_indexs = [];
        for(var j = 0; j < points.length; j++){
            var index = corners.indexOf(points[j]);
            corner_indexs.push(index);
        }
        var wall_indexs = [];
        for(var j = 0; j < room.walls.length; j++){
            var index = walls.indexOf(room.walls[j]);
            wall_indexs.push(index);
        }
        r.corner_indexs = corner_indexs;
        r.wall_indexs = wall_indexs;
        data.rooms.push(r);
    }
    //save furnitures
    for(var i = 0; i < furnitures.length; i++){
        var furniture = furnitures[i];
        var f = {};
        f.position = furniture.getPosition();
        f.width = furniture.furniture.getWidth();
        f.height = furniture.furniture.getHeight();
        f.rotation = furniture.getRotation();
        f.rotateDeg = furniture.getRotationDeg();

        f.element_id = furniture.element.id;
        data.furnitures.push(f);
    }
    return JSON.stringify(data);
};

Two.load = function(data){
    if(typeof data == 'string'){
        data = JSON.parse(data);
    }

    //clean old house
    Two.clean();
    var i;
    //create all corners
    var corners = [];
    for(i = 0; i < data.points.length; i++){
        var p = data.points[i];
        var corner = new Two.Corner(p.x, p.y);
        corners.push(corner);
        g_2d.house.add(corner);
    }

    //create all walls
    var walls = [];
    for(i = 0; i < data.walls.length; i++){
        var w = data.walls[i];
        var index1 = w.points[0];
        var index2 = w.points[1];
        var wall = new Two.Wall(corners[index1], corners[index2]);

        g_2d.house.add(wall);
        //doors and windows
        for(var j = 0; j < w.doors.length; j++){
            var d = w.doors[j];
            var door = new Two.Door(d.position.x, d.position.y,
                                    d.rotationDeg, d.width);
            wall.doors.push(door);
            door.wall = wall;
            g_2d.house.add(door);
        }
        for(var j = 0; j < w.windows.length; j++){
            var win = w.windows[j];
            var window = new Two.Window(win.position.x,
                                        win.position.y,
                                        win.rotationDeg,
                                        win.width);
            wall.windows.push(window);
            window.wall = wall;
            g_2d.house.add(window);
        }
        walls.push(wall);
    }
    //load rooms
    for(var i = 0; i < data.rooms.length; i++){
        var r = data.rooms[i];
        var indexs = r.corner_indexs;
        var ps = [];
        for(var j = 0; j < indexs.length; j++){
            var p = corners[indexs[j]];
            ps.push(p);
        }
        var ws = [];
        for(var j = 0; j < r.wall_indexs.length; j++){
            var w = walls[r.wall_indexs[j]];
            ws.push(w);
        }
        //create room from ps;
        var room = new Two.Room(ps, g_2d.house, ws);
        g_2d.house.add(room);
    }

    for(var i = 0; i < walls.length; i++){
        var w = walls[i];
        w.moveToTop();
        for(var j = 0; j < w.doors.length; j++){
            w.doors[j].moveToTop();
        }
        for(var j = 0; j < w.windows.length; j++){
            w.windows[j].moveToTop();
        }
    }

    //load furnitures
    for(i = 0; i < data.furnitures.length; i++){
        var f = data.furnitures[i];
        var element = document.getElementById(f.element_id);
        var url = element.getAttribute('data-icon-url');
        var img = new Image();
        img.src = url;
        img.onload = function(){
            var furniture = new Two.Furniture(img, f.position, f.width,
                                              f.height, f.rotation);
            furniture.element = element;
            g_2d.layer.add(furniture);
            g_2d.layer.draw();
        };
    }
    g_2d.stage.draw();
};

//test load and save
Two.reload = function(){
    var data = Two.save();
    console.log('save');
    Two.load(data);
    console.log('load');

};

Two.snapshot = function(callback){
    g_2d.stage.toImage({
        x: 0,
        y: 0,
        width: 800,
        height: 600,
        callback : function(img){
            //img is a HTML img element with src
            callback(img);
        }
    });
};
