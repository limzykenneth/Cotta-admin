(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
// require other libraries after this line
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
Backbone.$ = $;

var charModel = require("./model.js");

var collection = Backbone.Collection.extend({

});

module.exports = collection;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./model.js":3}],2:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
// require other libraries after this line
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
Backbone.$ = $;
var jwtDecode = require("jwt-decode");

var Router = require("./routes.js");
var router;

window.host = "http://localhost:3001";

// Check for cookie and if doesn't exist, go to login page
var authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE1MDk1NjA3MzEsImV4cCI6MTUxMDE2NTUzMX0.Ez_eeRy3eJRY9E2duE_M75XxcTZWZ1ltcisSjkZ1cc0";
window.fetchHeaders = new Headers({
	"Authorization": "Bearer " + authToken
});

var tokenData = jwtDecode(authToken);

var getSchemas = fetch(`${host}/api/schema`, {
	method: "get",
	headers: fetchHeaders
}).then(function(response){
	return response.json();
});

// Bind routers
getSchemas.then(function(schemas){
	router = new Router(schemas);
	Backbone.history.start({pushState: true});
});

$(document).ready(function() {
	// Run stuff common to all pages
	getSchemas.then(function(schemas){
		// Render schema into sidebar
		var tpl = _.template($("#sidebar-list-template").html());
		$("#page-content .sidebar .sidebar-list").html(tpl({
			schemas: schemas
		}));

		// Check user role and render additional sidebar items as needed
		tpl = _.template($("#sidebar-admin-list-template").html());
		$("#page-content .sidebar .sidebar-admin-list").html(tpl(tokenData));
	});

	// Run stuff for specific pages
	getSchemas.then(function(schemas){

	});
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./routes.js":4,"jwt-decode":7}],3:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
// require other libraries after this line
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
Backbone.$ = $;

var model = Backbone.Model.extend({

});

module.exports = model;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],4:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
// require other libraries after this line
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
Backbone.$ = $;

var charCollection = require("./collection.js");

var router = Backbone.Router.extend({
	initialize: function(schemas){
		_.each(schemas, function(el, i){
			this.route("collections/" + el.collectionSlug, el.collectionName, function(){
				fetch(`${window.host}/api/collections/${el.collectionSlug}`, {
					headers: window.fetchHeaders
				}).then(function(response){
					return response.json();
				}).then(function(col){
					var schema = el;
					var collection = new charCollection(col);

					// Render collection
					var tpl = _.template($("#models-list-template").html());
					$("#page-content .main-content").html(tpl({
						data: collection.toJSON(),
						collectionSlug: el.collectionSlug,
						collectionName: el.collectionName
					}));
				});
			});

			this.route("collections/" + el.collectionSlug + "/:uid", el.collectionName, function(uid){
				fetch(`${window.host}/api/collections/${el.collectionSlug}/${uid}`, {
					headers: window.fetchHeaders
				}).then(function(response){
					return response.json();
				}).then(function(model){
					// Render model
					var tpl = _.template($("#model-template").html());
					$("#page-content .main-content").html(tpl({
						data: model,
						collectionSlug: el.collectionSlug,
						collectionName: el.collectionName,
						fields: el.fields
					}));
				});
			});
		}, this);
	}
});

module.exports = router;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./collection.js":1}],5:[function(require,module,exports){
/**
 * The code was extracted from:
 * https://github.com/davidchambers/Base64.js
 */

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function InvalidCharacterError(message) {
  this.message = message;
}

InvalidCharacterError.prototype = new Error();
InvalidCharacterError.prototype.name = 'InvalidCharacterError';

function polyfill (input) {
  var str = String(input).replace(/=+$/, '');
  if (str.length % 4 == 1) {
    throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
  }
  for (
    // initialize result and counters
    var bc = 0, bs, buffer, idx = 0, output = '';
    // get next character
    buffer = str.charAt(idx++);
    // character found in table? initialize bit storage and add its ascii value;
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
      // and if not first of each 4 characters,
      // convert the first 8 bits to one ascii character
      bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    // try to find character in table (0-63, not found => -1)
    buffer = chars.indexOf(buffer);
  }
  return output;
}


module.exports = typeof window !== 'undefined' && window.atob && window.atob.bind(window) || polyfill;

},{}],6:[function(require,module,exports){
var atob = require('./atob');

function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).replace(/(.)/g, function (m, p) {
    var code = p.charCodeAt(0).toString(16).toUpperCase();
    if (code.length < 2) {
      code = '0' + code;
    }
    return '%' + code;
  }));
}

module.exports = function(str) {
  var output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw "Illegal base64url string!";
  }

  try{
    return b64DecodeUnicode(output);
  } catch (err) {
    return atob(output);
  }
};

},{"./atob":5}],7:[function(require,module,exports){
'use strict';

var base64_url_decode = require('./base64_url_decode');

function InvalidTokenError(message) {
  this.message = message;
}

InvalidTokenError.prototype = new Error();
InvalidTokenError.prototype.name = 'InvalidTokenError';

module.exports = function (token,options) {
  if (typeof token !== 'string') {
    throw new InvalidTokenError('Invalid token specified');
  }

  options = options || {};
  var pos = options.header === true ? 0 : 1;
  try {
    return JSON.parse(base64_url_decode(token.split('.')[pos]));
  } catch (e) {
    throw new InvalidTokenError('Invalid token specified: ' + e.message);
  }
};

module.exports.InvalidTokenError = InvalidTokenError;

},{"./base64_url_decode":6}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqYXZhc2NyaXB0cy9jb2xsZWN0aW9uLmpzIiwiamF2YXNjcmlwdHMvY3VzdG9tLmpzIiwiamF2YXNjcmlwdHMvbW9kZWwuanMiLCJqYXZhc2NyaXB0cy9yb3V0ZXMuanMiLCJub2RlX21vZHVsZXMvand0LWRlY29kZS9saWIvYXRvYi5qcyIsIm5vZGVfbW9kdWxlcy9qd3QtZGVjb2RlL2xpYi9iYXNlNjRfdXJsX2RlY29kZS5qcyIsIm5vZGVfbW9kdWxlcy9qd3QtZGVjb2RlL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyICQgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snJCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnJCddIDogbnVsbCk7XG4vLyByZXF1aXJlIG90aGVyIGxpYnJhcmllcyBhZnRlciB0aGlzIGxpbmVcbnZhciBfID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ18nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ18nXSA6IG51bGwpO1xudmFyIEJhY2tib25lID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ0JhY2tib25lJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydCYWNrYm9uZSddIDogbnVsbCk7XG5CYWNrYm9uZS4kID0gJDtcblxudmFyIGNoYXJNb2RlbCA9IHJlcXVpcmUoXCIuL21vZGVsLmpzXCIpO1xuXG52YXIgY29sbGVjdGlvbiA9IEJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gY29sbGVjdGlvbjsiLCJ2YXIgJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WyckJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWyckJ10gOiBudWxsKTtcbi8vIHJlcXVpcmUgb3RoZXIgbGlicmFyaWVzIGFmdGVyIHRoaXMgbGluZVxudmFyIF8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snXyddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnXyddIDogbnVsbCk7XG52YXIgQmFja2JvbmUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snQmFja2JvbmUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ0JhY2tib25lJ10gOiBudWxsKTtcbkJhY2tib25lLiQgPSAkO1xudmFyIGp3dERlY29kZSA9IHJlcXVpcmUoXCJqd3QtZGVjb2RlXCIpO1xuXG52YXIgUm91dGVyID0gcmVxdWlyZShcIi4vcm91dGVzLmpzXCIpO1xudmFyIHJvdXRlcjtcblxud2luZG93Lmhvc3QgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMVwiO1xuXG4vLyBDaGVjayBmb3IgY29va2llIGFuZCBpZiBkb2Vzbid0IGV4aXN0LCBnbyB0byBsb2dpbiBwYWdlXG52YXIgYXV0aFRva2VuID0gXCJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKMWMyVnlibUZ0WlNJNkltRmtiV2x1SWl3aWNtOXNaU0k2SW1Ga2JXbHVhWE4wY21GMGIzSWlMQ0pwWVhRaU9qRTFNRGsxTmpBM016RXNJbVY0Y0NJNk1UVXhNREUyTlRVek1YMC5Fel9lZVJ5M2VKUlk5RTJkdUVfTTc1WHhjVFpXWjFsdGNpc1Nqa1oxY2MwXCI7XG53aW5kb3cuZmV0Y2hIZWFkZXJzID0gbmV3IEhlYWRlcnMoe1xuXHRcIkF1dGhvcml6YXRpb25cIjogXCJCZWFyZXIgXCIgKyBhdXRoVG9rZW5cbn0pO1xuXG52YXIgdG9rZW5EYXRhID0gand0RGVjb2RlKGF1dGhUb2tlbik7XG5cbnZhciBnZXRTY2hlbWFzID0gZmV0Y2goYCR7aG9zdH0vYXBpL3NjaGVtYWAsIHtcblx0bWV0aG9kOiBcImdldFwiLFxuXHRoZWFkZXJzOiBmZXRjaEhlYWRlcnNcbn0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xufSk7XG5cbi8vIEJpbmQgcm91dGVyc1xuZ2V0U2NoZW1hcy50aGVuKGZ1bmN0aW9uKHNjaGVtYXMpe1xuXHRyb3V0ZXIgPSBuZXcgUm91dGVyKHNjaGVtYXMpO1xuXHRCYWNrYm9uZS5oaXN0b3J5LnN0YXJ0KHtwdXNoU3RhdGU6IHRydWV9KTtcbn0pO1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblx0Ly8gUnVuIHN0dWZmIGNvbW1vbiB0byBhbGwgcGFnZXNcblx0Z2V0U2NoZW1hcy50aGVuKGZ1bmN0aW9uKHNjaGVtYXMpe1xuXHRcdC8vIFJlbmRlciBzY2hlbWEgaW50byBzaWRlYmFyXG5cdFx0dmFyIHRwbCA9IF8udGVtcGxhdGUoJChcIiNzaWRlYmFyLWxpc3QtdGVtcGxhdGVcIikuaHRtbCgpKTtcblx0XHQkKFwiI3BhZ2UtY29udGVudCAuc2lkZWJhciAuc2lkZWJhci1saXN0XCIpLmh0bWwodHBsKHtcblx0XHRcdHNjaGVtYXM6IHNjaGVtYXNcblx0XHR9KSk7XG5cblx0XHQvLyBDaGVjayB1c2VyIHJvbGUgYW5kIHJlbmRlciBhZGRpdGlvbmFsIHNpZGViYXIgaXRlbXMgYXMgbmVlZGVkXG5cdFx0dHBsID0gXy50ZW1wbGF0ZSgkKFwiI3NpZGViYXItYWRtaW4tbGlzdC10ZW1wbGF0ZVwiKS5odG1sKCkpO1xuXHRcdCQoXCIjcGFnZS1jb250ZW50IC5zaWRlYmFyIC5zaWRlYmFyLWFkbWluLWxpc3RcIikuaHRtbCh0cGwodG9rZW5EYXRhKSk7XG5cdH0pO1xuXG5cdC8vIFJ1biBzdHVmZiBmb3Igc3BlY2lmaWMgcGFnZXNcblx0Z2V0U2NoZW1hcy50aGVuKGZ1bmN0aW9uKHNjaGVtYXMpe1xuXG5cdH0pO1xufSk7XG4iLCJ2YXIgJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WyckJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWyckJ10gOiBudWxsKTtcbi8vIHJlcXVpcmUgb3RoZXIgbGlicmFyaWVzIGFmdGVyIHRoaXMgbGluZVxudmFyIF8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snXyddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnXyddIDogbnVsbCk7XG52YXIgQmFja2JvbmUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snQmFja2JvbmUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ0JhY2tib25lJ10gOiBudWxsKTtcbkJhY2tib25lLiQgPSAkO1xuXG52YXIgbW9kZWwgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBtb2RlbDsiLCJ2YXIgJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WyckJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWyckJ10gOiBudWxsKTtcbi8vIHJlcXVpcmUgb3RoZXIgbGlicmFyaWVzIGFmdGVyIHRoaXMgbGluZVxudmFyIF8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snXyddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnXyddIDogbnVsbCk7XG52YXIgQmFja2JvbmUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snQmFja2JvbmUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ0JhY2tib25lJ10gOiBudWxsKTtcbkJhY2tib25lLiQgPSAkO1xuXG52YXIgY2hhckNvbGxlY3Rpb24gPSByZXF1aXJlKFwiLi9jb2xsZWN0aW9uLmpzXCIpO1xuXG52YXIgcm91dGVyID0gQmFja2JvbmUuUm91dGVyLmV4dGVuZCh7XG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKHNjaGVtYXMpe1xuXHRcdF8uZWFjaChzY2hlbWFzLCBmdW5jdGlvbihlbCwgaSl7XG5cdFx0XHR0aGlzLnJvdXRlKFwiY29sbGVjdGlvbnMvXCIgKyBlbC5jb2xsZWN0aW9uU2x1ZywgZWwuY29sbGVjdGlvbk5hbWUsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGZldGNoKGAke3dpbmRvdy5ob3N0fS9hcGkvY29sbGVjdGlvbnMvJHtlbC5jb2xsZWN0aW9uU2x1Z31gLCB7XG5cdFx0XHRcdFx0aGVhZGVyczogd2luZG93LmZldGNoSGVhZGVyc1xuXHRcdFx0XHR9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHRcdFx0XHR9KS50aGVuKGZ1bmN0aW9uKGNvbCl7XG5cdFx0XHRcdFx0dmFyIHNjaGVtYSA9IGVsO1xuXHRcdFx0XHRcdHZhciBjb2xsZWN0aW9uID0gbmV3IGNoYXJDb2xsZWN0aW9uKGNvbCk7XG5cblx0XHRcdFx0XHQvLyBSZW5kZXIgY29sbGVjdGlvblxuXHRcdFx0XHRcdHZhciB0cGwgPSBfLnRlbXBsYXRlKCQoXCIjbW9kZWxzLWxpc3QtdGVtcGxhdGVcIikuaHRtbCgpKTtcblx0XHRcdFx0XHQkKFwiI3BhZ2UtY29udGVudCAubWFpbi1jb250ZW50XCIpLmh0bWwodHBsKHtcblx0XHRcdFx0XHRcdGRhdGE6IGNvbGxlY3Rpb24udG9KU09OKCksXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uU2x1ZzogZWwuY29sbGVjdGlvblNsdWcsXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uTmFtZTogZWwuY29sbGVjdGlvbk5hbWVcblx0XHRcdFx0XHR9KSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMucm91dGUoXCJjb2xsZWN0aW9ucy9cIiArIGVsLmNvbGxlY3Rpb25TbHVnICsgXCIvOnVpZFwiLCBlbC5jb2xsZWN0aW9uTmFtZSwgZnVuY3Rpb24odWlkKXtcblx0XHRcdFx0ZmV0Y2goYCR7d2luZG93Lmhvc3R9L2FwaS9jb2xsZWN0aW9ucy8ke2VsLmNvbGxlY3Rpb25TbHVnfS8ke3VpZH1gLCB7XG5cdFx0XHRcdFx0aGVhZGVyczogd2luZG93LmZldGNoSGVhZGVyc1xuXHRcdFx0XHR9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHRcdFx0XHR9KS50aGVuKGZ1bmN0aW9uKG1vZGVsKXtcblx0XHRcdFx0XHQvLyBSZW5kZXIgbW9kZWxcblx0XHRcdFx0XHR2YXIgdHBsID0gXy50ZW1wbGF0ZSgkKFwiI21vZGVsLXRlbXBsYXRlXCIpLmh0bWwoKSk7XG5cdFx0XHRcdFx0JChcIiNwYWdlLWNvbnRlbnQgLm1haW4tY29udGVudFwiKS5odG1sKHRwbCh7XG5cdFx0XHRcdFx0XHRkYXRhOiBtb2RlbCxcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb25TbHVnOiBlbC5jb2xsZWN0aW9uU2x1Zyxcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb25OYW1lOiBlbC5jb2xsZWN0aW9uTmFtZSxcblx0XHRcdFx0XHRcdGZpZWxkczogZWwuZmllbGRzXG5cdFx0XHRcdFx0fSkpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0sIHRoaXMpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSByb3V0ZXI7IiwiLyoqXG4gKiBUaGUgY29kZSB3YXMgZXh0cmFjdGVkIGZyb206XG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGF2aWRjaGFtYmVycy9CYXNlNjQuanNcbiAqL1xuXG52YXIgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nO1xuXG5mdW5jdGlvbiBJbnZhbGlkQ2hhcmFjdGVyRXJyb3IobWVzc2FnZSkge1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xufVxuXG5JbnZhbGlkQ2hhcmFjdGVyRXJyb3IucHJvdG90eXBlID0gbmV3IEVycm9yKCk7XG5JbnZhbGlkQ2hhcmFjdGVyRXJyb3IucHJvdG90eXBlLm5hbWUgPSAnSW52YWxpZENoYXJhY3RlckVycm9yJztcblxuZnVuY3Rpb24gcG9seWZpbGwgKGlucHV0KSB7XG4gIHZhciBzdHIgPSBTdHJpbmcoaW5wdXQpLnJlcGxhY2UoLz0rJC8sICcnKTtcbiAgaWYgKHN0ci5sZW5ndGggJSA0ID09IDEpIHtcbiAgICB0aHJvdyBuZXcgSW52YWxpZENoYXJhY3RlckVycm9yKFwiJ2F0b2InIGZhaWxlZDogVGhlIHN0cmluZyB0byBiZSBkZWNvZGVkIGlzIG5vdCBjb3JyZWN0bHkgZW5jb2RlZC5cIik7XG4gIH1cbiAgZm9yIChcbiAgICAvLyBpbml0aWFsaXplIHJlc3VsdCBhbmQgY291bnRlcnNcbiAgICB2YXIgYmMgPSAwLCBicywgYnVmZmVyLCBpZHggPSAwLCBvdXRwdXQgPSAnJztcbiAgICAvLyBnZXQgbmV4dCBjaGFyYWN0ZXJcbiAgICBidWZmZXIgPSBzdHIuY2hhckF0KGlkeCsrKTtcbiAgICAvLyBjaGFyYWN0ZXIgZm91bmQgaW4gdGFibGU/IGluaXRpYWxpemUgYml0IHN0b3JhZ2UgYW5kIGFkZCBpdHMgYXNjaWkgdmFsdWU7XG4gICAgfmJ1ZmZlciAmJiAoYnMgPSBiYyAlIDQgPyBicyAqIDY0ICsgYnVmZmVyIDogYnVmZmVyLFxuICAgICAgLy8gYW5kIGlmIG5vdCBmaXJzdCBvZiBlYWNoIDQgY2hhcmFjdGVycyxcbiAgICAgIC8vIGNvbnZlcnQgdGhlIGZpcnN0IDggYml0cyB0byBvbmUgYXNjaWkgY2hhcmFjdGVyXG4gICAgICBiYysrICUgNCkgPyBvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgyNTUgJiBicyA+PiAoLTIgKiBiYyAmIDYpKSA6IDBcbiAgKSB7XG4gICAgLy8gdHJ5IHRvIGZpbmQgY2hhcmFjdGVyIGluIHRhYmxlICgwLTYzLCBub3QgZm91bmQgPT4gLTEpXG4gICAgYnVmZmVyID0gY2hhcnMuaW5kZXhPZihidWZmZXIpO1xuICB9XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuYXRvYiAmJiB3aW5kb3cuYXRvYi5iaW5kKHdpbmRvdykgfHwgcG9seWZpbGw7XG4iLCJ2YXIgYXRvYiA9IHJlcXVpcmUoJy4vYXRvYicpO1xuXG5mdW5jdGlvbiBiNjREZWNvZGVVbmljb2RlKHN0cikge1xuICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGF0b2Ioc3RyKS5yZXBsYWNlKC8oLikvZywgZnVuY3Rpb24gKG0sIHApIHtcbiAgICB2YXIgY29kZSA9IHAuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTtcbiAgICBpZiAoY29kZS5sZW5ndGggPCAyKSB7XG4gICAgICBjb2RlID0gJzAnICsgY29kZTtcbiAgICB9XG4gICAgcmV0dXJuICclJyArIGNvZGU7XG4gIH0pKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzdHIpIHtcbiAgdmFyIG91dHB1dCA9IHN0ci5yZXBsYWNlKC8tL2csIFwiK1wiKS5yZXBsYWNlKC9fL2csIFwiL1wiKTtcbiAgc3dpdGNoIChvdXRwdXQubGVuZ3RoICUgNCkge1xuICAgIGNhc2UgMDpcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMjpcbiAgICAgIG91dHB1dCArPSBcIj09XCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDM6XG4gICAgICBvdXRwdXQgKz0gXCI9XCI7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgXCJJbGxlZ2FsIGJhc2U2NHVybCBzdHJpbmchXCI7XG4gIH1cblxuICB0cnl7XG4gICAgcmV0dXJuIGI2NERlY29kZVVuaWNvZGUob3V0cHV0KTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIGF0b2Iob3V0cHV0KTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2U2NF91cmxfZGVjb2RlID0gcmVxdWlyZSgnLi9iYXNlNjRfdXJsX2RlY29kZScpO1xuXG5mdW5jdGlvbiBJbnZhbGlkVG9rZW5FcnJvcihtZXNzYWdlKSB7XG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG59XG5cbkludmFsaWRUb2tlbkVycm9yLnByb3RvdHlwZSA9IG5ldyBFcnJvcigpO1xuSW52YWxpZFRva2VuRXJyb3IucHJvdG90eXBlLm5hbWUgPSAnSW52YWxpZFRva2VuRXJyb3InO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0b2tlbixvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgdG9rZW4gIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IEludmFsaWRUb2tlbkVycm9yKCdJbnZhbGlkIHRva2VuIHNwZWNpZmllZCcpO1xuICB9XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHZhciBwb3MgPSBvcHRpb25zLmhlYWRlciA9PT0gdHJ1ZSA/IDAgOiAxO1xuICB0cnkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGJhc2U2NF91cmxfZGVjb2RlKHRva2VuLnNwbGl0KCcuJylbcG9zXSkpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdGhyb3cgbmV3IEludmFsaWRUb2tlbkVycm9yKCdJbnZhbGlkIHRva2VuIHNwZWNpZmllZDogJyArIGUubWVzc2FnZSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLkludmFsaWRUb2tlbkVycm9yID0gSW52YWxpZFRva2VuRXJyb3I7XG4iXX0=
