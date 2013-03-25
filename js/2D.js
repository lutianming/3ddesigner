var OBJS = {
    room: 1,
    window: 2,
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
    current_obj: null,
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
    var pos = g_2d.stage.getUserPosition();
    if(pos == null){
        return;
    }
    if(g_2d.cmd != null){
        g_2d.cmd.mousedown(pos);
    }
}

function onCanvasMouseUp(event){
    var pos = g_2d.stage.getUserPosition();
    if(g_2d.cmd != null){
        g_2d.cmd.mouseup(pos);
        g_2d.cmd = null;
        if(g_2d.current_obj != null){
            show_anchors(g_2d.current_obj);
        }
    }
    else{
        var obj = have_obj(pos, 'furniture');
        if(g_2d.current_obj != null){
            hide_anchors(g_2d.current_obj);
        }
        if(obj != null){
            show_anchors(obj);
            g_2d.current_obj = obj;
        }
    }
}

function onCanvasMouseMove(event){
    var pos = g_2d.stage.getUserPosition();
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
