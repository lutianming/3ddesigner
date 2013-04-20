var renderer = null;
var scene = null;
var camera = null;
var mesh = null;

var SCENE;

var threeSceneData;


$(function() {
	/* init webgl application instance*/
	var container = document.getElementById('v-container');
	var app = new SceneViewer();
	app.init({
		container: container
	});
	app.run();
});