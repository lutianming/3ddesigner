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
	var _WALL_DEFAULT_TEXTURE_URL = '/site_media/img/red-brick-seamless-512-x-512.jpg';

	var _DOOR_THICK = 0.1;
	var _DOOR_HEIGHT = 12;
	var _DOOR_DEFAULT_TEXTURE_URL = '/site_media/img/europe_door_texture.jpg';

	var _WINDOW_THICK = 0.1;
	var _WINDOW_HEIGHT = 8;
	var _WINDOW_Y_POS = 10;
	var _WINDOW_DEFAULT_TEXTURE_URL = '/site_media/img/default-window-texture.jpg';


	var _WALL_TYPE = 0;
	var _DOOR_TYPE = 1;
	var _WINDOW_TYPE = 2;

	var _DEFAULT_TEXTURE_REPEAT = 2;
	var _DEFAULT_TEXTURE_WIDTH = 50.0;
	var _DEFAULT_TEXTURE_HEIGHT = 25.0;

	var _FLOOR_DEFAULT_TEXTURE_URL = '/site_media/img/floor-brick.jpg';
	// var _FLOOR_DEFAULT_TEXTURE_URL = '/site_media/img/red-brick-seamless-512-x-512.jpg';

	var _FLOOR_TEXTURE_REPEAT_X = 1;
	var _FLOOR_TEXTURE_REPEAT_Y = 1;

	var _DEFAULT_MODEL_URL = ['/site_media/models/office_desk.dae','/site_media/models/TV.dae','/site_media/models/blenderess_sofa_4seater1.dae'];
	var _DEFAULT_MODEL_SCALE = [{x:1.0,y:1.0,z:1.0},{x:0.4,y:0.4,z:0.4},{x:1.2,y:1.2,z:1.2}]


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
	 * point p1 equals to point p2
	 * @param  {[type]} p1 [description]
	 * @param  {[type]} p2 [description]
	 * @return {[type]}    [description]
	 */
	function pointEquals(p1, p2) {
		return (p1.x == p2.x) && (p1.y == p2.y);
	}

	/**
	 * get Coordinate shift of 3d
	 * place the scene at root (0,0,0)
	 * @return Object (shif_x,shift_z)
	 */

	function getCoordinateShift() {
		var maxX = 0;
		var maxY = 0;
		var minX = Infinity;
		var minY = Infinity;

		for (var i in editData.walls) {
			var tmpWall = editData.walls[i];
			for (var j in tmpWall.points) {
				var point = tmpWall.points[j];
				maxX = (point.x > maxX) ? point.x : maxX;
				maxY = (point.y > maxY) ? point.y : maxY;
				minX = (point.x < minX) ? point.x : minX;
				minY = (point.y < minY) ? point.x : minY;
			}
		}

		var shift = {
			/*shift_x: (maxX + minX) / 2.0,
			shift_z: (maxY + minY) / 2.0*/
			shift_x : maxX/2.0,
			shift_z : maxY/2.0
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
				for (var i in tmpWall.doors) {
					var tmpDoor = tmpWall.doors[i];
					var newDoor = generateDoor(tmpDoor, shift, wallRotation, _DOOR_HEIGHT);
					newWall.doors.push(newDoor);

					wallDeviders.push(getDevider(tmpDoor, _DOOR_TYPE, wallRotation));
				}
			}

			if (!noWindows) {
				// covert data of windows
				newWall.windows = [];
				for (var i in tmpWall.windows) {
					var tmpWindow = tmpWall.windows[i];
					var newWindow = generateWindow(tmpWindow, shift, wallRotation, _WINDOW_HEIGHT, _WINDOW_Y_POS);
					newWall.windows.push(newWindow)

					wallDeviders.push(getDevider(tmpWindow, _WINDOW_TYPE, wallRotation));
				}
			}

			sortDeviders(wallDeviders, tmpWall);
			var devidedBlocks = genenrateDevidedWallBlocks(tmpWall, wallDeviders, shift, wallRotation);
			for (var i in devidedBlocks) {
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
			url: _DOOR_DEFAULT_TEXTURE_URL,
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
	 * [generateWindow description]
	 * @param  {[type]} tmpWindow    [description]
	 * @param  {[type]} shift        [description]
	 * @param  {[type]} wallRotation [description]
	 * @param  {[type]} height       [description]
	 * @return {[type]}              [description]
	 */
	function generateWindow(tmpWindow, shift, wallRotation, height, yPos) {
		var newWindow = {};

		// caculate position of door
		var windowX = tmpWindow.position.x - shift.shift_x;
		var windowY = yPos;
		var windowZ = tmpWindow.position.y - shift.shift_z;

		newWindow.position = {};
		newWindow.position.x = windowX / _CONVERT_ZOOM_FACTOR;
		newWindow.position.y = windowY;
		newWindow.position.z = windowZ / _CONVERT_ZOOM_FACTOR;

		newWindow.texture = {
			url: _WINDOW_DEFAULT_TEXTURE_URL,
			repeat: {
				x: 1,
				y: 1
			}
		};

		newWindow.rotation = wallRotation;
		newWindow.size = {};
		newWindow.size.x = tmpWindow.width / _CONVERT_ZOOM_FACTOR;
		newWindow.size.y = _WINDOW_HEIGHT;
		newWindow.size.z = _WINDOW_THICK;

		return newWindow;		
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
			url: _WALL_DEFAULT_TEXTURE_URL,
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

		for (var i in wallDeviders) {
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

			var height = [];
			var y = [];
			var repeat = [];
			switch (wallType[i]) {
				case _WALL_TYPE:
					height.push(_WALL_HEIGHT);
					y.push(_WALL_HEIGHT / 2);
					repeat.push(_DEFAULT_TEXTURE_REPEAT);
					break;

				case _DOOR_TYPE:
					height.push(_WALL_HEIGHT - _DOOR_HEIGHT);
					y.push((_WALL_HEIGHT + _DOOR_HEIGHT) / 2);
					repeat.push(_DEFAULT_TEXTURE_REPEAT * (parseFloat(height) / _WALL_HEIGHT));
					break;

				case _WINDOW_TYPE:
					var y1 = (_WINDOW_Y_POS - _WINDOW_HEIGHT / 2) / 2;
					var y2 = (_WINDOW_HEIGHT / 2 + _WINDOW_Y_POS + _WALL_HEIGHT) / 2;
					y.push(y1);
					y.push(y2);

					var h1 =  _WINDOW_Y_POS - _WINDOW_HEIGHT / 2;
					var h2 =  _WALL_HEIGHT - _WINDOW_Y_POS - _WINDOW_HEIGHT / 2;
					height.push(h1);
					height.push(h2);

					repeat.push(_DEFAULT_TEXTURE_REPEAT*(parseFloat(h1) / _WALL_HEIGHT));
					repeat.push(_DEFAULT_TEXTURE_REPEAT*(parseFloat(h2) / _WALL_HEIGHT));
					break;
			}

			for (var j in height) {
				var newBlock = generateWallBlock(wallParam, shift, wallRotation, height[j], y[j], repeat[j]);
				blocks.push(newBlock);	
			}
			

		}

		return blocks;
	}

	/**
	 * genenrate Floor points by wall data
	 * @param  array walls [data of walls]
	 * @return {array}       [description]
	 */

	function generateFloor(walls, shift) {
		if (walls === undefined) {
			return [];
		}

		// generate hashmap for further algorithm 
		var hashMap = {};
		var allPoints = [];
		var visitedPoints = [];

		for (var i in walls) {
			for (var j in walls[i].points) {
				var key = getPointKey(walls[i].points[j]);
				var value = walls[i].points[1 - j];

				if (hashMap[key] === undefined) {
					hashMap[key] = [];
				}
				// if (!pointInArray(value, hashMap[key])) {
					hashMap[key].push(value);	
				// }
				
				if (!pointInArray(value,allPoints)) {
					allPoints.push(value);	
				}
			}
		}

		// generate rooms
		var rooms = [];
		while (visitedPoints.length != allPoints.length) {
			var tmpRooms =  generateRoom(allPoints, visitedPoints, hashMap);
			for (var i in tmpRooms) {
				rooms.push(tmpRooms[i]);	
			}
		}

		
		var results = [];

		// convert rooms
		for (var i in rooms) {
			var tmp = {};

			var points = convertRoomPoints(rooms[i], shift);
			tmp.points = points;
			tmp.texture =  {
				url : _FLOOR_DEFAULT_TEXTURE_URL,
				repeat : {
					x : _FLOOR_TEXTURE_REPEAT_X,
					y : _FLOOR_TEXTURE_REPEAT_Y
				}
			}
			results.push(tmp);
		}

		return results;
	}

	/**
	 * generate room points
	 * @param  {[type]} allPoints     [description]
	 * @param  {[type]} visitedPoints [description]
	 * @param  {[type]} hashMap       [description]
	 * @return {[type]}               [description]
	 */
	function generateRoom(allPoints, visitedPoints, hashMap) {
		var startPoint;
		for (var i =0 ; i<allPoints.length; i++){
			if ( !pointInArray(allPoints[i],visitedPoints) ) {
				startPoint = allPoints[i];
				break;
			}
		}
		if ( startPoint === undefined ) {
			return;
		}

		/*init first point situation*/
		var dests = hashMap[getPointKey(startPoint)];
		var len = 1;
		var path = [[startPoint]];
		var lasts = [startPoint];

		while( !pointInArray(startPoint, lasts) || len ===1) {
			var len = lasts.length;
			for (var i =0 ; i<len ; i++) {
				var curPoint = lasts[i];
				var curPath = cloneArray(path[i]);
				var pathLen = curPath.length;
				var prevPoint = (pathLen>2)? curPath[pathLen-2] : curPath[0];

				var dests = hashMap[getPointKey(curPoint)];
				
				
				var moreCount = 0;

				for ( var j in dests ){
					if ( !pointEquals(prevPoint, dests[j])) {
						if (moreCount == 0) {
							path[i].push(dests[j]);
							lasts[i] = dests[j];
						}
						else {
							var tmpPath = cloneArray(curPath);
							tmpPath.push(dests[j]);
							path.push(tmpPath);
							lasts.push(dests[j]);
						}
						moreCount ++ ;
					}
				}
			}
			len ++;
		}

		var indexes = [];
		for ( var i in lasts ) {
			if (pointEquals(lasts[i], startPoint)) {
				indexes.push( i );
			}
		}

		var rooms = [];
		for (var i in indexes) {
			var tmp = path[ indexes[i] ];
			tmp.pop();
			if (!roomInArray(tmp,rooms)) {
				rooms.push(tmp);
			}
		}

		for ( var i in rooms ){
			for (var j in rooms[i]) {
				if (!pointInArray(rooms[i][j], visitedPoints)) {
					visitedPoints.push(rooms[i][j]);
				}
			}
		}

		return rooms;
	}

	/**
	 * convert 2d room points to 3d points
	 * @param  {[type]} room  [description]
	 * @param  {[type]} shift [description]
	 * @return {[type]}       [description]
	 */
	function convertRoomPoints(room, shift ) {
		var points = [];

		//select four corners of a room
		/*if (room.length > 4) {
			for (var i = 0; i<room.length-2;) {
				var p1 = room[i];
				var p2 = room[i+1];
				var p3 = room[i+2];

				if (checkPointsOnLine(p1, p2 ,p3)) {
					for (var j=i+1; j<room.length-1 ;j++) {
						room[j] = room[j+1];
					}
					room.pop();
				}
				else {
					i++;
				}
			}	
		}*/
		
		for (var i in room) {
			var p = {
				x : (room[i].x - shift.shift_x) / _CONVERT_ZOOM_FACTOR,
				y : 0,
				z : (room[i].y - shift.shift_z) / _CONVERT_ZOOM_FACTOR
			};
			points.push(p);
		}

		return points;
	}

	/**
	 * check if three points on same line
	 * @param  {[type]} p1 [description]
	 * @param  {[type]} p2 [description]
	 * @param  {[type]} p3 [description]
	 * @return false if not on one line
	 *                  middle point if on same line
	 */
	function checkPointsOnLine(p1, p2, p3) {
		var k1 = (p2.y - p1.y) / (p2.x - p1.x);
		var k2 = (p3.y - p2.y) / (p3.x - p2.x);

		return k1===k2;

	}

	/**
	 * check point in point array
	 * @param  {[type]} point         [description]
	 * @param  {[type]} visitedPoints [description]
	 * @return {[type]}               [description]
	 */
	function pointInArray(point, visitedPoints) {
		if (visitedPoints===undefined|| visitedPoints.length===0){
			return false;
		}

		for (var i in visitedPoints){
			if ( pointEquals(point,visitedPoints[i]) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * check room in room array
	 * @param  {[type]} room      [description]
	 * @param  {[type]} roomArray [description]
	 * @return {[type]}           [description]
	 */
	
	function roomInArray(room, roomArray) {
		if (roomArray===undefined || roomArray.length==0) {
			return false;
		}

		for (var i in roomArray) {
			var tmp = roomArray[i];
			if (tmp.length != room.length) {
				continue;
			}
			var len = room.length;
			var res = false;
			for ( var j = 1; j<len ;j++) {
				if (pointEquals(tmp[j], room[len-j])) {
					res = true;
				}
				else {
					res = false;
					break;
				}
			}
			if (res) {
				return true;
			}
		}
		return false;
	}

	/**
	 * clone array
	 * @param  {[type]} arr [description]
	 * @return {[type]}     [description]
	 */
	function cloneArray(arr) {
		var newArray = [];

		for (var i in arr) {
			newArray.push(arr[i]);
		}

		return newArray;
	}

	/**
	 * generate Model data
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	function generateModels(params, shift) {
		if (params === undefined) {
			return;
		}

		var models = [];
		var len = 3;

		for (var i in params) {
			var model = {};
			var param = params[i];

			
			model.position = {
				x : (param.position.x - shift.shift_x) / _CONVERT_ZOOM_FACTOR,
				y : (param.baseY === undefined)? 0 : param.baseY,
				z : (param.position.y - shift.shift_z) / _CONVERT_ZOOM_FACTOR
			};

			model.rotation = {
				x : Math.PI / 2,
				y : 0,
				z : param.rotation
			};

			model.size = {
				x : param.size.x / _CONVERT_ZOOM_FACTOR,
				y : 10,
				z : param.size.y / _CONVERT_ZOOM_FACTOR 
			};

			/*model.originSize = {
				x : param.modelSize.x,
				y : param.modelSize.y,
				z : param.size.z
			}*/

			/*if (param.scale === undefined ) {
				model.scale = _DEFAULT_MODEL_SCALE[i%len];
			}*/

			/*model.scale = {
				x : model.size.x / model.originSize.x,
				y : model.size.y / model.originSize.y,
				z : model.size.z / model.originSize.z
			}*/

			// model.url = param.url;

			models.push(model);
		}

		return models;
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
		for (var i in editData.walls) {
			var tmpWall = editData.walls[i];
			var newWall = generateWall(tmpWall, shift);
			if (newWall) sceneData.walls.push(newWall);
		}

		// convert floor data from wall data
		// sceneData.floors = [];
		var floors = generateFloor(editData.walls, shift);
		sceneData.floors = floors;

		var models = generateModels(editData.furnitures, shift);
		sceneData.models = models;

		return sceneData;
	}

	return get3DJSON;
}