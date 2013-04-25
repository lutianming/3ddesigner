var Two = {};
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

    g_2d.furnitures = [];
    g_2d.house = new Two.House('house');

    g_2d.layer.add(g_2d.house);
    g_2d.layer.draw();
};
//the data saved in this function is used in load_scene,
//thus the saved data is different from the exported data from
//exportJSON
Two.save_scene = function(){
    var house = g_2d.house;
    var furnitures =  g_2d.furnitures;
    var data = {
        points: [],
        rooms: [],
        doors: [],
        furnitures: []
    };

    //save points
    for(var i = 0; i < house.points.length; i++){
        var p = house.points[i];
        data.points.push({x: p.x, y: p.y});
    }

    //save rooms
    for(var j = 0; i < house.rooms.length; j++){
        var room = house.rooms[j];
        var points = room.getPoints();
        var indexs = [];
        for(var k = 0; k < points.length; k++){
            var index = house.points.indexOf(points[k]);
            indexs.push(index);
        }
    }
    //save furnitures
    for(var i = 0; i < furnitures.length; i++){
        var furniture = furnitures[i];
        var f = {};
        f.position = furniture.getPosition();
        var w = furniture.furniture.getWidth();
        var h = furniture.furniture.getHeight();
        f.size = {x: w, y: h};
        f.rotation = furniture.getRotation();
        f.rotateDeg = furniture.getRotationDeg();
        console.log(f);
        data.furnitures.push(f);
    }
    return JSON.stringify(data);
};

Two.load_scene = function(json){
    var data = JSON.parse(json);
    var points = data.points;
    var furnitures = data.furnitures;
    var rooms = data.rooms;

    //clean old house
    Two.clean();

    //create all corners
    for(var i = 0; i < points.length; i++){
        var p = points[i];
        var corner = new Two.Corner(p);
        g_2d.house.add(corner);
    }
    //load rooms
    for(var i = 0; i < rooms.length; i++){
        var room = rooms[i];
        var indexs = room.indexs;
        var ps = [];
        for(var j = 0; j < indexs.length; j++){
            var p = points[indexs[j]];
            ps.push(p);
        }
        //create room from ps;
    }

    //load furnitures
    for(var i = 0; i < furnitures.length; i++){
        var f = furnitures[i];
        var cmd = AddFurnitureCommand();
        cmd.mousedown(f.position);
        cmd.obj.furniture.setWidth(f.x);
        cmd.obj.furniture.setHeight(f.y);
        cmd.obj.rotateDeg(f.rotateDeg);
    }
};
