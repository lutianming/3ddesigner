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
    var height = obj.getHeight();
    var width = obj.getWidth();
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
    return group;
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
