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

var bench = require( '@stdlib/bench-harness' );
var isIteratorLike = require( '@stdlib/assert-is-iterator-like' );
var isndarrayLike = require( '@stdlib/assert-is-ndarray-like' );
var array = require( '@stdlib/ndarray-array' );
var pkg = require( './../package.json' ).name;
var nditerInterleaveSubarrays = require( './../lib' );


// MAIN //

bench( pkg, function benchmark( b ) {
	var iter;
	var x;
	var i;

	x = array( [ [ [ 1, 2, 3, 4 ] ] ] );

	b.tic();
	for ( i = 0; i < b.iterations; i++ ) {
		iter = nditerInterleaveSubarrays( [ x, x ], 2 );
		if ( typeof iter !== 'object' ) {
			b.fail( 'should return an object' );
		}
	}
	b.toc();
	if ( !isIteratorLike( iter ) ) {
		b.fail( 'should return an iterator protocol-compliant object' );
	}
	b.pass( 'benchmark finished' );
	b.end();
});

bench( pkg+'::iteration', function benchmark( b ) {
	var xbuf;
	var iter;
	var x;
	var z;
	var i;

	xbuf = [];
	xbuf.length = b.iterations + 1;
	x = array( xbuf, {
		'shape': [ xbuf.length, 1, 1 ],
		'dtype': 'generic',
		'copy': false
	});

	iter = nditerInterleaveSubarrays( [ x, x ], 2 );

	b.tic();
	for ( i = 0; i < b.iterations; i++ ) {
		z = iter.next().value;
		if ( typeof z !== 'object' ) {
			b.fail( 'should return an ndarray' );
		}
	}
	b.toc();
	if ( !isndarrayLike( z ) ) {
		b.fail( 'should return an ndarray' );
	}
	b.pass( 'benchmark finished' );
	b.end();
});
