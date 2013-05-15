function BaseCommand(){

}

BaseCommand.prototype = {
    mousedown : function(pos){},
    mousemove : function(pos){},
    mouseup : function(pos){},
    undo : function(){
        alert("undo error");
    },
    redo : function(){
        alert("redo error");
    }
};

//add furniture command
function AddFurnitureCommand(element){
    this.element = element;
}
AddFurnitureCommand.prototype = Object.create(BaseCommand.prototype, {
    mousedown : {
        value: function(pos){
            var url = this.element.getAttribute('data-icon-url');
            var img = new Image();
            img.src = url;
            var element = this.element;
            img.onload = function(){
                var furniture = new Two.Furniture(img, pos, 50, 50, 0);
                furniture.element = element;
                this.obj = furniture;
                if(g_2d.current_obj && 'hide_anchors' in g_2d.current_obj){
                    g_2d.current_obj.hide_anchors();
                }
                g_2d.current_obj = furniture;
                g_2d.layer.add(furniture);
                g_2d.layer.draw();

            };
        }
    }
});

//add room command
function AddRoomCommand(){
    this.obj = null;
}
AddRoomCommand.prototype = Object.create(BaseCommand.prototype, {
    _init_room : {
        value : function(corner){
            var house = g_2d.house;
            var topleft, topright;
            var bottomleft, bottomright;
            var points;

            topleft = corner;
            topright = new Two.Corner(corner.x+1, corner.y);
            house.add(topright);
            bottomright = new Two.Corner(corner.x+1, corner.y+1);
            house.add(bottomright);
            bottomleft = new Two.Corner(corner.x, corner.y+1);
            house.add(bottomleft);
            points = [topleft, topright,
                      bottomright, bottomleft];

            g_2d.current_obj = new Two.Room(points, house);
            g_2d.layer.draw();
            return g_2d.current_obj;
        }
    },
    mousedown : {
        value : function(pos){
//            g_2d.stage.setDraggable(false);
            var rooms = g_2d.house.get('.room');
            if(rooms.length == 0){
                var corner = new Two.Corner(pos.x, pos.y);
                g_2d.house.add(corner);
                this.obj = this._init_room(corner);
            }else{
                //to add another room, mouse pos should be on a corner
                var corner = have_obj(pos, 'corner');
                if(corner != null){
                    this.startCorner = corner;
                    this.obj = this._init_room(corner);
                }
            }
        }
    },
    mousemove : {
        value : function(pos){
            if(this.obj != null){
                var points = this.obj.getPoints();
                points[1].x = pos.x;
                points[2].x = pos.x;
                points[2].y = pos.y;
                points[3].y = pos.y;
                g_2d.layer.draw();
            }
        }
    },
    mouseup : {
        value : function(pos){
//            g_2d.stage.setDraggable(true);
            if(g_2d.current_obj == null){
                return;
            }
            var points = this.obj.getPoints();
            var house = g_2d.house;
            if(Math.abs(points[0].x - points[2].x) < 10 ||
               Math.abs(points[0].x - points[2].y) < 10){
                //clean room
                var walls = this.obj.walls;
                for(var i = 0; i < walls.length; i++){
                    walls[i].lengthMark.destroy();
                    walls[i].destroy();
                }

                for(var j = 0; j < points.length; j++){
                    points[j].destroy();
                }
                this.obj.destroy();
                g_2d.layer.draw();
                return;
            }

            var rooms = house.get('.room');
            var hwalls = house.get('.wall');

            if(rooms.length > 1){
                for(var i = 0; i < this.obj.walls.length; i++){
                    var w1 = this.obj.walls[i];
                    var points1 = w1.getPoints();
                    for(var j = 0; j < hwalls.length; j++){
                        //if wall overlaped, merge
                        var w2 = hwalls[j];
                        if(this.obj.walls.indexOf(w2) != -1){
                            continue;
                        }
                        var points2 = w2.getPoints();
                        var share_p;
                        if(Two.distance(points1[0], points2[0]) == 0){
                            share_p = [0, 0];
                        }
                        else if(Two.distance(points1[1], points2[0]) == 0){
                            share_p = [1, 0];
                        }
                        else if(Two.distance(points1[0], points2[1]) == 0){
                            share_p = [0, 1];
                        }
                        else if(Two.distance(points1[1], points2[1]) == 0){
                            share_p = [1, 1];
                        }
                        else{
                            //no share points;
                            //next
                            continue;
                        }
                        var map = function(points1, points2){
                            if(Two.distance(points1[0],
                                        points2[0]) == 0){
                                return [0, 1];
                            }
                            else{
                                return [1, 0];
                            }
                        };

                        if(w2.intersects(points1[1-share_p[0]])){
                            //w1 in w2
                            var p = points1[1-share_p[0]];
                            var w3 = split_wall(w2, p);
                            g_2d.house.add(w3);
                            if(w2.compare(w1) == 0){
                                replace_wall(w2, w1,
                                            map(w2.getPoints(),
                                               w1.getPoints()));
                            }else{
                                replace_wall(w3, w1,
                                             map(w3.getPoints(),
                                                w1.getPoints()));
                            }
                        }
                        else if(w1.intersects(points2[1-share_p[1]])){
                            //w2 in w1
                            var p = points2[1-share_p[1]];
                            var w3 = split_wall(w1, p);
                            g_2d.house.add(w3);
                            if(w1.compare(w2) == 0){
                                replace_wall(w1, w2,
                                            map(w1.getPoints(),
                                               w2.getPoints()));
                            }else{
                                replace_wall(w3, w2,
                                             map(w3.getPoints(),
                                                w2.getPoints()));
                            }

                        }
                    }
                }
            }
            g_2d.layer.draw();
        }
    }
});

//add door command
function AddDoorCommand(){

}
AddDoorCommand.prototype = Object.create(BaseCommand.prototype, {
   mousedown : {
       value : function(pos){
           if(g_2d.house == null){
               return;
           }
           var wall = have_obj(pos, 'wall');
           if(wall != null){
               var diret = wall.direction();
               pos = Two.intersection_pos_wall(pos, wall);
               this.obj = new Two.Door(pos.x, pos.y, diret);
               g_2d.house.add(this.obj);
               wall.doors.push(this.obj);
               this.obj.wall = wall;
               g_2d.layer.draw();
           }
       }
   }
});

function AddWindowCommand(){

}
AddWindowCommand.prototype = Object.create(BaseCommand.prototype, {
   mousedown : {
       value : function(pos){
           if(g_2d.house == null){
               return;
           }
           var wall = have_obj(pos, 'wall');
           if(wall != null){
               var diret = wall.direction();
               pos = Two.intersection_pos_wall(pos, wall);
               this.obj = new Two.Window(pos.x, pos.y, diret);
               g_2d.house.add(this.obj);
               wall.windows.push(this.obj);
               this.obj.wall = wall;
               g_2d.layer.draw();
           }
       }
   }

});
//move obj command
function MoveCommand(obj){
    this.obj = obj;
}
MoveCommand.prototype = Object.create(BaseCommand.prototype, {

});

//resize command
function ResizeCommand(obj){

}
ResizeCommand.prototype = Object.create(BaseCommand.prototype, {

});

function SplitWallCommand(){

}
SplitWallCommand.prototype = Object.create(BaseCommand.prototype, {
    mouseup : {
        value : function(pos){
            var wall = have_obj(pos, 'wall');
            var pos = Two.intersection_pos_wall(pos, wall);
            var corner = new Two.Corner(pos.x, pos.y);
            g_2d.house.add(corner);
            var new_wall = split_wall(wall, corner);
            g_2d.house.add(new_wall);
        }
    }
});

function RotationCommand(anchor){
    this.anchor = anchor;
    this.obj = anchor.getParent();
}

RotationCommand.prototype = Object.create(BaseCommand.prototype, {
    mousedown : {
        value : function(pos){
//            g_2d.stage.setDraggable(false);
            this.startPos = this.anchor.getPosition();
            this.prePos = this.startPos;
            this.center = this.obj.getOffset();
            this.obj.setDraggable(false);
        }
    },
    mousemove : {
        value : function(pos){
            this.rotate(pos);
            this.obj.getParent().draw();
        }
    },
    mouseup : {
      value : function(pos){
//          g_2d.stage.setDraggable(true);
          this.rotate(pos);
          this.obj.getParent().draw();
          this.endPos = pos;
          this.obj.setDraggable(true);
      }
    },
    rotate : {
        value : function(pos){
            //change absolute pos to relative pos;
            pos.x = pos.x - this.obj.getX() + this.center.x;
            pos.y = pos.y - this.obj.getY() + this.center.y;

            var x1 = this.prePos.x - this.center.x;
            var y1 = this.prePos.y - this.center.y;
            var x2 = pos.x - this.center.x;
            var y2 = pos.y - this.center.y;

            var deg1 = Math.atan2(y1, x1);
            var deg2 = Math.atan2(y2, x2);
            this.obj.rotate(deg2-deg1);
            this.prePos = pos;
        }
    }
});

function DragWallCommand(wall){
    this.obj = wall;
}

DragWallCommand.prototype = Object.create(BaseCommand.prototype, {
    _update_house : {
        value : function(){
            var wall = this.obj;
            var position = wall.getPosition();

            var deltax = position.x - this.prePos.x;
            var deltay = position.y - this.prePos.y;

            var points = wall.getPoints();
            points[0].x += deltax;
            points[0].y += deltay;
            points[1].x += deltax;
            points[1].y += deltay;
            wall.setPoints(points);

            this.prePos = wall.getPosition();
            wall.setPosition(0, 0);

            //update doors and windows on this wall
            for(var i = 0; i < wall.doors.length; i++){
                var door = wall.doors[i];
                var x = door.getX();
                var y = door.getY();
                door.setPosition(x+deltax, y+deltay);
            }
            for(var i = 0; i < wall.windows.length; i++){
                var window = wall.windows[i];
                var x = window.getX();
                var y = window.getY();
                window.setPosition(x+deltax, y+deltay);
            }
        }
    },
    mousedown : {
        value : function(pos){
            this.startPos = this.obj.getPosition();
            this.prePos = this.startPos;

            var points = this.obj.getPoints();
            var x1 = points[0].x - points[1].x;
            var y1 = points[0].y - points[1].y;
            //test if need to add new walls
            // var result = false;
            // for(var i = 0; i < this.obj.corners.length; i++){
            //     var corner = this.obj.corners[i];
            //     for(var j = 0; j < corner.walls.length; j++){
            //         var wall = corner.walls[i];
            //         if(wall == this.obj){
            //             continue;
            //         }

            //         //if two wall vertical, no need to add new wall
            //         points = wall.getPoints();
            //         var x2 = points[0].x - points[1].x;
            //         var y2 = points[0].y - points[1].y;
            //         var r = x1*x2 + y1*y2;
            //         if(r != 0){
            //             result = true;
            //             break;
            //         }
            //     }

            //     if(result){
            //         //add temp wall
            //         var x = corner.getX();
            //         var y = corner.getY();

            //     }
            //result = false;
//            }
        }
    },
    mousemove : {
        value : function(pos){
            this._update_house();
            var layer = this.obj.getLayer();
            layer.draw();
        }
    },
    mouseup : {
        value : function(pos){

        }
    }
});

function DragDoorWindowCommand(obj){
    this.obj = obj;
    this.startPos = null;
    this.lastPos = null;
}

DragDoorWindowCommand.prototype = Object.create(BaseCommand.prototype, {
    mousedown: {
        value: function(pos){
            this.startPos = obj.getPosition();
            this.lastPos = this.startPos;
            this.obj.moveToTop();
        }
    },
    mousemove: {
        value: function(pos){
            if(this.obj.wall == null){
                var wall = have_obj(pos, 'wall');
                if(wall != null){
                    var diret = wall.direction();
                    this.obj.setRotationDeg(diret);
                    pos = Two.intersection_pos_wall(pos, wall);
                    if(this.obj.getName() == 'door'){
                        wall.doors.push(this.obj);                                       }
                    else{
                        wall.windows.push(this.obj);
                    }
                    this.obj.wall = wall;
                }
            }
            else{
                this.lastPos = pos;
            }
        }
    },
    mouseup: {
        value: function(pos){

        }
    }
});

function DeleteCommand(){

}
DeleteCommand.prototype = Object.create(BaseCommand.prototype, {
    mouseup : {
        value: function(pos){
            var objs = g_2d.layer.getIntersections(pos);
            if(objs.length == 0){
                return;
            }

            var getObjs = function(name, objs){
                var g = [];
                for(var i = 0; i < objs.length; i++){
                    var obj = objs[i];
                    if(obj.getName() == name){
                        g.push(obj);
                    }
                }
                return g;
            };
            var obj = null;
            var targets = getObjs('furniture', objs);
            if(targets.length > 0){
                obj = targets[0];
                var g = obj.getParent();
                g.remove();
                g_2d.layer.draw();
                g_2d.current_obj = null;
                return;
            }

            targets = getObjs('door', objs);
            if(targets.length > 0){
                obj = targets[0];
                var wall = obj.wall;
                var index = wall.doors.indexOf(obj);
                wall.doors.splice(index, 1);
                obj.remove();
                g_2d.layer.draw();
                return;
            }

            targets = getObjs('window', objs);
            if(targets.length > 0){
                obj = targets[0];
                var wall = obj.wall;
                var index = wall.windows.indexOf(obj);
                wall.windows.splice(index, 1);
                obj.remove();
                g_2d.layer.draw();
                return;
            }

            targets = getObjs('room', objs);
            if(targets.length > 0){
                obj = targets[0];
                for(var i = 0; i < obj.walls.length; i++){
                    var wall = obj.walls[i];
                    if(wall.rooms.length == 1){
                        wall.remove();
                    }
                }
                var rooms = g_2d.house.get('.room');
                var corners = obj.getPoints();
                for(var i = 0; i < corners.length; i++){
                    var c = corners[i];
                    var shared = false;
                    for(var j = 0; j < rooms.length; j++){
                        var r = rooms[j];
                        if(r == obj){
                            break;
                        }
                        var points = r.getPoints();
                        if(points.indexOf(c) != -1){
                            shared = true;
                            break;
                        }
                    }
                    if(!shared){
                        c.remove();
                    }
                }
                obj.remove();

                var rooms = g_2d.house.get('.room');
                for(var i = 0; i < rooms.length; i++){
                    var room = rooms[i];
                    for(var j = 0; j < room.walls.length; j++){
                        var wall = room.walls[j];
                        var next_wall = room.walls[(j+1)%room.walls.length];
                        var d1 = wall.direction();
                        var d2 = next_wall.direction();
                        if(d1 == d2 ||
                          Math.abs(d1-d2) == 180){
                            merge_walls(wall, next_wall);
                            break;
                        }
                    }
                }
                g_2d.layer.draw();
            }
        }
    }
});
