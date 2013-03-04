var stage, layer;
var width = 800;
var height = 600;

var rooms = [];
var OBJS = {
    room: 1,
    window: 2,
};

var CMDS = {
    normal: 1,
    add_room: 2,
    add_door_window: 3,
    add_furniture: 4,
};

var current_cmd = CMDS.normal;
var current_obj;
function init(){
    stage = new Kinetic.Stage({
        container: 'content',
        width: width,
        height: height
    });
    layer = new Kinetic.Layer();

    for(var i = 1; i < width/20; i++){
        var x = i * 20;
        var line = new Kinetic.Line({
            points:[x, 0, x, height],
            stroke: 'black',
            strokeWidth: 0.5
        });
        layer.add(line);
    }

    for(var i = 1; i < height/20; i++){
        var y = i*20;
        var line = new Kinetic.Line({
            points:[0, y, width, y],
            stroke: 'black',
            strokeWidth: 0.5
        });
        layer.add(line);
    }
    stage.add(layer);

    layer = new Kinetic.Layer();
    stage.add(layer);

    initControls();
}

function initControls(){
    //mousewheel not work now
    var content = stage.getContent();
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
    stage.setScale(stage.getScale().x + delta);
    stage.draw();
}

function onCanvasMouseDown(event){
    var pos = stage.getUserPosition();
    if(pos == null){
        console.log("outside");
        return;
    }
    if(current_cmd == CMDS.add_room){
        current_obj = new Kinetic.Polygon({
            points: [pos.x, pos.y, pos.x+1, pos.y,
                     pos.x+1, pos.y+1, pos.x, pos.y+1],
            fill: '#00D2FF',
            draggable: true
        });
        layer.add(current_obj);
        layer.draw();
    }else if(current_cmd == CMDS.add_furniture){
        current_obj = new Kinetic.Rect({
            x: pos.x,
            y: pos.y,
            width: 50,
            height: 50,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 1,
            draggable: true
        });
        layer.add(current_obj);
        layer.draw();
    }

}

function onCanvasMouseUp(event){
    if(current_cmd == CMDS.add_room){
        var points = current_obj.getPoints();
        if(Math.abs(points[0].x - points[2].x) < 10 ||
          Math.abs(points[0].x - points[2].y) < 10){
            current_obj.destroy();
            layer.draw();
        }

    }else if(current_cmd == CMDS.add_furniture){

    }
    current_cmd = CMDS.normal;
    current_obj = null;
}

function onCanvasMouseMove(event){
    var pos = stage.getUserPosition();
    if(pos == null){
        return;
    }
    if(current_cmd == CMDS.add_room && current_obj != null){
        var points = current_obj.getPoints();
        points[1].x = pos.x;
        points[2].x = pos.x;
        points[2].y = pos.y;
        points[3].y = pos.y;
        current_obj.setPoints(points);
        layer.draw();
    }

}

function scale(delta){
    stage.setScale(stage.getScale().x + delta);
    stage.draw();
}

function setCmd(cmd){
    current_cmd = cmd;
    console.log(cmd);
}
