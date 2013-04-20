// ThreeExt.js - A ThreeExtple ThreeExtulator for WebGL (based on Three.js)

ThreeExt = {};

// ThreeExt.Publisher - base class for event publishers
ThreeExt.Publisher = function() {
	this.messageTypes = {};
}

ThreeExt.Publisher.prototype.subscribe = function(message, subscriber, callback) {
	var subscribers = this.messageTypes[message];
	if (subscribers) {
		if (this.findSubscriber(subscribers, subscriber) != -1) {
			return;
		}
	} else {
		subscribers = [];
		this.messageTypes[message] = subscribers;
	}

	subscribers.push({
		subscriber: subscriber,
		callback: callback
	});
}

ThreeExt.Publisher.prototype.unsubscribe = function(message, subscriber, callback) {
	if (subscriber) {
		var subscribers = this.messageTypes[message];

		if (subscribers) {
			var i = this.findSubscriber(subscribers, subscriber, callback);
			if (i != -1) {
				this.messageTypes[message].splice(i, 1);
			}
		}
	} else {
		delete this.messageTypes[message];
	}
}

ThreeExt.Publisher.prototype.publish = function(message) {
	var subscribers = this.messageTypes[message];

	if (subscribers) {
		for (var i = 0; i < subscribers.length; i++) {
			var args = [];
			for (var j = 0; j < arguments.length - 1; j++) {
				args.push(arguments[j + 1]);
			}
			subscribers[i].callback.apply(subscribers[i].subscriber, args);
		}
	}
}

ThreeExt.Publisher.prototype.findSubscriber = function(subscribers, subscriber) {
	for (var i = 0; i < subscribers.length; i++) {
		if (subscribers[i] == subscriber) {
			return i;
		}
	}

	return -1;
}

// ThreeExt.App - application class (singleton)
ThreeExt.App = function() {
	ThreeExt.Publisher.call(this);

	this.renderer = null;
	this.scene = null;
	this.camera = null;
	this.objects = [];
}

ThreeExt.App.prototype = new ThreeExt.Publisher;

ThreeExt.App.prototype.init = function(param) {
	param = param || {};
	var container = param.container;
	var canvas = param.canvas;

	// Create the Three.js renderer, add it to our div
	var renderer = new THREE.WebGLRenderer({
		antialias: true,
		canvas: canvas
	});
	renderer.setSize(container.offsetWidth, container.offsetHeight);
	container.appendChild(renderer.domElement);

	// Create a new Three.js scene
	var scene = new THREE.Scene();
	scene.add(new THREE.AmbientLight(0x505050));
	scene.data = this;

	// Put in a camera at a good default location
	camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 1, 10000);
	camera.position.set(0, 0, 3.3333);

	scene.add(camera);

	// Create a root object to contain all other scene objects
	var root = new THREE.Object3D();
	scene.add(root);

	// Create a projector to handle picking
	var projector = new THREE.Projector();

	// Save away a few things
	this.container = container;
	this.renderer = renderer;
	this.scene = scene;
	this.camera = camera;
	this.projector = projector;
	this.root = root;

	// Set up event handlers
	this.initKeyboard();
	this.addDomHandlers();
}

//Core run loop
ThreeExt.App.prototype.run = function() {
	this.update();
	this.renderer.render(this.scene, this.camera);
	var that = this;
	requestAnimationFrame(function() {
		that.run();
	});
}

// Update method - called once per tick
ThreeExt.App.prototype.update = function() {
	var i, len;
	len = this.objects.length;
	for (i = 0; i < len; i++) {
		this.objects[i].update();
	}
}

// Add/remove objects
ThreeExt.App.prototype.addObject = function(obj) {
	this.objects.push(obj);

	// If this is a renderable object, add it to the root scene
	if (obj.object3D) {
		this.root.add(obj.object3D);
	}
}

ThreeExt.App.prototype.removeObject = function(obj) {
	var index = this.objects.indexOf(obj);
	if (index != -1) {
		this.objects.splice(index, 1);
		// If this is a renderable object, remove it from the root scene
		if (obj.object3D) {
			this.root.remove(obj.object3D);
		}
	}
}

ThreeExt.App.prototype.initKeyboard = function() {
	var dom = this.renderer.domElement;

	var that = this;
	dom.addEventListener('keydown',

	function(e) {
		that.onKeyDown(e);
	}, false);
	dom.addEventListener('keyup',

	function(e) {
		that.onKeyUp(e);
	}, false);
	dom.addEventListener('keypress',

	function(e) {
		that.onKeyPress(e);
	}, false);

	// so it can take focus
	dom.setAttribute("tabindex", 1);
	dom.style.outline = 'none';
}

ThreeExt.App.prototype.addDomHandlers = function() {
	var that = this;
	window.addEventListener('resize', function(event) {
		that.onWindowResize(event);
	}, false);
}


ThreeExt.App.prototype.findObjectFromIntersected = function(object, point, normal) {
	if (object.data) {
		return {
			object: object.data,
			point: point,
			normal: normal
		};
	} else if (object.parent) {
		return this.findObjectFromIntersected(object.parent, point, normal);
	} else {
		return {
			object: null,
			point: null,
			normal: null
		};
	}
}


ThreeExt.App.prototype.onKeyDown = function(event) {
	// N.B.: Chrome doesn't deliver keyPress if we don't bubble... keep an eye on this
	event.preventDefault();

	if (this.handleKeyDown) {
		this.handleKeyDown(event.keyCode, event.charCode);
	}
}

ThreeExt.App.prototype.onKeyUp = function(event) {
	// N.B.: Chrome doesn't deliver keyPress if we don't bubble... keep an eye on this
	event.preventDefault();

	if (this.handleKeyUp) {
		this.handleKeyUp(event.keyCode, event.charCode);
	}
}

ThreeExt.App.prototype.onKeyPress = function(event) {
	// N.B.: Chrome doesn't deliver keyPress if we don't bubble... keep an eye on this
	event.preventDefault();

	if (this.handleKeyPress) {
		this.handleKeyPress(event.keyCode, event.charCode);
	}
}

ThreeExt.App.prototype.onWindowResize = function(event) {

	this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);

	this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
	this.camera.updateProjectionMatrix();

}

ThreeExt.App.prototype.focus = function() {
	if (this.renderer && this.renderer.domElement) {
		this.renderer.domElement.focus();
	}
}


// ThreeExt.Object - base class for all objects in our ThreeExtulation
ThreeExt.Object = function() {
	ThreeExt.Publisher.call(this);

	this.object3D = null;
	this.children = [];
}

ThreeExt.Object.prototype = new ThreeExt.Publisher;

ThreeExt.Object.prototype.init = function() {}

ThreeExt.Object.prototype.update = function() {
	this.updateChildren();
}

// setPosition - move the object to a new position
ThreeExt.Object.prototype.setPosition = function(x, y, z) {
	if (this.object3D) {
		this.object3D.position.set(x, y, z);
	}
}

//setScale - scale the object
ThreeExt.Object.prototype.setScale = function(x, y, z) {
	if (this.object3D) {
		this.object3D.scale.set(x, y, z);
	}
}

//setScale - scale the object
ThreeExt.Object.prototype.setVisible = function(visible) {
	function setVisible(obj, visible) {
		obj.visible = visible;
		var i, len = obj.children.length;
		for (i = 0; i < len; i++) {
			setVisible(obj.children[i], visible);
		}
	}

	if (this.object3D) {
		setVisible(this.object3D, visible);
	}
}

// updateChildren - update all child objects
ThreeExt.Object.prototype.update = function() {
	var i, len;
	len = this.children.length;
	for (i = 0; i < len; i++) {
		this.children[i].update();
	}
}

ThreeExt.Object.prototype.setObject3D = function(object3D) {
	object3D.data = this;
	this.object3D = object3D;
}

//Add/remove children
ThreeExt.Object.prototype.addChild = function(child) {
	this.children.push(child);

	// If this is a renderable object, add its object3D as a child of mine
	if (child.object3D) {
		this.object3D.add(child.object3D);
	}
}

ThreeExt.Object.prototype.removeChild = function(child) {
	var index = this.children.indexOf(child);
	if (index != -1) {
		this.children.splice(index, 1);
		// If this is a renderable object, remove its object3D as a child of mine
		if (child.object3D) {
			this.object3D.remove(child.object3D);
		}
	}
}

// Some utility methods
ThreeExt.Object.prototype.getScene = function() {
	var scene = null;
	if (this.object3D) {
		var obj = this.object3D;
		while (obj.parent) {
			obj = obj.parent;
		}

		scene = obj;
	}

	return scene;
}

ThreeExt.Object.prototype.getApp = function() {
	var scene = this.getScene();
	return scene ? scene.data : null;
}

// Some constants

/* key codes
37: left
38: up
39: right
40: down
*/
ThreeExt.KeyCodes = {};
ThreeExt.KeyCodes.KEY_LEFT = 37;
ThreeExt.KeyCodes.KEY_UP = 38;
ThreeExt.KeyCodes.KEY_RIGHT = 39;
ThreeExt.KeyCodes.KEY_DOWN = 40;


/**
 * Provides requestAnimationFrame in a cross browser way.
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */

if ( !window.requestAnimationFrame ) {

	window.requestAnimationFrame = ( function() {

		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

			window.setTimeout( callback, 1000 / 60 );

		};

	} )();

}