/**
 * class for viewing the scene
 */
SceneViewer = function() {
	ThreeExt.App.call(this);
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

	// create camera control

	this.createTrackballCameraControls();
	// this.createFirstPersonControls();

	if (editData === undefined) {
		return;
	}

	var dataTransformer = new _DataTransformer();
	threeSceneData = dataTransformer();

	// create objects in the scene
	this.createScene();
}

/**
 * create Scene
 * @return {[type]} [description]
 */
SceneViewer.prototype.createScene = function() {
	this.createWalls();
	this.createFloors();
	this.createModels();
}

/**
 * create Light for the scene
 * @return {}
 */
SceneViewer.prototype.createLight = function() {
	// set light
	var headlight = new THREE.DirectionalLight(0xffffff, 1);
	headlight.position.set(0, 100, 0);
	this.scene.add(headlight);

	/*var amb = new THREE.AmbientLight(0xffffff);
	this.scene.add(amb);*/

	var ptlight = new THREE.PointLight(0xffffff, 1, 1000);
	ptlight.position.set(0, 33, 0);
	this.scene.add(ptlight);
}

/**
 * create Overview Camera control
 * @return {[type]}
 */
SceneViewer.prototype.createTrackballCameraControls = function() {

	this.camera.position.set(0, 150, 100);
	this.camera.lookAt(this.root.position);

	var controls = new THREE.TrackballControls(this.camera, this.container);
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
	controls.keys = [65, 83, 68];

	this.controls = controls;
}

/**
 * create firstperson camera control
 * @return {[type]} [description]
 */
SceneViewer.prototype.createFirstPersonControls = function() {
	this.camera.position.set(0, 8, 0);
	this.camera.lookAt( new THREE.Vector3(1 , 8 , 0) );

	var controls = new THREE.FirstPersonControls(this.camera, this.container);

	controls.movementSpeed = 35;
	controls.lookSpeed = 0.2;

	// Don't allow tilt up/down
	controls.lookVertical = false;

	this.controls = controls;

	this.clock = new THREE.Clock();
}

/**
 * unregister all controls from domElement
 * @return {[type]} [description]
 */
SceneViewer.prototype.unregisterControls = function() {
	this.controls.unregisterEventListeners();
}

/**
 * update scene
 * @return {[type]}
 */
SceneViewer.prototype.update = function() {
	if (this.controls) {
		if (this.controls instanceof THREE.TrackballControls) {
			this.controls.update();
		}

		if (this.controls instanceof THREE.FirstPersonControls) {
			this.controls.update( this.clock.getDelta() );
		}
		
	}

	ThreeExt.App.prototype.update.call(this);
}

SceneViewer.prototype.createWalls = function() {
	for (var i in threeSceneData.walls) {
		var wallParam = threeSceneData.walls[i];
		var wall = new Wall;
		// wall.root.rotation.y -= wallParam.rotation;

		for (var j in wallParam.blocks) {
			var blockParam = wallParam.blocks[j];
			var block = ObjectFactory.createCubeMesh(blockParam);
			wall.add(block);
		}

		for (var j in wallParam.doors) {
			var doorParam = wallParam.doors[j];
			var door = ObjectFactory.createCubeMesh(doorParam);
			wall.add(door);
		}

		for (var j in wallParam.windows) {
			var windowParam = wallParam.windows[j];
			var _window = ObjectFactory.createCubeMesh(windowParam);
			wall.add(_window);
		}

		this.scene.add(wall);
	}
}

SceneViewer.prototype.createFloors = function() {
	for (var i in threeSceneData.floors) {
		var param = threeSceneData.floors[i];
		var floor = ObjectFactory.createFloorMesh(param);
		this.scene.add(floor);
	}
}

SceneViewer.prototype.createModels = function() {
	for (var i in threeSceneData.models) {
		var param = threeSceneData.models[i];
		var model = ObjectFactory.createModel(param, this.scene);
	}
}

/**
 * constant variables for the scene
 */
SceneViewer.CAMERA_RADIUS = 12.0;
SceneViewer.MAX_CAMERA_RADIUS = 16.0;
SceneViewer.MIN_CAMERA_RADIUS = 2.0;
SceneViewer.MIN_DISTANCE_FACTOR = 0.9;
SceneViewer.MAX_DISTANCE_FACTOR = 12.0;
SceneViewer.ROTATE_SPEED = 1.0;
SceneViewer.ZOOM_SPEED = 3.0;
SceneViewer.PAN_SPEED = 0.2;
SceneViewer.DAMPING_FACTOR = 0.3;

Wall = function() {}

Wall.prototype = new THREE.Scene();

/**
 * class for creating 3d objects by config data in json format
 */
ObjectFactory = function() {}

/**
 * create Mesh Object
 * walls , floor , ....
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
ObjectFactory.createCubeMesh = function(param) {
	var geometry = new THREE.CubeGeometry(param.size.x, param.size.y, param.size.z);
	// var geometry = new THREE.PlaneGeometry(100, 100, 1, 1);

	var map = THREE.ImageUtils.loadTexture(param.texture.url);
	map.wrapS = map.wrapT = THREE.RepeatWrapping;
	map.repeat.set(param.texture.repeat.x, param.texture.repeat.y);
	// map.offset.set(param.texture.offset_x, param.offset_y);

	var material = new THREE.MeshLambertMaterial({
		map: map
	});

	var mesh = new THREE.Mesh(geometry, material);

	mesh.position.set(param.position.x, param.position.y, param.position.z);
	if (typeof(param.rotation) !== 'undefined') {
		mesh.rotation.y -= param.rotation;
	}

	return mesh;
}

/**
 * @discarded
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
ObjectFactory.createPlaneMesh = function(param) {
	var geometry = new THREE.Geometry();

	var points = param.points;
	var len = points.length;

	for (var i in points) {
		geometry.vertices.push(new THREE.Vector3(points[i].x, points[i].y, points[i].z));
	}

	var face = new THREE.Face4(0,1,2,3,null,null,0);
	var normal = new THREE.Vector3(0,1,0);
	face.normal.copy(normal);
	face.vertexNormals.push(normal.clone(), normal.clone(), normal.clone(), normal.clone());
	// face.faceVertexUvs

	geometry.faces.push(face);
	geometry.faceVertexUvs[0].push([
			new THREE.Vector2(0,1),
			new THREE.Vector2(0,0),
			new THREE.Vector2(1,0),
			new THREE.Vector2(1,1)
		]);


	geometry.computeCentroids();
	geometry.computeFaceNormals();

	var map = THREE.ImageUtils.loadTexture(param.texture.url);
	map.wrapS = map.wrapT = THREE.RepeatWrapping;
	map.repeat.set(param.texture.repeat.x, param.texture.repeat.y);

	var material = new THREE.MeshBasicMaterial({
		map: map,
		side: THREE.DoubleSide
	});

	var mesh = new THREE.Mesh(geometry, material);


	return mesh;

}

ObjectFactory.createFloorMesh = function(param) {
	var floorShape = new THREE.Shape();
	var points = param.points;

	var startPoint = points[0];

	floorShape.moveTo( startPoint.x, startPoint.z);

	for ( var i = 1, l = points.length; i < l ; i++) {
		floorShape.lineTo(points[i].x , points[i].z);
	}

	floorShape.lineTo(startPoint.x , startPoint.z);

	var geometry = new THREE.FloorGeometry( floorShape );
	var map = THREE.ImageUtils.loadTexture(param.texture.url);
	map.wrapT = map.wrapS = THREE.RepeatWrapping;
	map.repeat.set( param.texture.repeat.x , param.texture.repeat.y );

	var material = new THREE.MeshBasicMaterial(
		{
			map : map,
			side : THREE.DoubleSide	
		});

	var mesh = new THREE.Mesh(geometry, material);

	return mesh;
}

/**
 * create 3D Model Object
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
ObjectFactory.createModel = function(param, scene) {
	if (param === undefined) {
		return;
	}

	var loader = new THREE.ColladaLoader();

	loader.load(param.url, function(collada) {
		var dae = collada.scene;

		dae.scale.x = param.scale.x;
		dae.scale.y = param.scale.y;
		dae.scale.z = param.scale.z;

		dae.rotation.x -= param.rotation.x;
		dae.rotation.y -= param.rotation.y;
		dae.rotation.z -= param.rotation.z;

		dae.position.set(param.position.x, param.position.y, param.position.z);
		scene.add(dae);
	});
}



function _App() {
	var _app;

	function getInstance() {
		return _app;
	}

	function startApp(options) {
		if (options.container === undefined) {
			return;
		}

		_app = new SceneViewer();
		_app.init({
			container : options.container
		});
		_app.run();
	}

	function setControls(mode) {
		if ( _app === undefined ) {
			return;
		}
		_app.unregisterControls();
		switch (mode) {
			case 0:
				_app.createTrackballCameraControls();
				break;
			case 1:
				_app.createFirstPersonControls();
				break;
		}
	}

	return {
		startApp : startApp,
		setControls : setControls
	}
}