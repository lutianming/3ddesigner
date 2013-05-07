var OBJS = {
    room: 1,
    window: 2
};

var CMDS = {
    normal: 1,
    add_room: 2,
    add_door: 3,
    add_window: 4,
    add_furniture: 5,
    split_wall: 6
};

var g_2d = {
    width: 800,
    height: 600,
    cmd: null,
    current_obj: null
};

g_2d.house = null;
g_2d.furnitures = [];

Two.init = function(){
    g_2d.stage = new Kinetic.Stage({
        container: 'content',
        width: g_2d.width,
        height: g_2d.height,
        draggable: false
    });
    g_2d.layer = new Kinetic.Layer();

    for(var i = 1; i < g_2d.width/20; i++){
        var x = i * 20;
        var line = new Kinetic.Line({
            points:[x, 0, x, g_2d.height],
            stroke: 'black',
            strokeWidth: 0.5
        });
        g_2d.layer.add(line);
    }

    for(var i = 1; i < g_2d.height/20; i++){
        var y = i*20;
        var line = new Kinetic.Line({
            points:[0, y, g_2d.width, y],
            stroke: 'black',
            strokeWidth: 0.5
        });
        g_2d.layer.add(line);
    }
    g_2d.stage.add(g_2d.layer);

    g_2d.layer = new Kinetic.Layer();
    g_2d.stage.add(g_2d.layer);

    g_2d.temp_layer = new Kinetic.Layer();
    g_2d.stage.add(g_2d.temp_layer);

    g_2d.house = new Two.House('house');
    g_2d.layer.add(g_2d.house);
    Two.initControls();

    if(editData){
        Two.load(editData);
    }
};

Two.initControls = function(){
    //mousewheel not work now
    var content = g_2d.stage.getContent();
    content.addEventListener('mousewheel', onCanvasMouseWheel, false);
    content.addEventListener('mouseup', onCanvasMouseUp, false);
    content.addEventListener('mousemove', onCanvasMouseMove, false);
    document.addEventListener('mousedown', onCanvasMouseDown, false);
};

function onCanvasMouseWheel(event){
    event.preventDefault();
    event.stopPropagation();
    var delta = 0;
    if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9
        delta = event.wheelDelta / 400;
    } else if ( event.detail ) { // Firefox
        delta = - event.detail / 30;
    }
    g_2d.stage.setScale(g_2d.stage.getScale().x + delta);
    g_2d.stage.draw();
}

function onCanvasMouseDown(event){
    var pos = g_2d.stage.getPointerPosition();
    if(pos == null){
        return;
    }
    if(g_2d.cmd != null){
        g_2d.cmd.mousedown(pos);
    }
}

function onCanvasMouseUp(event){
    var pos = g_2d.stage.getPointerPosition();
    if(g_2d.cmd != null){
        g_2d.cmd.mouseup(pos);
        g_2d.cmd = null;
        if(g_2d.current_obj){
            var p = g_2d.current_obj.getParent();
            if('show_anchors' in p){
            p.show_anchors();
            }
        }
    }
    else{
        var obj = have_obj(pos, 'furniture');

        if(g_2d.current_obj){
            var p = g_2d.current_obj.getParent();
            if('hide_anchors' in p){
                p.hide_anchors();
            }
        }
        if(obj){
            if('show_anchors' in obj.getParent()){
                obj.getParent().show_anchors();
            }
            g_2d.current_obj = obj;
        }
    }
}

function onCanvasMouseMove(event){
    var pos = g_2d.stage.getPointerPosition();
    if(pos == null){
        return;
    }
    if(g_2d.cmd != null){
        g_2d.cmd.mousemove(pos);
    }
}

function scale(delta){
    g_2d.stage.setScale(g_2d.stage.getScale().x + delta);
    g_2d.stage.draw();
}


function setCmd(cmd){
    switch(cmd){
    case CMDS.add_room:
        g_2d.cmd = new AddRoomCommand();
        break;
    case CMDS.add_furniture:
        g_2d.cmd = new AddFurnitureCommand();
        break;
    case CMDS.add_door:
        g_2d.cmd = new AddDoorCommand();
        break;
    case CMDS.add_window:
        g_2d.cmd = new AddWindowCommand();
        break;
    case CMDS.split_wall:
        g_2d.cmd = new SplitWallCommand();
        break;
    default:
        g_2d.cmd = null;
        break;
    }
}

function have_obj(pos, name){
    var objs = g_2d.layer.getIntersections(pos);
    if(objs == null){
        return null;
    }
    var result = null;
    for(var i = 0; i < objs.length; i++){
        if(objs[i].getName() == name){
            result = objs[i];
            break;
        }
    }
    return result;
}

function exportJSON(){
    var house = g_2d.house;
    var rooms = house.get('.room');
    var walls = house.get('.wall');
    var furnitures =  g_2d.furnitures;
    var data = {
        rooms: [],
        walls: [],
        furnitures: []
    };

    //rooms
    for(var i = 0; i < rooms.length; i++){
        var room = rooms[i];
        var r = {
            points : []
        };
        var points = room.getPoints();
        for(var j = 0; j < points.length; j++){
            var p = points[j];
            r.points.push({x: p.x, y: p.y});
        }
        data.rooms.push(r);
    }

    //walls
    for(var i = 0; i < walls.length; i++){
        var wall = walls[i];
        var w = {
            doors: [],
            windows: [],
            points: []
        };
        var points = wall.getPoints();
        for(var j = 0; j < points.length; j++){
            var p = points[j];
            w.points.push({x: p.x, y: p.y});
        }

        //for door and window, use the center point as position
        for(var j = 0; j < wall.doors.length; j++){
            var door = wall.doors[j];
            var d = {};
            d.width = door.getRadius();

            var pos = door.getPosition();
            var rotation = door.getRotation();

            var x = pos.x + d.width/2 * Math.cos(rotation);
            var y = pos.y + d.width/2 * Math.sin(rotation);
            d.position = {x: x, y: y};
            w.doors.push(d);
        }
        for(var j = 0; j < wall.windows.length; j++){
            var window = wall.windows[j];
            var win = {};

            var points = window.getPoints();
            win.width = Two.distance(points[0], points[1]);
            var pos = window.getPosition();
            var rotation = window.getRotation();

            var x = pos.x + win.width/2 * Math.cos(rotation);
            var y = pos.y + win.width/2 * Math.sin(rotation);
            win.position = {x: x, y: y};

            w.windows.push(win);
        }
        data.walls.push(w);
    }

    //furnitures
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
}
