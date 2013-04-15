var renderer = null;
var scene = null;
var camera = null;
var mesh = null;

var APP;

var threeSceneData;

$(document).ready(
function() {
	/* init webgl application instance*/
	var container = document.getElementById('v-container');
	var app = new SceneViewer();
	app.init({
		container: container
	});
	app.run();

	APP=app;
	/* bind events */
	// zoom in event
	$('#v-zoom-in').on('click', function(event) {
		if (app.controls instanceof THREE.TrackballControls) {
			adjustTrackballControls(false);
		}
	});

	$('#v-zoom-out').on('click', function(event) {
		if (app.controls instanceof THREE.TrackballControls) {
			adjustTrackballControls(true);
		}
	});

	/**
	 * function to adjust trackball control
	 * @param  {boolean} true to zoom in ,false to zoom out
	 * @return {[type]}
	 */

	function adjustTrackballControls(tag) {
		/*var curRadius = app.controls.radius;
		if (tag) {
			curRadius>=SceneViewer.MAX_CAMERA_RADIUS ? void 0 : curRadius = curRadius+1.0 ;
		} 
		else {
			curRadius<=SceneViewer.MIN_CAMERA_RADIUS ? void 0 : curRadius = curRadius -1.0;
		}
		app.controls.minDistance = curRadius * SceneViewer.MIN_DISTANCE_FACTOR;
		app.controls.maxDistance = curRadius * SceneViewer.MAX_DISTANCE_FACTOR;
		app.controls.radius = curRadius;*/


		var DELTA = 100;
		app.camera.position.z +=DELTA;
	}
});