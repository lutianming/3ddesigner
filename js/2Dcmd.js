function BaseCommand(){

}

BaseCommand.prototype.mousedown = function(pos){

}

BaseCommand.prototype.mousemove = function(){

}

BaseCommand.prototype.mouseup = function(pos){

}
BaseCommand.prototype.undo = function(){
    alert("undo error");
}

BaseCommand.prototype.redo = function(){
    alert("redo error");
}

//add furniture command
function AddFurnitureCommand(){

}
AddFurnitureCommand.prototype = new BaseCommand();
AddFurnitureCommand.prototype.mousedown = function(pos){
    var furniture = create_furniture(pos);
    this.obj = furniture;
    g_2d.current_obj = furniture;
    g_2d.layer.add(furniture);
    g_2d.layer.draw();
}

//add room command
function AddRoomCommand(){

}
AddRoomCommand.prototype = new BaseCommand();
AddRoomCommand.prototype.mousedown = function(pos){
    if(g_2d.house == null){
        g_2d.house = create_house_group();
    }
    var house = g_2d.house;
    if(g_2d.house.rooms.length == 0){
        var topleft = pos;
        var topright = {x:pos.x+1, y:pos.y};
        var bottomright = {x:pos.x+1, y:pos.y+1};
        var bottomleft = {x:pos.x, y:pos.y+1};
        var points = [topleft, topright,
                      bottomright, bottomleft];
        house.points.push(topleft);
        house.points.push(topright);
        house.points.push(bottomright);
        house.points.push(bottomleft);
        g_2d.current_obj = create_room(points, house);
        g_2d.layer.add(house);
        g_2d.layer.draw();
    }else{
        //to add another room, mouse pos should be on a corner
        var corner = have_obj(pos, 'corner');
        if(corner != null){
            house.setDraggable(false);
            var pos = corner.getPosition();
            var topleft = pos;
            var topright = {x:pos.x+1, y:pos.y};
            var bottomright = {x:pos.x+1, y:pos.y+1};
            var bottomleft = {x:pos.x, y:pos.y+1};
            var points = [topleft, topright,
                          bottomright, bottomleft];
            house.points.push(topleft);
            house.points.push(topright);
            house.points.push(bottomright);
            house.points.push(bottomleft);
            g_2d.current_obj = create_room(points, house);
            g_2d.layer.draw();
        }
    }
    this.obj = g_2d.current_obj;
}
AddRoomCommand.prototype.mousemove = function(pos){
    if(this.obj != null){
        var points = this.obj.getPoints();
        points[1].x = pos.x;
        points[2].x = pos.x;
        points[2].y = pos.y;
        points[3].y = pos.y;
        g_2d.current_obj.setPoints(points);
        g_2d.layer.draw();
    }
}
AddRoomCommand.prototype.mouseup = function(pos){
    if(g_2d.current_obj == null){
        return;
    }
    var points = this.obj.getPoints();
//    var points = g_2d.current_obj.getPoints();
    if(Math.abs(points[0].x - points[2].x) < 10 ||
       Math.abs(points[0].x - points[2].y) < 10){
        g_2d.current_obj.destroy();
        g_2d.layer.draw();
    }else{
        update_corners(g_2d.current_obj);
        g_2d.layer.draw();
    }
    g_2d.house.setDraggable(true);
}

//add door command
function AddDoorCommand(){

}
AddDoorCommand.prototype = new BaseCommand();
AddDoorCommand.prototype.mousedown = function(pos){
    if(g_2d.house == null){
        return;
    }
    this.obj = create_door(pos.x, pos.y, 90, g_2d.house);
    g_2d.layer.draw();
}
AddDoorCommand.prototype.mousemove = function(pos){

}
AddDoorCommand.prototype.mouseup = function(pos){

}

//move obj command
function MoveCommand(obj){
    this.obj = obj;
}
MoveCommand.prototype = new BaseCommand();
MoveCommand.prototype.mousedown = function(pos){

}
MoveCommand.prototype.mouseup = function(pos){

}

//resize command
function ResizeCommand(obj){

}
ResizeCommand.prototype = new BaseCommand();
ResizeCommand.prototype.mousedown = function(pos){

}
ResizeCommand.prototype.mouseup = function(pos){

}
