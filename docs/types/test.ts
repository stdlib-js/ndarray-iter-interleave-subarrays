/*
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

import zeros = require( '@stdlib/ndarray-zeros' );
import nditerInterleaveSubarrays = require( './index' );


// TESTS //

// The function returns an iterator...
{
	const x = zeros( [ 2, 2, 2 ] );

	nditerInterleaveSubarrays( [ x, x ], 2 ); // $ExpectType Iterator<typedndarray<number>>
}

// The compiler throws an error if the function is provided a first argument which is not an array of ndarrays...
{
	nditerInterleaveSubarrays( '123', 2 );  // $ExpectError
	nditerInterleaveSubarrays( 123, 2 );  // $ExpectError
	nditerInterleaveSubarrays( true, 2 ); // $ExpectError
	nditerInterleaveSubarrays( false, 2 ); // $ExpectError
	nditerInterleaveSubarrays( null, 2 ); // $ExpectError
	nditerInterleaveSubarrays( undefined, 2 ); // $ExpectError
	nditerInterleaveSubarrays( {}, 2 ); // $ExpectError
	nditerInterleaveSubarrays( [ '5' ], 2 ); // $ExpectError
	nditerInterleaveSubarrays( ( x: number ): number => x, 2 ); // $ExpectError
}

// The compiler throws an error if the function is provided a second argument which is not a number...
{
	const x = zeros( [ 2, 2, 2 ] );

	nditerInterleaveSubarrays( [ x, x ], '123' );  // $ExpectError
	nditerInterleaveSubarrays( [ x, x ], true ); // $ExpectError
	nditerInterleaveSubarrays( [ x, x ], false ); // $ExpectError
	nditerInterleaveSubarrays( [ x, x ], null ); // $ExpectError
	nditerInterleaveSubarrays( [ x, x ], undefined ); // $ExpectError
	nditerInterleaveSubarrays( [ x, x ], {} ); // $ExpectError
	nditerInterleaveSubarrays( [ x, x ], [] ); // $ExpectError
	nditerInterleaveSubarrays( [ x, x ], ( x: number ): number => x ); // $ExpectError
}

// The compiler throws an error if the function is provided a third argument which is not an object...
{
	const x = zeros( [ 2, 2, 2 ] );

	nditerInterleaveSubarrays( [ x, x ], 2, 'abc' ); // $ExpectError
	nditerInterleaveSubarrays( [ x, x ], 2, 123 ); // $ExpectError
	nditerInterleaveSubarrays( [ x, x ], 2, true ); // $ExpectError
	nditerInterleaveSubarrays( [ x, x ], 2, false ); // $ExpectError
	nditerInterleaveSubarrays( [ x, x ], 2, null ); // $ExpectError
	nditerInterleaveSubarrays( [ x, x ], 2, [] ); // $ExpectError
	nditerInterleaveSubarrays( [ x, x ], 2, ( x: number ): number => x ); // $ExpectError
}

// The compiler throws an error if the function is provided an unsupported number of arguments...
{
	const x = zeros( [ 2, 2, 2 ] );

	nditerInterleaveSubarrays(); // $ExpectError
	nditerInterleaveSubarrays( [ x, x ] ); // $ExpectError
	nditerInterleaveSubarrays( [ x, x ], 2, {} ); // $ExpectError
}
