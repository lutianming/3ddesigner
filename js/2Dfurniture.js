function update_furniture(anchor){
    var group = anchor.getParent();

    // var topleft = group.get('.topleft')[0];
    // var topright = group.get('.topright')[0];
    // var bottomright = group.get('.bottomright')[0];
    // var bottomleft = group.get('.bottomleft')[0];
//    var obj = group.get('.funiture')[0];

    var x = anchor.getX();
    var y = anchor.getY();
    var obj = group.furniture;
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

    obj.setPosition(obj.topleft.getPosition());
    var width = obj.topright.getX() - obj.topleft.getX();
    var height = obj.bottomleft.getY() - obj.topleft.getY();
    if (width && height){
        obj.setSize(width, height);
    }
}

function create_furniture(pos){
    var group = new Kinetic.Group({
        name: 'furniture_group',
        draggable: true
    });

    var obj = new Kinetic.Rect({
        name: 'furniture',
        x: pos.x,
        y: pos.y,
        width: 50,
        height: 50,
        fill: 'green'
    });
    group.add(obj);
    group.furniture = obj;
    var height = obj.getHeight();
    var width = obj.getWidth();
    var w = 10;
    obj.topleft = create_anchor(pos.x, pos.y,
                                -w, -w,
                                'topleft', group);
    obj.topright = create_anchor(pos.x+width, pos.y,
                                 w, -w,
                                 'topright', group);
    obj.bottomright = create_anchor(pos.x+width, pos.y+height,
                                    w, w,
                                    'bottomright', group);
    obj.bottomleft = create_anchor(pos.x, pos.y+height,
                                   -w, w,
                                   'bottomleft', group);
    return obj;
}

function hide_anchors(obj){
    if(obj.getName() != 'furniture'){
        return;
    }
    obj.topleft.hide();
    obj.topright.hide();
    obj.bottomright.hide();
    obj.bottomleft.hide();
    obj.getParent().draw();
}

function show_anchors(obj){
    if(obj.getName() != 'furniture'){
        return;
    }
    obj.topleft.show();
    obj.topright.show();
    obj.bottomright.show();
    obj.bottomleft.show();
    obj.getParent().draw();
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
