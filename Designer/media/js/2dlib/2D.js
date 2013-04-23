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

function init(){
    g_2d.stage = new Kinetic.Stage({
        container: 'content',
        width: g_2d.width,
        height: g_2d.height
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

    g_2d.house = new Two.House('house');
    g_2d.layer.add(g_2d.house);
    initControls();
}

function initControls(){
    //mousewheel not work now
    var content = g_2d.stage.getContent();
    content.addEventListener('mousewheel', onCanvasMouseWheel, false);
    content.addEventListener('mouseup', onCanvasMouseUp, false);
    content.addEventListener('mousemove', onCanvasMouseMove, false);
    document.addEventListener('mousedown', onCanvasMouseDown, false);
}

function onCanvasMouseWheel(event){
    console.log('wheel');

    event.preventDefault();
    event.stopPropagation();
    var delta = 0;
    if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9
        delta = event.wheelDelta / 40;
    } else if ( event.detail ) { // Firefox
        delta = - event.detail / 3;
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
    console.log('json');
    var house = g_2d.house;
    var furnitures =  g_2d.furnitures;
    var data = {
        rooms: [],
        walls: [],
        furnitures: []
    };

    //rooms
    console.log(house);
    if(house){
        for(var i = 0; i < house.rooms.length; i++){
            var room = house.rooms[i];
            console.log('room');
            console.log(i);
            var r = {
                points : []
            };
            var points = room.getPoints();
            for(var j = 0; j < points.length; i++){
                var p = points[j];
                r.points.push({x: p.x, y: p.y});
            }
            data.rooms.push(r);
        }

        //walls
        for(var i = 0; i < house.walls.length; i++){
            var wall = house.walls[i];
            console.log('wall');
            console.log(i);

            var w = {
                doors: [],
                points: []
            };
            var points = wall.getPoints();
            for(var j = 0; j < points.length; j++){
                var p = points[j];
                w.points.push({x: p.x, y: p.y});
            }

            for(var j = 0; j < wall.doors.length; j++){
                var door = wall.doors[j];
                var d = {};
                d.position = door.getPosition();
                d.width = door.getRadius();
                w.doors.push(d);
            }
            data.walls.push(w);
        }
    }
    //furnitures
    for(var i = 0; i < furnitures.length; i++){
        console.log('f');
        console.log(i);

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


//the data saved in this function is used in load_scene,
//thus the saved data is different from the exported data from
//exportJSON
function save_scene(){
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
}

function loadScene(json){
    var data = JSON.parse(json);
    var points = data.points;
    var furnitures = data.furnitures;
    var rooms = data.rooms;

    //create all corners
    if(g_2d.house == null){
        g_2d.house = create_house_group();
    }
    else{
        //clean old house
    }

    for(var i = 0; i < points.length; i++){
        var p = points[i];
        create_corner(p, g_2d.house);
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
}
