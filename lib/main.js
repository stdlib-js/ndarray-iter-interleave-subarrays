/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var setReadOnly = require( '@stdlib/utils-define-nonenumerable-read-only-property' );
var isArrayLikeObject = require( '@stdlib/assert-is-array-like-object' );
var isPositiveInteger = require( '@stdlib/assert-is-positive-integer' ).isPrimitive;
var iteratorSymbol = require( '@stdlib/symbol-iterator' );
var zeros = require( '@stdlib/array-base-zeros' );
var getShape = require( '@stdlib/ndarray-shape' );
var numel = require( '@stdlib/ndarray-base-numel' );
var ndslice = require( '@stdlib/ndarray-base-slice' );
var maybeBroadcastArrays = require( '@stdlib/ndarray-maybe-broadcast-arrays' );
var nextCartesianIndex = require( '@stdlib/ndarray-base-next-cartesian-index' ).assign;
var args2multislice = require( '@stdlib/slice-base-args2multislice' );
var format = require( '@stdlib/string-format' );


// MAIN //

/**
* Returns an iterator which iterates over interleaved subarrays.
*
* @param {ArrayLikeObject<ndarray>} arrays - input ndarrays
* @param {PositiveInteger} ndims - number of dimensions to stack after broadcasting
* @throws {TypeError} first argument must be an array of ndarrays
* @throws {TypeError} each ndarray after broadcasting must have at least `ndims+1` dimensions
* @throws {TypeError} second argument must be a positive integer
* @throws {Error} input ndarrays must be broadcast-compatible
* @returns {Iterator} iterator
*
* @example
* var array = require( '@stdlib/ndarray-array' );
* var ndarray2array = require( '@stdlib/ndarray-to-array' );
*
* var x = array( [ [ [ 1, 2 ], [ 3, 4 ] ], [ [ 5, 6 ], [ 7, 8 ] ] ] );
* // returns <ndarray>
*
* var iter = nditerInterleaveSubarrays( [ x, x ], 2 );
*
* var v = iter.next().value;
* // returns <ndarray>
*
* var arr = ndarray2array( v );
* // returns [ [ 1, 2 ], [ 3, 4 ] ]
*
* v = iter.next().value;
* // returns <ndarray>
*
* arr = ndarray2array( v );
* // returns [ [ 1, 2 ], [ 3, 4 ] ]
*
* // ...
*/
function nditerInterleaveSubarrays( arrays, ndims ) {
	var shape;
	var iter;
	var list;
	var FLG;
	var idx;
	var dim;
	var tmp;
	var S;
	var M;
	var N;
	var K;
	var i;
	var j;
	var k;

	if ( !isArrayLikeObject( arrays ) ) {
		throw new TypeError( format( 'invalid argument. First argument must be an array of ndarrays. Value: `%s`.', arrays ) );
	}
	if ( !isPositiveInteger( ndims ) ) {
		throw new TypeError( format( 'invalid argument. Second argument must be a positive integer. Value: `%s`.', ndims ) );
	}
	// Attempt to broadcast the input ndarrays...
	try {
		list = maybeBroadcastArrays( arrays );
	} catch ( err ) { // eslint-disable-line no-unused-vars
		throw new TypeError( format( 'invalid argument. First argument must be an array of ndarrays which are broadcast-compatible. Value: `%s`.', arrays ) );
	}
	K = list.length;

	// Retrieve input array meta data:
	shape = getShape( list[ 0 ] );
	M = shape.length;

	// Ensure that each broadcasted input array has sufficient dimensions...
	if ( M <= ndims ) {
		throw new TypeError( format( 'invalid argument. First argument must be an array of ndarrays having at least %d dimensions after broadcasting.', ndims+1 ) );
	}
	// Check whether the broadcasted shape is empty...
	N = numel( shape );
	if ( N === 0 ) {
		FLG = true;
	}
	// Compute the number of subarrays across all stacks of subarrays:
	dim = M - ndims - 1;
	for ( i = dim+1; i < M; i++ ) {
		N /= shape[ i ];
	}
	N *= K;
	S = shape[ dim ];

	// Initialize index arrays for generating slices...
	idx = [];
	for ( i = 0; i < K; i++ ) {
		tmp = zeros( M );

		// Set the last `ndims` elements to `null` to indicate that we want a full "slice" for the last `ndims` dimensions:
		for ( j = dim+1; j < M; j++ ) {
			tmp[ j ] = null;
		}
		idx.push( tmp );
	}
	// Initialize counters:
	i = -1;
	k = -1;

	// Create an iterator protocol-compliant object:
	iter = {};
	setReadOnly( iter, 'next', next );
	setReadOnly( iter, 'return', end );

	// If an environment supports `Symbol.iterator`, make the iterator iterable:
	if ( iteratorSymbol ) {
		setReadOnly( iter, iteratorSymbol, factory );
	}
	return iter;

	/**
	* Returns an iterator protocol-compliant object containing the next iterated value.
	*
	* @private
	* @returns {Object} iterator protocol-compliant object
	*/
	function next() {
		var ibuf;
		var s;
		var j;

		i += 1;
		if ( FLG || i >= N ) {
			return {
				'done': true
			};
		}
		k = ( k+1 ) % K;
		ibuf = idx[ k ];

		// Create a multi-slice for the current view:
		s = args2multislice( ibuf );

		// Update the index array:
		j = ( ibuf[ dim ] + 1 ) % S;
		ibuf[ dim ] = j;
		if ( j === 0 ) {
			// If we've iterated over all the subarrays in the current stack, move on to the next set of subarrays:
			ibuf = nextCartesianIndex( shape, 'row-major', ibuf, dim-1, ibuf );
		}
		// Return the next slice:
		return {
			'value': ndslice( list[ k ], s, true, false ),
			'done': false
		};
	}

	/**
	* Finishes an iterator.
	*
	* @private
	* @param {*} [value] - value to return
	* @returns {Object} iterator protocol-compliant object
	*/
	function end( value ) {
		FLG = true;
		if ( arguments.length ) {
			return {
				'value': value,
				'done': true
			};
		}
		return {
			'done': true
		};
	}

	/**
	* Returns a new iterator.
	*
	* @private
	* @returns {Iterator} iterator
	*/
	function factory() {
		return nditerInterleaveSubarrays( arrays, ndims );
	}
}


// EXPORTS //

module.exports = nditerInterleaveSubarrays;
