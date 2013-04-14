var threeSceneData = {
	walls: [{
		position: [-33, 10, 0],
		texture: {
			url: 'img/red-brick-seamless-512-x-512.jpg',
			repeat: 3
		},
		rotation : 0,
		size: [0.1, 20, 66]
	}, {
		position: [33, 10, 0],
		texture: {
			url: 'img/red-brick-seamless-512-x-512.jpg',
			repeat: 3
		},
		size: [0.1, 20, 66]
	}, {
		position: [0, 10, -33],
		texture: {
			url: 'img/red-brick-seamless-512-x-512.jpg',
			repeat: 3
		},
		size: [66, 20, .1]
	}],

	floor: [{
		position: [0, 0, 0],
		texture: {
			url: 'img/Sand_002.JPG',
			repeat: 33
		},
		size: [66, 0.1, 66]
	}],

	ceiling: [{
		position: [0, 20, 0],
		texture: {
			url: 'img/Sand_002.JPG',
			repeat: 33
		},
		size: [66, 0.1, 66]
	}],

	doors: [{
		position: [-33 , 10 ,  0],
		texture : {
			url : 'img/Sand_002.JPG',
			repeat : 3
		},
		size : [ 0.2, 20 , 20 ]
	}]
}