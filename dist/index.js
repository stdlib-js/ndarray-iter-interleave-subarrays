"use strict";var I=function(t,r){return function(){return r||t((r={exports:{}}).exports,r),r.exports}};var j=I(function(M,S){
var q=require('@stdlib/utils-define-nonenumerable-read-only-property/dist'),V=require('@stdlib/assert-is-array-like-object/dist'),k=require('@stdlib/assert-is-positive-integer/dist').isPrimitive,w=require('@stdlib/symbol-iterator/dist'),A=require('@stdlib/array-base-zeros/dist'),L=require('@stdlib/ndarray-shape/dist'),O=require('@stdlib/ndarray-base-numel/dist'),P=require('@stdlib/ndarray-base-slice/dist'),z=require('@stdlib/ndarray-maybe-broadcast-arrays/dist'),B=require('@stdlib/ndarray-base-next-cartesian-index/dist').assign,C=require('@stdlib/slice-base-args2multislice/dist'),d=require('@stdlib/error-tools-fmtprodmsg/dist');function x(t,r){var n,v,l,g,c,i,h,b,u,o,f,e,m,s;if(!V(t))throw new TypeError(d('1zZGd',t));if(!k(r))throw new TypeError(d('1zZ45',r));try{l=z(t)}catch(a){throw new TypeError(d('1zZGe',t))}if(f=l.length,n=L(l[0]),u=n.length,u<=r)throw new TypeError(d('1zZGf',r+1));for(o=O(n),o===0&&(g=!0),i=u-r-1,e=i+1;e<u;e++)o/=n[e];for(o*=f,b=n[i],c=[],e=0;e<f;e++){for(h=A(u),m=i+1;m<u;m++)h[m]=null;c.push(h)}return e=-1,s=-1,v={},q(v,"next",E),q(v,"return",F),w&&q(v,w,T),v;function E(){var a,p,y;return e+=1,g||e>=o?{done:!0}:(s=(s+1)%f,a=c[s],p=C(a),y=(a[i]+1)%b,a[i]=y,y===0&&(a=B(n,"row-major",a,i-1,a)),{value:P(l[s],p,!0,!1),done:!1})}function F(a){return g=!0,arguments.length?{value:a,done:!0}:{done:!0}}function T(){return x(t,r)}}S.exports=x
});var G=j();module.exports=G;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
