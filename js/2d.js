var container, stats;
var camera, scene, renderer, controls, projector;
var plane;
var mouse = new THREE.Vector2(),
offset = new THREE.Vector3(),
INTERSECTED, SELECTED;
var clock = new THREE.Clock();


var furnitures = [];
var rooms = [];


function start() {
    container = document.getElementById("content");
    initWebGL();
    animate();
}
function initWebGL() {
    projector = new THREE.Projector();
    initScene();
    initCamera();
    initLight();
    initObjects();
    initRenderer();
    initControls();

    stats = new Stats();
    document.body.appendChild(stats.domElement);

    window.addEventListener( 'resize', onWindowResize, false );
}

function initLight(){
    scene.add(new THREE.AmbientLight(0x222222));
    light = new THREE.DirectionalLight(0xFF0000, 1.0, 0);
    light.position.set( 0, 0, 100 );
    scene.add(light);

    var light = new THREE.PointLight(0xff4400, 5, 30);
    light.position.set(0, 0, 100);
    scene.add(light);
}


function initScene(){
    scene = new THREE.Scene();
}

function initObjects(){
    //lines
    var geometry1 = new THREE.Geometry();
    geometry1.vertices.push(new THREE.Vector3( - 500, 0, 0 ) );
    geometry1.vertices.push(new THREE.Vector3( 500, 0, 0 ) );

    var geometry2 = new THREE.Geometry();
    geometry2.vertices.push(new THREE.Vector3( 0, -500, 0));
    geometry2.vertices.push(new THREE.Vector3( 0, 500, 0));

    linesMaterial = new THREE.LineBasicMaterial( { color: 0x000000, opacity: .2, linewidth: .1 } );

    for ( var i = 0; i <= 20; i ++ ) {

        var line = new THREE.Line( geometry1, linesMaterial );
        line.position.y = ( i * 50 ) - 500;
        scene.add( line );

        var line = new THREE.Line( geometry2, linesMaterial );
        line.position.x = ( i * 50 ) - 500;
        scene.add( line );
    }

    plane = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000, 8, 8 ),
                            new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.25, transparent: true, wireframe: true } ) );
    plane.visible = false;
    scene.add( plane );
    // plane for test
    var geometry = new THREE.PlaneGeometry(50, 50);
    linesMaterial = new THREE.LineBasicMaterial({ color: 0x000000});
    var p = new THREE.Mesh(geometry, linesMaterial);
    p.position.set(0,0,1);
    scene.add(p);
    furnitures.push(p);
}
function initRenderer(){
    params = {};
    canvas = document.getElementById("canvas");
    params.canvas = canvas;
    params.antialias = true;
    renderer = new THREE.WebGLRenderer(params);
    renderer.sortObjects = false;
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.domElement.addEventListener( 'mousemove', onMouseMove, false );
    renderer.domElement.addEventListener( 'mousedown', onMouseDown, false );
    renderer.domElement.addEventListener( 'mouseup', onMouseUp, false );
}

function initCamera(){
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;
}

function initControls(){
    controls = new THREE.TrackballControls(camera);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;
    controls.noRotate = true;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [ 65, 83, 68];
    controls.addEventListener("change", render);

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    controls.handleResize();

    render();
}

function animate() {
    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( animate );

    render();
    if(controls.enabled){
        controls.update();
    }
    stats.update();
}

function render() {
    renderer.render(scene, camera);
}

function onMouseDown(event){
    event.preventDefault();
    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
    projector.unprojectVector( vector, camera );
    var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

    var intersects = raycaster.intersectObjects( furnitures );
    console.log(furnitures.length);
    if ( intersects.length > 0 ) {
        controls.enabled = false;
        SELECTED = intersects[ 0 ].object;
        var intersects = raycaster.intersectObject( plane );
        offset.copy( intersects[ 0 ].point ).sub( plane.position );
        container.style.cursor = 'move';
    }

}

function onMouseUp(event){
    event.preventDefault();
    controls.enabled = true;
    if ( INTERSECTED ) {
        plane.position.copy( INTERSECTED.position );
        SELECTED = null;
    }
    container.style.cursor = 'auto';

}

function onMouseMove(event){
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    //
    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
    projector.unprojectVector( vector, camera );
    var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
    if ( SELECTED ) {
        var intersects = raycaster.intersectObject( plane );
        SELECTED.position.copy( intersects[ 0 ].point.sub( offset ) );
        return;
    }
    var intersects = raycaster.intersectObjects( furnitures );
    if ( intersects.length > 0 ) {
        if ( INTERSECTED != intersects[ 0 ].object ) {
            if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
            plane.position.copy( INTERSECTED.position );
            plane.lookAt( camera.position );
        }
        container.style.cursor = 'pointer';
    } else {
        if ( INTERSECTED ) {
            INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
        }
        INTERSECTED = null;
        container.style.cursor = 'auto';
    }
}

function clean_scene(){
    for(var i = 0; i < rooms.length; i++){
        var m = rooms.pop();
        scene.remove(m);
    }
    for(var i = 0; i < furnitures.length; i++){
        var m = furnitures.pop();
        scene.remove(m);
    }
}
