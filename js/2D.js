var stage;
var width = 800;
var height = 600;
function init(){
    stage = new Kinetic.Stage({
        container: 'content',
        width: width,
        height: height,
    });
    var layer = new Kinetic.Layer();
    for(var i = 1; i < width/20; i++){
        var x = i * 20;
        var line = new Kinetic.Line({
            points:[x, 0, x, height],
            stroke: 'black',
            strokeWidth: 0.5,
        });
        layer.add(line);
    }
    for(var i = 1; i < height/20; i++){
        var y = i*20;
        var line = new Kinetic.Line({
            points:[0, y, width, y],
            stroke: 'black',
            strokeWidth: 0.5,
        });
        layer.add(line);
    }
    stage.add(layer);

    initControls();
}

function initControls(){
    //mousewheel not work now
    stage.getContainer().addEventListener('mousewheel', onMouseWheel, false);
}

function onMouseWheel(e){
    console.log('fdf');

    event.preventDefault();
    event.stopPropagation();
    var delta = 0;
    if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9
        delta = event.wheelDelta / 40;
    } else if ( event.detail ) { // Firefox
        delta = - event.detail / 3;
    }
    stage.setScale(stage.getScale().x + delta);
    stage.draw();
}

function scale(delta){
    stage.setScale(stage.getScale().x + delta);
    stage.draw();
}
