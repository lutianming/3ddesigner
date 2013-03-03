var stats;
var camera, scene, renderer, controls, loader, light;
var geometry, material, mesh;
var meshs = [];
var animate_objs = [];
var clock = new THREE.Clock();
loader = new THREE.JSONLoader();

function start() {
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
    initWebGL();
    animate();
}
function initWebGL() {
    initScene();
    initCamera();
    initControls();
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
    light.position.set( 100, 100, 200 );
    scene.add(light);

    var light = new THREE.PointLight(0xff4400, 5, 30);
    light.position.set(5, 0, 0);
    scene.add(light);
}


function initScene(){
    scene = new THREE.Scene();
}

function initObjects(){
    geometry = new THREE.CubeGeometry( 200, 200, 200 );
    material = new THREE.MeshLambertMaterial( { color: 0xff0000, ambient:0xFF0000} );

    mesh = new THREE.Mesh( geometry, material );
    meshs.push(mesh);
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

function upload() {
    files = document.getElementById("files");
    path = files.text;
    url = window.URL.createObjectURL(files.files[0]);
//    load("models/monster.js");
    load(url);
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

function load_animate(model){
    loader.load(model, function(geometry, materials){
        var material = materials[ 0 ];
        material.morphTargets = true;
//        material.color.setHex( 0xffaaaa );
//        material.ambient.setHex( 0x222222 );

        var faceMaterial = new THREE.MeshFaceMaterial(materials);
        var mesh = new THREE.MorphAnimMesh(geometry, faceMaterial);
        mesh.duration = 1000;
        mesh.time = 500;
        mesh.position.set(0,0,0);
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();

        clean_scene();
        animate_objs.push(mesh);
        scene.add(mesh);
    });
}
