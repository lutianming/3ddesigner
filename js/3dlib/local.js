var renderer = null;
var scene = null;
var camera = null;
var mesh = null;

$(document).ready(

	function() {
		var container = document.getElementById("container");
		var app = new SceneViewer();
		app.init({
			container: container
		});
		app.run();
	}
);