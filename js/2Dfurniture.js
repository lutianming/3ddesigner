function Furniture(pos){
    Kinetic.Group.call(this, {
        name: 'furniture_group',
        offset: [25, 25],
        draggable: true
    });
    this.type = 'furniture';

    var obj = new Kinetic.Rect({
        name: 'furniture',
        x: pos.x,
        y: pos.y,
        width: 50,
        height: 50,
        fill: 'green'
    });
    this.add(obj);
    this.furniture = obj;
    var height = obj.getHeight();
    var width = obj.getWidth();
    var w = 10;
    this.topleft = create_anchor(pos.x, pos.y,
                                -w, -w,
                                'topleft', this);
    this.topright = create_anchor(pos.x+width, pos.y,
                                 w, -w,
                                 'topright', this);
    this.bottomright = create_anchor(pos.x+width, pos.y+height,
                                    w, w,
                                    'bottomright', this);
    this.bottomleft = create_anchor(pos.x, pos.y+height,
                                   -w, w,
                                   'bottomleft', this);

    var p_center = function(p1, p2){
        var x = (p1.x + p2.x) / 2;
        var y = (p1.y + p2.y) / 2;
        return {x: x, y: y};
    };

    var ptop = p_center(this.topleft.getPosition(),
                        this.topright.getPosition());
    var pright = p_center(this.topright.getPosition(),
                          this.bottomright.getPosition());
    var pbottom = p_center(this.bottomleft.getPosition(),
                           this.bottomright.getPosition());
    var pleft = p_center(this.topleft.getPosition(),
                         this.bottomleft.getPosition());

    this.top = create_rotate_anchor(ptop.x, ptop.y, 'top', this);
    this.right = create_rotate_anchor(pright.x, pright.y, 'right', this);
    this.bottom = create_rotate_anchor(pbottom.x, pbottom.y, 'bottom', this);
    this.left = create_rotate_anchor(pleft.x, pleft.y, 'left', this);
}

Furniture.prototype = Object.create(Kinetic.Group.prototype, {
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
            this.draw();
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
            this.draw();
        }
    }
});

function update_furniture(anchor){
    var obj = anchor.getParent();

    var x = anchor.getX();
    var y = anchor.getY();

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

    var furniture = obj.furniture;
    furniture.setPosition(obj.topleft.getPosition());
    var width = obj.topright.getX() - obj.topleft.getX();
    var height = obj.bottomleft.getY() - obj.topleft.getY();
    if (width && height){
        furniture.setSize(width, height);
    }
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
function create_anchor(x, y, width, height, name, group){
    var anchor = new Kinetic.Circle({
        name: name,
        x: x,
        y: y,
        radius: 4,
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

function create_rotate_anchor(x, y, name, furniture){
    var anchor = new Kinetic.Circle({
        name : 'rotate_anchor',
        x: x,
        y: y,
        radius: 4,
        fill: 'black',
        draggable: true,
        dragBoundFunc: function(pos){
            var p = furniture.getPosition();
            var offset = furniture.getOffset();
            var center = {x: p.x + offset.x, y: p.y + offset.y};
            var l = distance(center, pos);
            var r = this.getRadius();
            var rate = r/l;
            var x = center.x + (pos.x - center.x) * r;
            var y = center.y + (pos.y - center.y) * r;
            return {x: x, y: y};
        }
    });

    anchor.on('dragstart', function(){

    });
    anchor.on('dragmove', function(){

    });
    anchor.on('dragend', function(){

    });
    anchor.on('mouseover', function(){

    });
    anchor.on('mouseout', function(){

    });
    furniture.add(anchor);
    return anchor;
}
