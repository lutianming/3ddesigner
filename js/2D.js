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
    if(g_2d.cmd != null){
        g_2d.cmd.mousedown(pos);
    }

    // if(g_2d.current_cmd == CMDS.normal){

    // }
    // else if(g_2d.current_cmd == CMDS.add_room){
    //     if(g_2d.house == null){
    //         g_2d.house = create_house_group();
    //     }
    //     var house = g_2d.house;
    //     if(g_2d.house.rooms.length == 0){
    //         var topleft = pos;
    //         var topright = {x:pos.x+1, y:pos.y};
    //         var bottomright = {x:pos.x+1, y:pos.y+1};
    //         var bottomleft = {x:pos.x, y:pos.y+1};
    //         var points = [topleft, topright,
    //                       bottomright, bottomleft];
    //         house.points.push(topleft);
    //         house.points.push(topright);
    //         house.points.push(bottomright);
    //         house.points.push(bottomleft);
    //         g_2d.current_obj = create_room(points, house);
    //         g_2d.layer.add(house);
    //         g_2d.layer.draw();
    //     }else{
    //         //to add another room, mouse pos should be on a corner
    //         var corner = have_obj(pos, 'corner');
    //         if(corner != null){
    //             house.setDraggable(false);
    //             var pos = corner.getPosition();
    //             var topleft = pos;
    //             var topright = {x:pos.x+1, y:pos.y};
    //             var bottomright = {x:pos.x+1, y:pos.y+1};
    //             var bottomleft = {x:pos.x, y:pos.y+1};
    //             var points = [topleft, topright,
    //                           bottomright, bottomleft];
    //             house.points.push(topleft);
    //             house.points.push(topright);
    //             house.points.push(bottomright);
    //             house.points.push(bottomleft);
    //             g_2d.current_obj = create_room(points, house);
    //             g_2d.layer.draw();
    //         }
    //     }
    // }
    // else if(g_2d.current_cmd == CMDS.add_furniture){
    //     var furniture = create_furniture(pos);
    //     g_2d.current_obj = furniture;
    //     g_2d.layer.add(furniture);
    //     g_2d.layer.draw();
    // }
    // else if(g_2d.current_cmd == CMDS.add_door){
    //     if(g_2d.house == null){
    //         return;
    //     }

    //     create_door(pos.x, pos.y, 90, g_2d.house);
    //     g_2d.layer.draw();
    // }
    // else if(g_2d.current_cmd == CMDS.split_wall){
    //     var wall = have_obj(pos, 'wall');
    //     if(wall != null){
    //         var points = wall.getPoints();
    //         var x = (points[0].x + points[1].x) / 2;
    //         var y = (points[0].y + points[1].y) / 2;
    //         var p = {x: x, y: y};
    //         var w = create_wall([p, points[1]], g_2d.house);
    //         wall.setPoints([points[0], p]);
    //         g_2d.house.points.push(p);
    //         var corner = create_corner(p, g_2d.house);

    //         var pwall = points[1];
    //         var room = g_2d.house.rooms[0];
    //         var ps = room.getPoints();
    //         var index = ps.indexOf(pwall);

    //         ps.splice(index, 0, p);
    //     }
    // }
}

function onCanvasMouseUp(event){
    var pos = g_2d.stage.getUserPosition();
    if(g_2d.cmd != null){
        g_2d.cmd.mouseup(pos);
    }
    g_2d.cmd = null;
    // if(g_2d.current_cmd == CMDS.normal){
    //     //TODO show anchor when selected, hide when select others
    //     var objs = g_2d.layer.getIntersections(pos);
    //     for(var i = 0; i < objs.length; i++){
    //         console.log(objs[i].getName());
    //     }
    //     var obj = have_obj(pos, 'furniture');
    //     if(g_2d.selected_obj.getName() == 'furniture_group'){
    //         hide_anchors(g_2d.selected_obj);
    //     }
    //     if(obj != null){
    //         show_anchors(obj.getParent());
    //         g_2d.selected_obj == obj.getParent();
    //     }
    //     return;
    // }
    // if(g_2d.current_cmd == CMDS.add_room){
    //     if(g_2d.current_obj == null){
    //         return;
    //     }
    //     var points = g_2d.current_obj.getPoints();
    //     if(Math.abs(points[0].x - points[2].x) < 10 ||
    //       Math.abs(points[0].x - points[2].y) < 10){
    //         g_2d.current_obj.destroy();
    //         g_2d.layer.draw();
    //     }else{
    //         update_corners(g_2d.current_obj);
    //         g_2d.layer.draw();
    //     }
    //     g_2d.house.setDraggable(true);
    // }else if(g_2d.current_cmd == CMDS.add_furniture){
    //     if(g_2d.selected_obj != null &&
    //        g_2d.selected_obj.getName() == 'furniture_group'){
    //         hide_anchors(g_2d.selected_obj);
    //     }
    //     show_anchors(g_2d.current_obj);
    //     g_2d.furnitures.push(g_2d.current_obj);
    // }
    // g_2d.current_cmd = CMDS.normal;
    // g_2d.selected_obj = g_2d.current_obj;
    // g_2d.current_obj = null;
}

function onCanvasMouseMove(event){
    var pos = g_2d.stage.getUserPosition();
    if(pos == null){
        return;
    }
    if(g_2d.cmd != null){
        g_2d.cmd.mousemove(pos);
    }

    // if(g_2d.current_cmd == CMDS.add_room && g_2d.current_obj != null){
    //     var points = g_2d.current_obj.getPoints();
    //     points[1].x = pos.x;
    //     points[2].x = pos.x;
    //     points[2].y = pos.y;
    //     points[3].y = pos.y;
    //     g_2d.current_obj.setPoints(points);
    //     g_2d.layer.draw();
    // }
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
