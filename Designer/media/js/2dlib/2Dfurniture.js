function center_point(p1, p2){
    var x = (p1.x + p2.x) / 2;
    var y = (p1.y + p2.y) / 2;
    return {x: x, y: y};
};


Two.Furniture = function (img, pos, width, height, rotation){
    Kinetic.Group.call(this, {
        name: 'furniture_group',
        offset: [width/2, height/2],
        rotation: rotation,
        draggable: true
    });
    this.type = 'furniture';
    this.setPosition(pos);
    pos.x = 0;
    pos.y = 0;

    var obj = new Kinetic.Image({
        name: 'furniture',
        x: pos.x,
        y: pos.y,
        width: width,
        height: height,
        image: img
    });

    this.add(obj);
    this.furniture = obj;

    var w = 10;
    this.topleft = create_anchor(pos.x, pos.y,
                                -w, -w,
                                'topleft', this, 'red');
    this.topright = create_anchor(pos.x+width, pos.y,
                                 w, -w,
                                 'topright', this, 'black');
    this.bottomright = create_anchor(pos.x+width, pos.y+height,
                                    w, w,
                                    'bottomright', this, 'blue');
    this.bottomleft = create_anchor(pos.x, pos.y+height,
                                   -w, w,
                                   'bottomleft', this, 'black');

    var ptop = center_point(this.topleft.getPosition(),
                        this.topright.getPosition());
    var pright = center_point(this.topright.getPosition(),
                          this.bottomright.getPosition());
    var pbottom = center_point(this.bottomleft.getPosition(),
                           this.bottomright.getPosition());
    var pleft = center_point(this.topleft.getPosition(),
                         this.bottomleft.getPosition());

    this.top = create_rotate_anchor(ptop.x, ptop.y, 'top', this);
    this.right = create_rotate_anchor(pright.x, pright.y, 'right', this);
    this.bottom = create_rotate_anchor(pbottom.x, pbottom.y, 'bottom', this);
    this.left = create_rotate_anchor(pleft.x, pleft.y, 'left', this);
};

Two.Furniture.prototype = Object.create(Kinetic.Group.prototype, {
    hide_anchors : {
        value : function(){
            this.topleft.hide();
            this.topright.hide();
            this.bottomright.hide();
            this.bottomleft.hide();

            this.top.hide();
            this.right.hide();
            this.bottom.hide();
            this.left.hide();
            this.getParent().draw();
        }
    },
    show_anchors : {
        value : function(){
            this.topleft.show();
            this.topright.show();
            this.bottomright.show();
            this.bottomleft.show();

            this.top.show();
            this.right.show();
            this.bottom.show();
            this.left.show();
            this.getParent().draw();
        }
    }
});

function update_furniture(anchor){
    var obj = anchor.getParent();

    var x = anchor.getX();
    var y = anchor.getY();

    var topleft = obj.topleft.getPosition();
    var topright = obj.topright.getPosition();
    var bottomleft = obj.bottomleft.getPosition();
    var bottomright = obj.bottomright.getPosition();

    switch(anchor.getName()){
    case 'topleft':
        obj.topright.setY(y);
        obj.bottomleft.setX(x);
        break;
    case 'topright':
        obj.topleft.setY(y);
        obj.bottomright.setX(x);
        break;
    case 'bottomright':
        obj.topright.setX(x);
        obj.bottomleft.setY(y);
        break;
    case 'bottomleft':
        obj.topleft.setX(x);
        obj.bottomright.setY(y);
        break;
    default:
        break;
    }

    //force topleft to be at (0,0)
    var deltax = -obj.topleft.getX();
    var deltay = -obj.topleft.getY();

    obj.topright.move(deltax, deltay);
    obj.bottomleft.move(deltax, deltay);
    obj.bottomright.move(deltax, deltay);
    obj.topleft.move(deltax, deltay);

    var center = center_point(topleft, topright);
    obj.top.setPosition(center);
    center = center_point(bottomleft, bottomright);
    obj.bottom.setPosition(center);
    center = center_point(topleft, bottomleft);
    obj.left.setPosition(center);
    center = center_point(topright, bottomright);
    obj.right.setPosition(center);

    var furniture = obj.furniture;
    furniture.setPosition(obj.topleft.getPosition());
    var width = obj.topright.getX() - obj.topleft.getX();
    var height = obj.bottomleft.getY() - obj.topleft.getY();
    if (width && height){
        furniture.setSize(width, height);
    }

    var offset = obj.getOffset();
    var dx = width/2 - offset.x;
    var dy = height/2 - offset.y;
   obj.move(-deltax + dx, -deltay + dy);
   obj.setOffset(width/2, height/2);
}

function Anchor(x, y, width, height, name, furniture){
    Kinetic.Rect.call(this, {
        name: name,
        x: x,
        y: y,
        width: width,
        height: height,
        fill: 'black',
        draggable: true,
        dragOnTop: false
    });
    this.on('dragmove', function() {
        update_furniture(this);
        var layer = this.getLayer();
        layer.draw();
    });
    this.on('mousedown touchstart', function() {
//        group.setDraggable(false);
        this.moveToTop();
    });
    this.on('dragend', function() {
        var layer = this.getLayer();
//        group.setDraggable(true);
        layer.draw();
    });
    // add hover styling
    this.on('mouseover', function() {
        var layer = this.getLayer();
        document.body.style.cursor = 'pointer';
        layer.draw();
    });
    this.on('mouseout', function() {
        var layer = this.getLayer();
        document.body.style.cursor = 'default';
        layer.draw();
    });
    furniture.add(this);
}

Anchor.prototype = Object.create(Kinetic.Rect, {
    update_furniture : {
        value : function(){
            var group = this.getParent();

            var x = this.getX();
            var y = this.getY();
            var obj = group.furniture;
            switch(this.getName()){
            case 'topleft':
                obj.topright.setY(y);
                obj.bottomleft.setX(x);
                break;
            case 'topright':
                obj.topleft.setY(y);
                obj.bottomright.setX(x);
                break;
            case 'bottomright':
                obj.topright.setX(x);
                obj.bottomleft.setY(y);
                break;
            case 'bottomleft':
                obj.topleft.setX(x);
                obj.bottomright.setY(y);
                break;
            default:
                break;
            }

            obj.setPosition(obj.topleft.getPosition());
            var width = obj.topright.getX() - obj.topleft.getX();
            var height = obj.bottomleft.getY() - obj.topleft.getY();
            if (width && height){
                obj.setSize(width, height);
            }

        }
    }
});

function create_anchor(x, y, width, height, name, group, fill){
    var anchor = new Kinetic.Circle({
        name: name,
        x: x,
        y: y,
        radius: 4,
        fill: fill,
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

function create_rotate_anchor(x, y, name, furniture){
    var anchor = new Kinetic.Circle({
        name : 'rotate_anchor',
        x: x,
        y: y,
        radius: 4,
        fill: 'black'
    });
    anchor.mousehold = false;
    anchor.on('dragstart', function(){

    });
    anchor.on('dragmove', function(){

    });
    anchor.on('dragend', function(){

    });
    anchor.on('mouseover', function(){
        document.body.style.cursor = 'pointer';

    });
    anchor.on('mouseout', function(){
        document.body.style.cursor = 'default';
    });
    anchor.on('mousedown', function(){
        this.mousehold = true;
        g_2d.cmd = new RotationCommand(this);
        g_2d.cmd.mousedown(g_2d.stage.getPointerPosition());
    });
    anchor.on('mousemove', function(){
        if(this.mousehold){

        }

    });
    anchor.on('mouseup', function(){

    });
    furniture.add(anchor);
    return anchor;
}
