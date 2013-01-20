var camera, scene, renderer, controls, loader;
var geometry, material, mesh;
var meshs = [];

loader = new THREE.JSONLoader();

function start() {
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
    initWebGL();
    animate();
}
function initWebGL() {

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;

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

    scene = new THREE.Scene();

    geometry = new THREE.CubeGeometry( 200, 200, 200 );
    material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

    mesh = new THREE.Mesh( geometry, material );
    meshs.push(mesh);
    scene.add( mesh );

    //lights
    scene.add(new THREE.AmbientLight(0xcccccc));

    params = {};
    canvas = document.getElementById("canvas");
    params.canvas = canvas;
    renderer = new THREE.WebGLRenderer(params);
    renderer.setSize( window.innerWidth, window.innerHeight );

    window.addEventListener( 'resize', onWindowResize, false );
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

                    //clean old meshs
                    for(var i = 0; i < meshs.length; i++){
                        m = meshs.pop();
                        scene.remove(m);
                    }

                    meshs.push(mesh);
                    scene.add(mesh);
                });
}
