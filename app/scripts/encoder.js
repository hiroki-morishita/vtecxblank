// aardwulf systems
// This work is licensed under a Creative Commons License.
// http://www.aardwulf.com/tutor/base64/
// TITLE
// TempersFewGit v 2.1 (ISO 8601 Time/Date script) 
//
// OBJECTIVE
// Javascript script to detect the time zone where a browser
// is and display the date and time in accordance with the 
// ISO 8601 standard.
//
// AUTHOR
// John Walker 
// http://321WebLiftOff.net
// jfwalker@ureach.com
//
// ENCOMIUM
// Thanks to Stephen Pugh for his help.
//
// CREATED
// 2000-09-15T09:42:53+01:00 
//
// REFERENCES
// For more about ISO 8601 see:
// http://www.w3.org/TR/NOTE-datetime
// http://www.cl.cam.ac.uk/~mgk25/iso-time.html
//
// COPYRIGHT
// This script is Copyright  2000 JF Walker All Rights 
// Reserved but may be freely used provided this colophon is 
// included in full.
//
function encode64(r){var a,t,e,n,s,h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",o="",c="",d="",f=0;do a=r.charCodeAt(f++),t=r.charCodeAt(f++),c=r.charCodeAt(f++),e=a>>2,n=(3&a)<<4|t>>4,s=(15&t)<<2|c>>6,d=63&c,isNaN(t)?s=d=64:isNaN(c)&&(d=64),o=o+h.charAt(e)+h.charAt(n)+h.charAt(s)+h.charAt(d),a=t=c="",e=n=s=d="";while(f<r.length);return o}function isodatetime(){var r=new Date,a=r.getYear();2e3>a&&(a+=1900);var t=r.getMonth()+1,e=r.getDate(),n=r.getHours(),s=r.getUTCHours(),h=n-s;h>12&&(h-=24),-12>=h&&(h+=24);var o,c,d=Math.abs(h),f=r.getMinutes(),u=r.getUTCMinutes(),i=r.getSeconds();return f!=u&&30>u&&0>h&&d--,f!=u&&u>30&&h>0&&d--,o=f!=u?":30":":00",c=10>d?"0"+d+o:""+d+o,c=0>h?"-"+c:"+"+c,9>=t&&(t="0"+t),9>=e&&(e="0"+e),9>=n&&(n="0"+n),9>=f&&(f="0"+f),9>=i&&(i="0"+i),time=a+"-"+t+"-"+e+"T"+n+":"+f+":"+i+c,time}function b64_sha1(r){return binb2b64(core_sha1(str2binb(r),r.length*chrsz))}function safe_add(r,a){var t=(65535&r)+(65535&a),e=(r>>16)+(a>>16)+(t>>16);return e<<16|65535&t}function rol(r,a){return r<<a|r>>>32-a}function sha1_ft(r,a,t,e){return 20>r?a&t|~a&e:40>r?a^t^e:60>r?a&t|a&e|t&e:a^t^e}function sha1_kt(r){return 20>r?1518500249:40>r?1859775393:60>r?-1894007588:-899497514}function binb2b64(r){for(var a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",t="",e=0;e<4*r.length;e+=3)for(var n=(r[e>>2]>>8*(3-e%4)&255)<<16|(r[e+1>>2]>>8*(3-(e+1)%4)&255)<<8|r[e+2>>2]>>8*(3-(e+2)%4)&255,s=0;4>s;s++)t+=8*e+6*s>32*r.length?b64pad:a.charAt(n>>6*(3-s)&63);return t}function core_sha1(r,a){r[a>>5]|=128<<24-a%32,r[(a+64>>9<<4)+15]=a;for(var t=Array(80),e=1732584193,n=-271733879,s=-1732584194,h=271733878,o=-1009589776,c=0;c<r.length;c+=16){for(var d=e,f=n,u=s,i=h,_=o,b=0;80>b;b++){16>b?t[b]=r[c+b]:t[b]=rol(t[b-3]^t[b-8]^t[b-14]^t[b-16],1);var g=safe_add(safe_add(rol(e,5),sha1_ft(b,n,s,h)),safe_add(safe_add(o,t[b]),sha1_kt(b)));o=h,h=s,s=rol(n,30),n=e,e=g}e=safe_add(e,d),n=safe_add(n,f),s=safe_add(s,u),h=safe_add(h,i),o=safe_add(o,_)}return Array(e,n,s,h,o)}function str2binb(r){for(var a=Array(),t=(1<<chrsz)-1,e=0;e<r.length*chrsz;e+=chrsz)a[e>>5]|=(r.charCodeAt(e/chrsz)&t)<<32-chrsz-e%32;return a}var chrsz=8,b64pad="=";
/*
 A JavaScript implementation of the SHA family of hashes, as
 defined in FIPS PUB 180-2 as well as the corresponding HMAC implementation
 as defined in FIPS PUB 198a

 Copyright Brian Turek 2008-2013
 Distributed under the BSD License
 See http://caligatio.github.com/jsSHA/ for more information

 Several functions taken from Paul Johnston
*/
(function(B){function r(a,c,b){var f=0,e=[0],g="",h=null,g=b||"UTF8";if("UTF8"!==g&&"UTF16"!==g)throw"encoding must be UTF8 or UTF16";if("HEX"===c){if(0!==a.length%2)throw"srcString of HEX type must be in byte increments";h=u(a);f=h.binLen;e=h.value}else if("ASCII"===c||"TEXT"===c)h=v(a,g),f=h.binLen,e=h.value;else if("B64"===c)h=w(a),f=h.binLen,e=h.value;else throw"inputFormat must be HEX, TEXT, ASCII, or B64";this.getHash=function(a,c,b,g){var h=null,d=e.slice(),l=f,m;3===arguments.length?"number"!==
typeof b&&(g=b,b=1):2===arguments.length&&(b=1);if(b!==parseInt(b,10)||1>b)throw"numRounds must a integer >= 1";switch(c){case "HEX":h=x;break;case "B64":h=y;break;default:throw"format must be HEX or B64";}if("SHA-224"===a)for(m=0;m<b;m++)d=q(d,l,a),l=224;else if("SHA-256"===a)for(m=0;m<b;m++)d=q(d,l,a),l=256;else throw"Chosen SHA variant is not supported";return h(d,z(g))};this.getHMAC=function(a,b,c,h,k){var d,l,m,n,A=[],s=[];d=null;switch(h){case "HEX":h=x;break;case "B64":h=y;break;default:throw"outputFormat must be HEX or B64";
}if("SHA-224"===c)l=64,n=224;else if("SHA-256"===c)l=64,n=256;else throw"Chosen SHA variant is not supported";if("HEX"===b)d=u(a),m=d.binLen,d=d.value;else if("ASCII"===b||"TEXT"===b)d=v(a,g),m=d.binLen,d=d.value;else if("B64"===b)d=w(a),m=d.binLen,d=d.value;else throw"inputFormat must be HEX, TEXT, ASCII, or B64";a=8*l;b=l/4-1;l<m/8?(d=q(d,m,c),d[b]&=4294967040):l>m/8&&(d[b]&=4294967040);for(l=0;l<=b;l+=1)A[l]=d[l]^909522486,s[l]=d[l]^1549556828;c=q(s.concat(q(A.concat(e),a+f,c)),a+n,c);return h(c,
z(k))}}function v(a,c){var b=[],f,e=[],g=0,h;if("UTF8"===c)for(h=0;h<a.length;h+=1)for(f=a.charCodeAt(h),e=[],2048<f?(e[0]=224|(f&61440)>>>12,e[1]=128|(f&4032)>>>6,e[2]=128|f&63):128<f?(e[0]=192|(f&1984)>>>6,e[1]=128|f&63):e[0]=f,f=0;f<e.length;f+=1)b[g>>>2]|=e[f]<<24-g%4*8,g+=1;else if("UTF16"===c)for(h=0;h<a.length;h+=1)b[g>>>2]|=a.charCodeAt(h)<<16-g%4*8,g+=2;return{value:b,binLen:8*g}}function u(a){var c=[],b=a.length,f,e;if(0!==b%2)throw"String of HEX type must be in byte increments";for(f=0;f<
b;f+=2){e=parseInt(a.substr(f,2),16);if(isNaN(e))throw"String of HEX type contains invalid characters";c[f>>>3]|=e<<24-f%8*4}return{value:c,binLen:4*b}}function w(a){var c=[],b=0,f,e,g,h,k;if(-1===a.search(/^[a-zA-Z0-9=+\/]+$/))throw"Invalid character in base-64 string";f=a.indexOf("=");a=a.replace(/\=/g,"");if(-1!==f&&f<a.length)throw"Invalid '=' found in base-64 string";for(e=0;e<a.length;e+=4){k=a.substr(e,4);for(g=h=0;g<k.length;g+=1)f="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(k[g]),
h|=f<<18-6*g;for(g=0;g<k.length-1;g+=1)c[b>>2]|=(h>>>16-8*g&255)<<24-b%4*8,b+=1}return{value:c,binLen:8*b}}function x(a,c){var b="",f=4*a.length,e,g;for(e=0;e<f;e+=1)g=a[e>>>2]>>>8*(3-e%4),b+="0123456789abcdef".charAt(g>>>4&15)+"0123456789abcdef".charAt(g&15);return c.outputUpper?b.toUpperCase():b}function y(a,c){var b="",f=4*a.length,e,g,h;for(e=0;e<f;e+=3)for(h=(a[e>>>2]>>>8*(3-e%4)&255)<<16|(a[e+1>>>2]>>>8*(3-(e+1)%4)&255)<<8|a[e+2>>>2]>>>8*(3-(e+2)%4)&255,g=0;4>g;g+=1)b=8*e+6*g<=32*a.length?b+
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(h>>>6*(3-g)&63):b+c.b64Pad;return b}function z(a){var c={outputUpper:!1,b64Pad:"="};try{a.hasOwnProperty("outputUpper")&&(c.outputUpper=a.outputUpper),a.hasOwnProperty("b64Pad")&&(c.b64Pad=a.b64Pad)}catch(b){}if("boolean"!==typeof c.outputUpper)throw"Invalid outputUpper formatting option";if("string"!==typeof c.b64Pad)throw"Invalid b64Pad formatting option";return c}function k(a,c){return a>>>c|a<<32-c}function I(a,c,b){return a&
c^~a&b}function J(a,c,b){return a&c^a&b^c&b}function K(a){return k(a,2)^k(a,13)^k(a,22)}function L(a){return k(a,6)^k(a,11)^k(a,25)}function M(a){return k(a,7)^k(a,18)^a>>>3}function N(a){return k(a,17)^k(a,19)^a>>>10}function O(a,c){var b=(a&65535)+(c&65535);return((a>>>16)+(c>>>16)+(b>>>16)&65535)<<16|b&65535}function P(a,c,b,f){var e=(a&65535)+(c&65535)+(b&65535)+(f&65535);return((a>>>16)+(c>>>16)+(b>>>16)+(f>>>16)+(e>>>16)&65535)<<16|e&65535}function Q(a,c,b,f,e){var g=(a&65535)+(c&65535)+(b&
65535)+(f&65535)+(e&65535);return((a>>>16)+(c>>>16)+(b>>>16)+(f>>>16)+(e>>>16)+(g>>>16)&65535)<<16|g&65535}function q(a,c,b){var f,e,g,h,k,q,r,C,u,d,l,m,n,A,s,p,v,w,x,y,z,D,E,F,G,t=[],H,B=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,
3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];d=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428];f=[1779033703,3144134277,1013904242,
2773480762,1359893119,2600822924,528734635,1541459225];if("SHA-224"===b||"SHA-256"===b)l=64,A=16,s=1,G=Number,p=O,v=P,w=Q,x=M,y=N,z=K,D=L,F=J,E=I,d="SHA-224"===b?d:f;else throw"Unexpected error in SHA-2 implementation";a[c>>>5]|=128<<24-c%32;a[(c+65>>>9<<4)+15]=c;H=a.length;for(m=0;m<H;m+=A){c=d[0];f=d[1];e=d[2];g=d[3];h=d[4];k=d[5];q=d[6];r=d[7];for(n=0;n<l;n+=1)t[n]=16>n?new G(a[n*s+m],a[n*s+m+1]):v(y(t[n-2]),t[n-7],x(t[n-15]),t[n-16]),C=w(r,D(h),E(h,k,q),B[n],t[n]),u=p(z(c),F(c,f,e)),r=q,q=k,k=
h,h=p(g,C),g=e,e=f,f=c,c=p(C,u);d[0]=p(c,d[0]);d[1]=p(f,d[1]);d[2]=p(e,d[2]);d[3]=p(g,d[3]);d[4]=p(h,d[4]);d[5]=p(k,d[5]);d[6]=p(q,d[6]);d[7]=p(r,d[7])}if("SHA-224"===b)a=[d[0],d[1],d[2],d[3],d[4],d[5],d[6]];else if("SHA-256"===b)a=d;else throw"Unexpected error in SHA-2 implementation";return a}"function"===typeof define&&typeof define.amd?define(function(){return r}):"undefined"!==typeof exports?"undefined"!==typeof module&&module.exports?module.exports=exports=r:exports=r:B.jsSHA=r})(this);
