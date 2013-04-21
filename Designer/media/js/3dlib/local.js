var renderer = null;
var scene = null;
var camera = null;
var mesh = null;

var APP;

var editData;
var threeSceneData;

$(function() {
	/* init webgl application instance*/
	var container = document.getElementById('v-container');
	var app = new SceneViewer();
	app.init({
		container: container
	});
	app.run();

	APP = app;
	
	/* bind events */
	// zoom in event
	$('#v-zoom-in').on('click', function(event) {
		if (app.controls instanceof THREE.TrackballControls) {
			// adjustTrackballControls(false);
			app.controls.zoomView(10);
		}
	});

	$('#v-zoom-out').on('click', function(event) {
		if (app.controls instanceof THREE.TrackballControls) {
			// adjustTrackballControls(true);
			app.controls.zoomView(-10);
		}
	});
});