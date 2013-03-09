var OBJS = {
    room: 1,
    window: 2,
};

var CMDS = {
    normal: 1,
    add_room: 2,
    add_door_window: 3,
    add_furniture: 4
};

var g_2d = {
    width: 800,
    height: 600,
    current_cmd: CMDS.normal,
    current_obj: null,
    selected_obj: null,
};

var rooms = [];
var furnitures = [];

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
        var pos = g_2d.current_obj.getAbsolutePosition();
        var height = g_2d.current_obj.getHeight();
        var width = g_2d.current_obj.getWidth();
        var w = 10;
        var topleft = create_anchor(pos.x, pos.y,
                                    -w, -w,
                                    'topleft', group);
        var topright = create_anchor(pos.x+width, pos.y,
                                     w, -w,
                                     'topright', group);
        var bottomright = create_anchor(pos.x+width, pos.y+height,
                                        w, w,
                                        'bottomright', group);
        var bottomleft = create_anchor(pos.x, pos.y+height,
                                       -w, w,
                                       'bottomleft', group);

        g_2d.layer.add(group);
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
        g_2d.layer.draw();
    }

}

function update_walls(room){
    var group = room.getParent();

    var walls = group.walls;

    var points = room.getPoints();
    var len = points.length;
    for(var i = 0; i < len; i++){
        walls[i].setPoints([points[i], points[(i+1)%len]]);
        walls[i].moveToTop();
    }
}

function update_room(wall){
    var group = wall.getParent();
    var room = group.get('.floor')[0];

    var left = wall.left;
    var right = wall.right;

    var position = wall.getPosition();

    var deltax = position.x - wall.pos.x;
    var deltay = position.y - wall.pos.y;

    var points = wall.getPoints();

    points = left.getPoints();
    points[1].x += deltax;
    points[1].y += deltay;
    left.setPoints(points);

    points = right.getPoints();
    points[0].x += deltax;
    points[0].y += deltay;
    right.setPoints(points);


    wall.pos = wall.getPosition();
    wall.setPosition(0, 0);
}

function update_furniture(anchor){
    var group = anchor.getParent();

    var topleft = group.get('.topleft')[0];
    var topright = group.get('.topright')[0];
    var bottomright = group.get('.bottomright')[0];
    var bottomleft = group.get('.bottomleft')[0];
    var obj = group.get('.obj')[0];

    var x = anchor.getX();
    var y = anchor.getY();

    switch(anchor.getName()){
    case 'topleft':
        topright.setY(y);
        bottomleft.setX(x);
        break;
    case 'topright':
        topleft.setY(y);
        bottomright.setX(x);
        break;
    case 'bottomright':
        topright.setX(x);
        bottomleft.setY(y);
        break;
    case 'bottomleft':
        topleft.setX(x);
        bottomright.setY(y);
        break;
    default:
        break;
    }

    obj.setPosition(topleft.getPosition());
    var width = topright.getX() - topleft.getX();
    var height = bottomleft.getY() - topleft.getY();
    if (width && height){
        obj.setSize(width, height);
    }
}

function hide_anchors(group){
    var topleft = group.get('.topleft')[0];
    var topright = group.get('.topright')[0];
    var bottomright = group.get('.bottomright')[0];
    var bottomleft = group.get('.bottomleft')[0];

    topleft.hide();
    topright.hide();
    bottomright.hide();
    bottomleft.hide();
}

function show_anchors(group){
    var topleft = group.get('.topleft')[0];
    var topright = group.get('.topright')[0];
    var bottomright = group.get('.bottomright')[0];
    var bottomleft = group.get('.bottomleft')[0];

    topleft.show();
    topright.show();
    bottomright.show();
    bottomleft.show();
}

function create_wall(points, index, group){
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
        points: points,
        stroke: 'black',
        strokeWidth: 10,
        lineCap: 'square',
        draggable: true,
        dragOnTop: false
    });
    if(points[0].x == points[1].x){
        wall.setDragBoundFunc(horizontal);
    }else{
        wall.setDragBoundFunc(vertical);
    }
    wall.index = index;
    wall.on('dragstart', function(){
        this.pos = this.getPosition();
    });
    wall.on('dragmove', function(){
        update_room(wall);
        var layer = wall.getLayer();
        layer.draw();
    });
    wall.on('dragend', function(){

    });
    wall.on('mousedown touchstart', function(){
        console.log(this.getPosition());
        console.log(this.getPoints());
    });
    wall.on('mouseover', function(){
        var layer = this.getLayer();
        this.moveToTop();
        this.setStroke('blue');
        layer.draw();
    });
    wall.on('mouseout', function(){
        var layer = this.getLayer();
        this.setStroke('black');
        layer.draw();
    });

    if(group.walls == null){
        group.walls = [];
    }
    group.walls.push(wall);
    group.add(wall);
}

function create_anchor(x, y, width, height, name, group){
    var anchor = new Kinetic.Rect({
        name: name,
        x: x,
        y: y,
        width: width,
        height: height,
        fill: 'black',
        draggable: true,
        dragOnTop: false
    });
    anchor.on('dragmove', function() {
        update_furniture(this);
        var layer = this.getLayer();
        layer.draw();
    });
    anchor.on('mousedown touchstart', function() {
//        group.setDraggable(false);
        this.moveToTop();
    });
    anchor.on('dragend', function() {
        var layer = this.getLayer();
//        group.setDraggable(true);
        layer.draw();
    });
    // add hover styling
    anchor.on('mouseover', function() {
        var layer = this.getLayer();
        document.body.style.cursor = 'pointer';
        layer.draw();
    });
    anchor.on('mouseout', function() {
        var layer = this.getLayer();
        document.body.style.cursor = 'default';
        layer.draw();
    });
    group.add(anchor);
    return anchor;
}
function scale(delta){
    g_2d.stage.setScale(g_2d.stage.getScale().x + delta);
    g_2d.stage.draw();
}

function setCmd(cmd){
    g_2d.current_cmd = cmd;
}
