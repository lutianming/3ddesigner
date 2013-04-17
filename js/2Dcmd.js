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

}
AddRoomCommand.prototype = Object.create(BaseCommand.prototype, {
    mousedown : {
        value : function(pos){
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
                    //            g_2d.stage.setDraggable(false);
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

                    //test insert wall
                    insert_wall(g_2d.house.rooms[0],
                                g_2d.house.rooms[1].walls[3],
                                [1,0],1);
                }
            }
            this.obj = g_2d.current_obj;
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
            //    var points = g_2d.current_obj.getPoints();
            if(Math.abs(points[0].x - points[2].x) < 10 ||
               Math.abs(points[0].x - points[2].y) < 10){
                g_2d.current_obj.destroy();
                g_2d.layer.draw();
            }else{
                update_corners(g_2d.current_obj);
                g_2d.layer.draw();
            }
            //    g_2d.house.setDraggable(true);
            //    g_2d.stage.setDraggable(true);
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

function RotationCommand(obj){
    this.obj = obj;
}

RotationCommand.prototype = Object.create(BaseCommand.prototype, {
    mousedown : {
        value : function(pos){
            this.startPos = pos;
            this.prePos = pos;

            var furniture = this.obj.furniture;
            this.center = furniture.getPosition();
            this.obj.setDraggable(false);
        }
    },
    mousemove : {
        value : function(pos){
            this.rotate(pos);
            this.obj.getParent().draw();
            console.log(this.obj.topleft.getAbsolutePosition());
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
            var x1 = this.prePos.x - this.center.x;
            var y1 = this.prePos.y - this.center.y;
            var x2 = pos.x - this.center.x;
            var y2 = pos.y - this.center.y;

            var a = x1*x2 + y1*y2;
            var b =  Math.sqrt((x1*x1+y1*y1)*(x2*x2+y2*y2));
            var v = a / b;
            var d = Math.acos(v);

            var deg = d / Math.PI * 180;
            this.obj.rotate(deg);
            this.prePos = pos;
        }
    }
});
