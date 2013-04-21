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
function AddFurnitureCommand(){

}
AddFurnitureCommand.prototype = Object.create(BaseCommand.prototype, {
    mousedown : {
        value: function(pos){
            var furniture = new Furniture(pos);
            g_2d.furnitures.push(furniture);
            this.obj = furniture;
            // if(g_2d.current_obj && 'hide_anchors' in g_2d.current_obj){
            //     g_2d.current_obj.hide_anchors();
            // }
            g_2d.current_obj = furniture;
            g_2d.layer.add(furniture);
            g_2d.layer.draw();
        }
    }
});

//add room command
function AddRoomCommand(){
    this.obj = null;
}
AddRoomCommand.prototype = Object.create(BaseCommand.prototype, {
    _init_room : {
        value : function(pos){
            var house = g_2d.house;
            var topleft, topright;
            var bottomleft, bottomright;
            var points;

            topleft = pos;
            topright = {x:pos.x+1, y:pos.y};
            bottomright = {x:pos.x+1, y:pos.y+1};
            bottomleft = {x:pos.x, y:pos.y+1};
            points = [topleft, topright,
                      bottomright, bottomleft];
            house.points.push(topleft);
            house.points.push(topright);
            house.points.push(bottomright);
            house.points.push(bottomleft);
            g_2d.current_obj = create_room(points, house);
            g_2d.layer.add(house);
            g_2d.layer.draw();
            return g_2d.current_obj;
        }
    },
    mousedown : {
        value : function(pos){
            if(g_2d.house == null){
                g_2d.house = create_house_group();
            }

            if(g_2d.house.rooms.length == 0){
                this.obj = this._init_room(pos);
            }else{
                //to add another room, mouse pos should be on a corner
                var corner = have_obj(pos, 'corner');
                if(corner != null){
                    this.startCorner = corner;
                    this.obj = this._init_room(corner.getPosition());
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
                g_2d.current_obj.setPoints(points);
                g_2d.layer.draw();
            }
        }
    },
    mouseup : {
        value : function(pos){
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
                    points[j].corner.destroy();
                }
                this.obj.destroy();
                g_2d.layer.draw();
                return;
            }

            if(house.rooms.length > 0){
                for(var i = 0; i < this.obj.walls.length; i++){
                    var w1 = this.obj.walls[i];
                    var points1 = w1.getPoints();
                    for(var j = 0; j < house.walls.length; j++){
                        //if wall overlaped, merge
                        var w2 = house.walls[j];
                        var points2 = w2.getPoints();
                        var share_p;
                        if(distance(points1[0], points2[0]) == 0){
                            share_p = [0, 0];
                        }
                        else if(distance(points1[1], points2[0]) == 0){
                            share_p = [1, 0];
                        }
                        else if(distance(points1[0], points2[1]) == 0){
                            share_p = [0, 1];
                        }
                        else if(distance(points1[1], points2[1]) == 0){
                            share_p = [1, 1];
                        }
                        else{
                            //no share points;
                            //next
                            continue;
                        }
                        var map = function(points1, points2){
                            if(distance(points1[0],
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
                            // if(w1.compare(w2) == 0){
                            //     replace_wall(w1, w2,
                            //                 map(w1.getPoints(),
                            //                    w2.getPoints()));
                            // }else{
                            //     replace_wall(w3, w2,
                            //                  map(w3.getPoints(),
                            //                     w2.getPoints()));
                            // }

                        }
                    }
                }
            }
            house.rooms.push(this.obj);
            var walls = this.obj.walls;
            for(var i = 0; i < walls.length; i++){
                house.walls.push(walls[i]);
            }

            for(var j = 0; j < points.length; j++){
                house.points.push(points[j]);
            }
            update_corners(this.obj);
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

               var diret = wall_direction(wall);
               pos = intersection_pos_wall(pos, wall);
               this.obj = create_door(pos.x, pos.y, diret, g_2d.house);
               wall.doors.push(this.obj);
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
            split_wall(wall, pos);
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

            var a = x1*x2 + y1*y2;
            var b =  Math.sqrt((x1*x1+y1*y1)*(x2*x2+y2*y2));
            var v = a / b;
            var d = Math.acos(v);

            var deg = d / Math.PI * 180;
            this.obj.rotateDeg(deg);
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

            points[0].corner.setPosition(points[0]);
            points[1].corner.setPosition(points[1]);

            //update doors and windows on this wall
            for(var i = 0; i < wall.doors.length; i++){
                var door = wall.doors[i];
                var x = door.getX();
                var y = door.getY();
                door.setPosition(x+deltax, y+deltay);
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
