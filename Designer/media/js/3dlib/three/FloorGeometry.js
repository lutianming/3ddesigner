/**
 * @author jonobr1 / http://jonobr1.com
 *
 * Creates a one-sided polygonal geometry from a path shape. Similar to
 * ExtrudeGeometry.
 *
 * parameters = {
 *
 *	curveSegments: <int>, // number of points on the curves. NOT USED AT THE MOMENT.
 *
 *	material: <int> // material index for front and back faces
 *	uvGenerator: <Object> // object that provides UV generator functions
 *
 * }
 **/

THREE.FloorGeometry = function ( shapes, options ) {

	THREE.Geometry.call( this );

	if ( shapes instanceof Array === false ) shapes = [ shapes ];

	this.shapebb = shapes[ shapes.length - 1 ].getBoundingBox();

	this.addShapeList( shapes, options );

	this.computeCentroids();
	this.computeFaceNormals();

};

THREE.FloorGeometry.prototype = Object.create( THREE.Geometry.prototype );

/**
 * Add an array of shapes to THREE.ShapeGeometry.
 */
THREE.FloorGeometry.prototype.addShapeList = function ( shapes, options ) {

	for ( var i = 0, l = shapes.length; i < l; i++ ) {

		this.addShape( shapes[ i ], options );

	}

	return this;

};

/**
 * Adds a shape to THREE.ShapeGeometry, based on THREE.ExtrudeGeometry.
 */
THREE.FloorGeometry.prototype.addShape = function ( shape, options ) {

	if ( options === undefined ) options = {};
	var curveSegments = options.curveSegments !== undefined ? options.curveSegments : 12;

	var material = options.material;
	// var uvgen = options.UVGenerator === undefined ? THREE.ExtrudeGeometry.WorldUVGenerator : options.UVGenerator;

	var shapebb = this.shapebb;

	//

	var i, l, hole, s;

	var shapesOffset = this.vertices.length;
	var shapePoints = shape.extractPoints( curveSegments );

	var vertices = shapePoints.shape;
	var holes = shapePoints.holes;

	var reverse = !THREE.Shape.Utils.isClockWise( vertices );

	if ( reverse ) {

		vertices = vertices.reverse();

		// Maybe we should also check if holes are in the opposite direction, just to be safe...

		for ( i = 0, l = holes.length; i < l; i++ ) {

			hole = holes[ i ];

			if ( THREE.Shape.Utils.isClockWise( hole ) ) {

				holes[ i ] = hole.reverse();

			}

		}

		reverse = false;

	}

	var faces = THREE.Shape.Utils.triangulateShape( vertices, holes );

	// Vertices

	var contour = vertices;

	for ( i = 0, l = holes.length; i < l; i++ ) {

		hole = holes[ i ];
		vertices = vertices.concat( hole );

	}

	//

	var vert, vlen = vertices.length;
	var face, flen = faces.length;
	var cont, clen = contour.length;

	for ( i = 0; i < vlen; i++ ) {

		vert = vertices[ i ];

		this.vertices.push( new THREE.Vector3( vert.x, 0, vert.y) );

	}

	for ( i = 0; i < flen; i++ ) {

		face = faces[ i ];

		var a = face[ 0 ] + shapesOffset;
		var b = face[ 1 ] + shapesOffset;
		var c = face[ 2 ] + shapesOffset;

		this.faces.push( new THREE.Face3( a, b, c, null, null, material ) );
		this.faceVertexUvs[ 0 ].push( this.generateUV( this, shape, options, a, b, c ) );

	}

};

THREE.FloorGeometry.prototype.generateUV = function(geometry, extrudedShape, extrudeOptions, indexA, indexB, indexC) {
	var ax = geometry.vertices[ indexA ].x,
		ay = geometry.vertices[ indexA ].z,

		bx = geometry.vertices[ indexB ].x,
		by = geometry.vertices[ indexB ].z,

		cx = geometry.vertices[ indexC ].x,
		cy = geometry.vertices[ indexC ].z;

	return [
		// new THREE.Vector2( ax, ay ),
		// new THREE.Vector2( bx, by ),
		// new THREE.Vector2( cx, cy )
		new THREE.Vector2( 0, 0 ),
		new THREE.Vector2( 0, 1),
		new THREE.Vector2( 1,1 )
	];
};
