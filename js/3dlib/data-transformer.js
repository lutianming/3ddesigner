/**
 * [Data Transformer to convert data from 2d to 3d
 * @return {[type]} [description]
 */

function _DataTransformer() {
	/**
	 * CONSTANT VALUES FOR SCENE
	 * @type {Number}
	 */
	var _WALL_THICK = 0.1;
	var _WALL_HEIGHT = 20;
	var _DOOR_THICK = 0.2;
	var _DOOR_HEIGHT = 16;

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
	 * generate 3d data wall from tmpWall params
	 * @return {[type]} [description]
	 */

	function generateWall(tmpWall, shift) {
		var newWall = {};

		if (typeof(tmpWall) === 'undefined' || typeof(tmpWall.points) === 'undefined') {
			return false;
		}

		// calculate postion of the wall
		var wallX = (tmpWall.points[0].x + tmpWall.points[1].x) / 2 - shift.shift_x;
		var wallY = _WALL_HEIGHT / 2;
		var wallZ = (tmpWall.points[0].y + tmpWall.points[1].y) / 2 - shift.shift_z;
		newWall.position = [wallX / _CONVERT_ZOOM_FACTOR, wallY / _CONVERT_ZOOM_FACTOR, wallZ / _CONVERT_ZOOM_FACTOR];

		// caculate rotaition of the wall
		newWall.rotation = getRotation(tmpWall.points[0], tmpWall.points[1]);

		// caculate length of the wall
		var wallLength = getDistance(tmpWall.points[0], tmpWall.points[1]);
		newWall.size = [wallLength / _CONVERT_ZOOM_FACTOR, _WALL_HEIGHT, _WALL_THICK];
		newWall.texture = {
			url: 'img/red-brick-seamless-512-x-512.jpg',
			repeat: 3
		};

		if (typeof(tmpWall.doors) === 'undefined') {
			return newWall;
		}

		// convert data of doors
		newWall.doors = [];
		for (i in tmpWall.doors) {
			var tmpDoor = tmpWall.doors[i];
			var newDoor = {};

			// caculate postion of door
			var doorX = tmpDoor.position.x - shift.shift_x;
			var doorY = _DOOR_HEIGHT / 2;
			var doorZ = tmpDoor.position.y - shift.shift_z;

			newDoor.position = [doorX, doorY , doorZ];
			newWall.doors.push(newDoor);
		}

		return newWall;
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

		// loop to convert 2d data
		for (i in editData.walls) {
			var tmpWall = editData.walls[i];
			var newWall = generateWall(tmpWall, shift);
			if (newWall) sceneData.walls.push(newWall);
		}
		return sceneData;
	}

	return get3DJSON;
}