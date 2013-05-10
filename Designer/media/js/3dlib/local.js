var renderer = null;
var scene = null;
var camera = null;
var mesh = null;

/*var APP;*/

var editData;
var threeSceneData;

var globalApp;

$(function() {
	/* init webgl application instance*/

	if (editData !== undefined) {
		var container = document.getElementById('v-container');
		var app = new _App();
		globalApp = app;
		app.startApp({container:container});
	}
});