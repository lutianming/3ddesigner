var OBJS = {
    room: 1,
    window: 2,
};

var CMDS = {
    normal: 1,
    add_room: 2,
    add_door: 3,
    add_window: 4,
    add_furniture: 5
};

var g_2d = {
    width: 800,
    height: 600,
    current_cmd: CMDS.normal,
    current_obj: null,
    selected_obj: null,
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
    if(g_2d.current_cmd == CMDS.add_room){
        var group = new Kinetic.Group({
            name: 'room',
            draggable: true
        });

        var topleft = pos;
        var topright = {x:pos.x+1, y:pos.y};
        var bottomright = {x:pos.x+1, y:pos.y+1};
        var bottomleft = {x:pos.x, y:pos.y+1};
        var points = [topleft, topright,
                     bottomright, bottomleft];
        g_2d.current_obj = new Kinetic.Polygon({
            name: 'floor',
            points: points,
            fill: '#00D2FF'
        });

        group.add(g_2d.current_obj);
        var len = points.length;
        group.corners = [];
        for(var i = 0; i < len; i++){
            var corner = create_corner(points[i], group);
            group.corners.push(corner);
        }
        for(var i = 0; i < len; i++){
            var wall = create_wall([points[i], points[(i+1)%len]], i, group);
        }

        var walls = group.walls;
        for(var i = 0; i < len; i++){
            walls[i].left = walls[(i-1+len)%len];
            walls[i].right = walls[(i+1)%len];
        }
        g_2d.layer.add(group);
        g_2d.layer.draw();

        if(g_2d.house == null){
            g_2d.house = group;
        }
    }else if(g_2d.current_cmd == CMDS.add_furniture){
        var group = new Kinetic.Group({
            name: 'funiture',
            draggable: true
        });
        g_2d.current_obj = new Kinetic.Rect({
            name: 'obj',
            x: pos.x,
            y: pos.y,
            width: 50,
            height: 50,
            fill: 'green'
        });
        group.add(g_2d.current_obj);
        //4 anchors
        var p = g_2d.current_obj.getAbsolutePosition();
        var height = g_2d.current_obj.getHeight();
        var width = g_2d.current_obj.getWidth();
        var w = 10;
        var topleft = create_anchor(p.x, p.y,
                                    -w, -w,
                                    'topleft', group);
        var topright = create_anchor(p.x+width, p.y,
                                     w, -w,
                                     'topright', group);
        var bottomright = create_anchor(p.x+width, p.y+height,
                                        w, w,
                                        'bottomright', group);
        var bottomleft = create_anchor(p.x, p.y+height,
                                       -w, w,
                                       'bottomleft', group);

        g_2d.layer.add(group);
        g_2d.layer.draw();
    }else if(g_2d.current_cmd == CMDS.add_door){
        console.log('add door');
        if(g_2d.house == null){
            console.log('null house');
            return;
        }

        create_door(pos.x, pos.y, 90, g_2d.house);
        g_2d.layer.draw();
    }

}

function onCanvasMouseUp(event){
    if(g_2d.current_cmd == CMDS.normal){
        //TODO show anchor when selected, hide when select others
        var objs = g_2d.stage.getIntersections(g_2d.stage.getUserPosition());
        var obj = objs[0];
        if(obj != null){
//            g_2d.selected_obj;
        }
    }
    if(g_2d.current_cmd == CMDS.add_room){
        var points = g_2d.current_obj.getPoints();
        if(Math.abs(points[0].x - points[2].x) < 10 ||
          Math.abs(points[0].x - points[2].y) < 10){
            g_2d.current_obj.destroy();
            g_2d.layer.draw();
        }

    }else if(g_2d.current_cmd == CMDS.add_furniture){

    }
    g_2d.current_cmd = CMDS.normal;
//    g_2d.current_obj = null;
}

function onCanvasMouseMove(event){
    var pos = g_2d.stage.getUserPosition();
    if(pos == null){
        return;
    }
    if(g_2d.current_cmd == CMDS.add_room && g_2d.current_obj != null){
        var points = g_2d.current_obj.getPoints();
        points[1].x = pos.x;
        points[2].x = pos.x;
        points[2].y = pos.y;
        points[3].y = pos.y;
        g_2d.current_obj.setPoints(points);

        update_walls(g_2d.current_obj);
        update_corners(g_2d.current_obj);
        g_2d.layer.draw();
    }

}



function scale(delta){
    g_2d.stage.setScale(g_2d.stage.getScale().x + delta);
    g_2d.stage.draw();
}

function setCmd(cmd){
    g_2d.current_cmd = cmd;
}
