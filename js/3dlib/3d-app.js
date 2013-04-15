/**
 * class for viewing the scene
 */
SceneViewer = function() {
	ThreeExt.App.call(this);

	this.walls = [];
	this.floors = [];
	this.ceilings = [];
	this.windows = [];
	this.doors = [];

	this.zoomObjects = [];
}

/**
 * @type {ThreeExt.App}
 */
SceneViewer.prototype = new ThreeExt.App();


/**
 * initialize the SceneViewer by default settings
 * @param  {object} param
 * @return {}
 */
SceneViewer.prototype.init = function(param) {
	ThreeExt.App.prototype.init.call(this, param);

	// create light
	this.createLight();

	// create camera
	this.createCamera();

	// create camera control
	this.createTrackballCameraControls();
	// this.createFirstPersonControls();

	var dataTransformer = new _DataTransformer();
	threeSceneData = dataTransformer();

	// create objects in the scene
	this.createWalls();
	// this.createFloor();
}

/**
 * create Light for the scene
 * @return {}
 */
SceneViewer.prototype.createLight = function() {
	// set light
	this.headlight = new THREE.DirectionalLight(0xffffff, 1);
	this.headlight.position.set(0, 100, 100);
	this.scene.add(this.headlight);

	/*var amb = new THREE.AmbientLight(0xffffff);
	this.scene.add(amb);*/

	var ptlight = new THREE.PointLight(0xffffff, 1, 10000000);
	ptlight.position.set(0, 33, 0);
	this.scene.add(ptlight);
}


SceneViewer.prototype.createCamera = function() {
	this.camera.position.set(0, 100, 100);
	this.camera.lookAt(this.root.position);
}


/**
 * create camera control
 * @return {[type]}
 */
SceneViewer.prototype.createTrackballCameraControls = function() {
	var controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
	var radius = SceneViewer.CAMERA_RADIUS;

	controls.rotateSpeed = SceneViewer.ROTATE_SPEED;
	controls.zoomSpeed = SceneViewer.ZOOM_SPEED;
	controls.panSpeed = SceneViewer.PAN_SPEED;
	controls.dynamicDampingFactor = SceneViewer.DAMPING_FACTOR;
	controls.onZoom = false;
	controls.onPan = false;
	controls.staticMoving = false;

	controls.minDistance = radius * SceneViewer.MIN_DISTANCE_FACTOR;
	controls.maxDistance = radius * SceneViewer.MAX_DISTANCE_FACTOR;
	// controls.radius = radius;
	controls.keys = [ 65, 83, 68 ];

	this.controls = controls;
}

SceneViewer.prototype.createFirstPersonControls = function() {
	var controls = new THREE.FirstPersonControls( this.camera );

	controls.movementSpeed = 13;
	controls.lookSpeed = 0.01;
	
	// Don't allow tilt up/down
	controls.lookVertical = false;

	this.controls = controls;
	
	this.clock = new THREE.Clock();
}

/**
 * update scene
 * @return {[type]}
 */
SceneViewer.prototype.update = function() {
	if (this.controls) {
		this.controls.update();
	}

	ThreeExt.App.prototype.update.call(this);
}

SceneViewer.prototype.createWalls = function() {
	for (i in threeSceneData.walls) {
		var wallParam = threeSceneData.walls[i];
		var wall = new Wall;
		// wall.root.rotation.y -= wallParam.rotation;

		for ( j in  wallParam.blocks) {
			var blockParam = wallParam.blocks[j];
			var block = ObjectFactory.createMesh(blockParam);
			wall.add(block);
		}

		for ( j in wallParam.doors) {
			var doorParam = wallParam.doors[j];
			var door = ObjectFactory.createMesh(doorParam);
			wall.add(door);
		}

		this.scene.add(wall);
	}
}

/**
 * constant variables for the scene
 */
SceneViewer.CAMERA_RADIUS = 8.0;
SceneViewer.MAX_CAMERA_RADIUS = 16.0;
SceneViewer.MIN_CAMERA_RADIUS = 2.0;
SceneViewer.MIN_DISTANCE_FACTOR = 0.8;
SceneViewer.MAX_DISTANCE_FACTOR = 11.0;
SceneViewer.ROTATE_SPEED = 1.0;
SceneViewer.ZOOM_SPEED = 3.0;
SceneViewer.PAN_SPEED = 0.2;
SceneViewer.DAMPING_FACTOR = 0.3;

Wall = function () {
}

Wall.prototype = new THREE.Scene();

/**
 * class for creating 3d objects by config data in json format
 */
ObjectFactory = function() {
}

/**
 * create Mesh Object
 * walls , floor , ....
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
ObjectFactory.createMesh = function(param) {
	var geometry = new THREE.CubeGeometry(param.size[0], param.size[1], param.size[2]);

	var map = THREE.ImageUtils.loadTexture(param.texture.url);
	map.wrapS = map.wrapT = THREE.RepeatWrapping;
	map.repeat.set(param.texture.repeat, param.texture.repeat);

	var material = new THREE.MeshLambertMaterial({
		map: map
	});

	var mesh = new THREE.Mesh(geometry, material);

	mesh.position.set(param.position[0], param.position[1], param.position[2]);
	if (typeof(param.rotation)!=='undefined') {
		mesh.rotation.y -= param.rotation;
	}

	return mesh;
}

/**
 * create 3D Model Object
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
ObjectFactory.createModel = function(param) {

}

/**
 * create Cube as a 3D Object
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
ObjectFactory.createCube = function() {
	var len = Math.sqrt(2);
	var geometry = new THREE.CubeGeometry(2, 2, 2);
	var cubematerial = new THREE.MeshPhongMaterial({
		color: 0x0055ff
	});
	var cube = new THREE.Mesh(geometry, cubematerial);
	cube.position.set(0, 1, -5);

	return cube;
}