var stats;
var camera, scene, renderer, controls, loader, light;
var geometry, material, mesh;
var meshs = [];
var animate_objs = [];
var clock = new THREE.Clock();
loader = new THREE.JSONLoader();

var furnitures = [];
var rooms = [];


function start() {
    initWebGL();
    animate();
}
function initWebGL() {
    initScene();
    initCamera();
//    initControls();
    initLight();
    initObjects();
    initRenderer();

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
    scene.add( mesh );
}
function initRenderer(){
    params = {};
    canvas = document.getElementById("canvas");
    params.canvas = canvas;
    renderer = new THREE.WebGLRenderer(params);
    renderer.setSize( window.innerWidth, window.innerHeight );
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

    if(animate_objs.length > 0){
        var delta = clock.getDelta();
        for(var i = 0; i < animate_objs.length; i++){
            animate_objs[i].updateAnimation(1000 * delta);
        }
    }
    render();
    if(controls.enabled){
        controls.update();
    }
    stats.update();
}

function render() {
    renderer.render(scene, camera);
}

function load(model, textureURL) {
    if(typeof textureURL == "undefined"){
        textureURL = null;
    }
    if(textureURL != null){
        var texture = new THREE.Texture();
        var imageLoader = new THREE.ImageLoader();
        imageLoader.addEventListener('load', function(event){
            texture.image = event.content;
            texture.needsUpdate = true;
        });
        imageLoader.load(textureURL);
    }

    loader.load(model,
                function(geometry, materials) {
                    material = new THREE.MeshFaceMaterial(materials);
                    mesh = new THREE.Mesh(geometry, material);

                    clean_scene();

                    meshs.push(mesh);
                    scene.add(mesh);
                });
}

function clean_scene(){
    for(var i = 0; i < meshs.length; i++){
        var m = meshs.pop();
        scene.remove(m);
    }
    for(var i = 0; i <animate_objs.length; i++){
        var m = animate_objs.pop();
        scene.remove(m);
    }
}
