/**
 * [Data Transformer to convert data from 2d to 3d
 * @return {[type]} [description]
 */

function _DataTransformer() {
	/**
	 * CONSTANT VALUES FOR SCENE
	 * @type {Number}
	 */
	var _WALL_THICK = 0.2;
	var _WALL_HEIGHT = 16;
	var _DOOR_THICK = 0.1;
	var _DOOR_HEIGHT = 12;

	var _DOOR_TYPE = 1;
	var _WINDOW_TYPE = 2;
	var _WALL_TYPE = 0;

	var _DEFAULT_TEXTURE_REPEAT = 2;
	var _DEFAULT_TEXTURE_WIDTH = 50.0;
	var _DEFAULT_TEXTURE_HEIGHT = 25.0;

	/**
	 * CONSTANT VALUE
	 * ZOOM FACTOR FROM 2D TO 3D
	 * @type {Number}
	 */
	var _CONVERT_ZOOM_FACTOR = 6;


	// var editData;

	function get2DJSON() {
		return exportJSON();
	}

	/**
	 * get rotation value for those not parallel to the axis
	 * rotate to y axis
	 * @param  object p1 point1 of wall.etc
	 * @param  object p2 point2 of wall.etc
	 * @return {[type]}    [description]
	 */

	function getRotation(p1, p2) {
		return Math.atan((p2.y - p1.y) / (p2.x - p1.x));
	}


	/**
	 * get the distance between two points
	 * @param  {[type]} p1 [description]
	 * @param  {[type]} p2 [description]
	 * @return {[type]}    [description]
	 */

	function getDistance(p1, p2) {
		return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
	}

	/**
	 * convert point to hashmap key
	 * @param  {[type]} point [description]
	 * @return {[type]}       [description]
	 */

	function getPointKey(point) {
		return point.x + ":" + point.y;
	}

	/**
	 * get Coordinate shift of 3d
	 * place the scene at root (0,0,0)
	 * @return Object (shif_x,shift_z)
	 */

	function getCoordinateShift() {
		var maxX = 0;
		var maxY = 0;

		for (i in editData.walls) {
			var tmpWall = editData.walls[i];
			for (j in tmpWall.points) {
				var point = tmpWall.points[j];
				maxX = (point.x > maxX) ? point.x : maxX;
				maxY = (point.y > maxY) ? point.y : maxY;
			}
		}

		var shift = {
			shift_x: maxX / 2.0,
			shift_z: maxY / 2.0
		};

		return shift;
	}

	/**
	 * generate devider according to data of window or door
	 * @param  {[type]} tmpDoor [description]
	 * @param  {int} type    [description]
	 * @param {float}  wallRotation angle of wall
	 * @return {[type]}         [description]
	 */

	function getDevider(tmpDoor, type, wallRotation) {
		var deltaX = Math.cos(wallRotation) * tmpDoor.width;
		var deltaY = Math.sin(wallRotation) * tmpDoor.width;

		var p1 = {
			x: (tmpDoor.position.x) - deltaX / 2,
			y: (tmpDoor.position.y) - deltaY / 2
		}

		var p2 = {
			x: (tmpDoor.position.x) + deltaX / 2,
			y: (tmpDoor.position.y) + deltaY / 2
		}

		return {
			'p1': p1,
			'p2': p2,
			'type': type
		};
	}

	/**
	 * sortDeviders according to params
	 * @param  {array} deviders    array to be sorted
	 * @param  {boolean} flag        true to asc, false to desc
	 * @param  {Object} tmpWall  decide sort order by point1 and piont2
	 * @return {[type]}          [description]
	 */

	function sortDeviders(deviders, tmpWall) {
		if (typeof(deviders) === 'undefined' || deviders.lengt <= 0) {
			return;
		}


		// decide which axis to sort , x or y
		var axis = true;
		if (tmpWall.points[0].x == tmpWall.points[1].x) {
			axis = false;
		}

		var p1, p2;
		if (axis) {
			p1 = tmpWall.points[0].x;
			p2 = tmpWall.points[1].x;
		} else {
			p1 = tmpWall.points[0].y;
			p2 = tmpWall.points[1].y;
		}

		var flag = p1 < p2;

		_sort(deviders, flag, axis);
	}

	/**
	 * _sort  sort deviders p1 ,p2
	 * then call subroutine to sort array with bubble sort
	 * @param  {array} deviders array to sort
	 * @param  {boolean} flag     true to asc, false to desc
	 * @param  {[type]} axis     true to sort x, flase to sort y
	 * @return {[type]}          [description]
	 */

	function _sort(deviders, flag, axis) {

		var len = deviders.length;

		for (var i = 0; i < len; i++) {
			var sortThis = false;
			if (axis) {
				sortThis = (deviders[i].p1.x < deviders[i].p2.x) ^ flag;
			} else {
				sortThis = (deviders[i].p1.y < deviders[i].p2.y) ^ flag;
			}

			if (sortThis) {
				var tmp = deviders[i].p1;
				deviders[i].p1 = deviders[i].p2;
				deviders[i].p2 = tmp;
			}
		}

		_subsort(deviders, flag, axis);
	}

	function _subsort(deviders, flag, axis) {

		var tag = false;

		var len = deviders.length;

		for (var i = 0; i < len - 1; i++) {
			var e1, e2;
			if (axis) {
				e1 = deviders[i].p1.x;
				e2 = deviders[i + 1].p1.x;
			} else {
				e1 = deviders[i].p1.y;
				e2 = deviders[i + 1].p1.y;
			}

			if ((e1 < e2) ^ flag) {
				var tmp = deviders[i];
				deviders[i] = deviders[i + 1];
				deviders[i + 1] = tmp;
				tag = true;
			}
		}

		if (tag) {
			_subsort(deviders, flag, axis);
		}
	}

	/**
	 * generate 3d data wall from tmpWall params
	 * @return {[type]} [description]
	 */

	function generateWall(tmpWall, shift) {
		var newWall = {};

		if (typeof(tmpWall) === 'undefined' || typeof(tmpWall.points) === 'undefined') {
			return false;
		}

		newWall.blocks = [];

		var wallRotation = getRotation(tmpWall.points[0], tmpWall.points[1]);

		var noDoors = typeof(tmpWall.doors) === 'undefined' || tmpWall.doors.length === 0;
		var noWindows = typeof(tmpWall.windows) === 'undefined' || tmpWall.windows.length === 0;

		// no doors & windows on the wall
		// make the wall as a whole block
		if (noDoors && noWindows) {
			var newBlock = generateWallBlock(tmpWall, shift, wallRotation, _WALL_HEIGHT, _WALL_HEIGHT / 2, _DEFAULT_TEXTURE_REPEAT);
			newWall.blocks.push(newBlock);
		} else {
			var wallDeviders = [];
			if (!noDoors) {
				// convert data of doors
				newWall.doors = [];
				for (i in tmpWall.doors) {
					var tmpDoor = tmpWall.doors[i];
					var newDoor = generateDoor(tmpDoor, shift, wallRotation, _DOOR_HEIGHT);
					newWall.doors.push(newDoor);

					wallDeviders.push(getDevider(tmpDoor, _DOOR_TYPE, wallRotation));
				}
			}

			if (!noWindows) {
				// covert data of windows
				for (i in tmpWall.windows) {
					// code here...
				}
			}

			sortDeviders(wallDeviders, tmpWall);
			var devidedBlocks = genenrateDevidedWallBlocks(tmpWall, wallDeviders, shift, wallRotation);
			for (i in devidedBlocks) {
				newWall.blocks.push(devidedBlocks[i]);
			}
		}

		return newWall;
	}

	/**
	 * genenrate door according to data
	 * @param  {[type]} tmpDoor      [description]
	 * @param  {[type]} shift        [description]
	 * @param  {[type]} wallRotation [description]
	 * @return {[type]}              [description]
	 */

	function generateDoor(tmpDoor, shift, wallRotation, height) {
		var newDoor = {};

		// caculate position of door
		var doorX = (tmpDoor.position.x - shift.shift_x);
		var doorY = height / 2;
		var doorZ = tmpDoor.position.y - shift.shift_z;

		newDoor.position = {};
		newDoor.position.x = doorX / _CONVERT_ZOOM_FACTOR;
		newDoor.position.y = doorY;
		newDoor.position.z = doorZ / _CONVERT_ZOOM_FACTOR;

		newDoor.texture = {
			url: '/site_media/img/europe_door_texture.jpg',
			repeat: {
				x: 1,
				y: 1
			}
		};

		newDoor.rotation = wallRotation;
		newDoor.size = {};
		newDoor.size.x = tmpDoor.width / _CONVERT_ZOOM_FACTOR;
		newDoor.size.y = _DOOR_HEIGHT;
		newDoor.size.z = _DOOR_THICK;

		return newDoor;
	}


	/**
	 * generate wall block
	 * @param  {[type]} tmpWall      [description]
	 * @param  {[type]} shift        [description]
	 * @param  {[type]} wallRotation [description]
	 * @return {[type]}              [description]
	 */

	function generateWallBlock(tmpWall, shift, wallRotation, height, y, textureRepeat) {
		var newBlock = {};

		// calculate postion of the wall
		var wallX = (tmpWall.points[0].x + tmpWall.points[1].x) / 2 - shift.shift_x;
		var wallY = y;
		var wallZ = (tmpWall.points[0].y + tmpWall.points[1].y) / 2 - shift.shift_z;
		newBlock.position = {};
		newBlock.position.x = wallX / _CONVERT_ZOOM_FACTOR;
		newBlock.position.y = wallY;
		newBlock.position.z = wallZ / _CONVERT_ZOOM_FACTOR;

		// caculate rotaition of the wall
		newBlock.rotation = wallRotation;

		// caculate length of the wall
		var wallLength = getDistance(tmpWall.points[0], tmpWall.points[1]);
		newBlock.size = {};
		newBlock.size.x = wallLength / _CONVERT_ZOOM_FACTOR;
		newBlock.size.y = height;
		newBlock.size.z = _WALL_THICK;
		newBlock.texture = {
			url: '/site_media/img/red-brick-seamless-512-x-512.jpg',
			repeat: {
				x: (newBlock.size.x * _DEFAULT_TEXTURE_REPEAT) / _DEFAULT_TEXTURE_WIDTH,
				y: (newBlock.size.y * _DEFAULT_TEXTURE_REPEAT) / _DEFAULT_TEXTURE_HEIGHT
			}
		};

		return newBlock;
	}

	/**
	 * generate devided block of wall which has doors or windows
	 * @param  {[type]} tmpWall      [description]
	 * @param  {[type]} wallDeviders [description]
	 * @param  {[type]} shift        [description]
	 * @param  {[type]} wallRotation [description]
	 * @return {[type]}              [description]
	 */

	function genenrateDevidedWallBlocks(tmpWall, wallDeviders, shift, wallRotation) {
		var blocks = [];

		var deviderCount = wallDeviders.length;

		// array of points and types
		var wallType = [];
		var wallPoints = [];

		wallPoints.push(tmpWall.points[0]);
		wallType.push(_WALL_TYPE);

		for (i in wallDeviders) {
			wallPoints.push(wallDeviders[i].p1);
			wallType.push(wallDeviders[i].type);
			wallPoints.push(wallDeviders[i].p2);
			wallType.push(_WALL_TYPE);
		}
		wallPoints.push(tmpWall.points[1]);

		var ptCount = wallPoints.length - 1;

		for (var i = 0; i < ptCount; i++) {
			var wallParam = {
				points: [wallPoints[i], wallPoints[i + 1]]
			}

			var height = 0;
			var y = 0;
			var repeat = 0;
			switch (wallType[i]) {
				case _WALL_TYPE:
					height = _WALL_HEIGHT;
					y = _WALL_HEIGHT / 2;
					repeat = _DEFAULT_TEXTURE_REPEAT;
					break;
				case _DOOR_TYPE:
					height = _WALL_HEIGHT - _DOOR_HEIGHT;
					y = (_WALL_HEIGHT + _DOOR_HEIGHT) / 2;
					repeat = _DEFAULT_TEXTURE_REPEAT * (parseFloat(height) / _WALL_HEIGHT);
					break;
			}
			var newBlock = generateWallBlock(wallParam, shift, wallRotation, height, y, repeat);
			// if (height !== _WALL_HEIGHT) {
			blocks.push(newBlock);
			// }

		}

		return blocks;
	}

	/**
	 * genenrate Floor points by wall data
	 * @param  array walls [data of walls]
	 * @return {array}       [description]
	 */

	function generateFloor(walls) {
		if (walls === undefined) {
			return [];
		}

		// generate hashmap for further algorithm 
		var hashMap = {};
		for (i in walls) {
			for (j in walls[i].points) {
				var key = getPointKey(walls[i].points[j]);
				var value = walls[i].points[1 - j];

				if (hashMap[key] === undefined) {
					hashMap[key] = [];
				}
				hashMap[key].push(value);
			}
		}

		/*var rooms = [];
		var startKey = getPointKey(walls[0].points[0]);
		var room = {
			start : walls[0].points[0],
			points : [walls[0].points[0]],
			next : walls[0].points[0]
		}
		rooms.push(room);

		for (i in rooms) {
			var changed = false;
		}*/

		return [{
			points: [{
				x: 10,
				y: 0,
				z: 10
			},
			{
				x: 10,
				y: 0,
				z: -10
			},
			{
				x: -10,
				y: 0,
				z: -10
			},
			{
				x: -10,
				y: 0,
				z: 10
			}],
			texture : {
				url : '/site_media/img/mudiban063.jpg',
				repeat : {
					x:1,
					y:1
				}
			}
		}];
	}

	/**
	 * generate 3d model data by params
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	function generateModels(params) {
		return [
			{
				url : '/site_media/models/sofa.dae',
				scale : {
					x : 3,
					y : 3,
					z : 3
				},
				rotation : {
					x : Math.PI / 2,
					y : 0,
					z : 0
				},
				position : {
					x : 0,
					y : 1.5,
					z : 10
				},
				originSize : {
					x : 50,
					y : 10,
					z : 20
				},
				size : {
					x : 40,
					y : 10,
					z : 30
				}
			},
			{
				url : '/site_media/models/sofa.dae',
				scale : {
					x : 3,
					y : 3,
					z : 3
				},
				rotation : {
					x : Math.PI / 2,
					y : 0,
					z : 0
				},
				position : {
					x : 20,
					y : 1.5,
					z : 10
				},
				originSize : {
					x : 50,
					y : 10,
					z : 20
				},
				size : {
					x : 40,
					y : 10,
					z : 30
				}
			}
		];
	}


	/**
	 * get 3D editing data in json format
	 * @return {[type]} [description]
	 */

	function get3DJSON() {
		// get json data from 2d edit data
		// var editData = get2DJSON();

		// data for 3d scene
		var sceneData = {};

		// get coordinate shift value 
		var shift = getCoordinateShift();

		// generate 3d data for walls
		sceneData.walls = [];

		// loop to convert wall 2d data
		for (i in editData.walls) {
			var tmpWall = editData.walls[i];
			var newWall = generateWall(tmpWall, shift);
			if (newWall) sceneData.walls.push(newWall);
		}

		// convert floor data from wall data
		// sceneData.floors = [];
		var floors = generateFloor(editData.walls);
		sceneData.floors = floors;


		var models = generateModels(editData.furnitures);
		sceneData.models = models;

		return sceneData;
	}

	return get3DJSON;
}