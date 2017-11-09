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
var authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE1MTAyMTE3NzAsImV4cCI6MTUxMDgxNjU3MH0.4XQeUuUB2l1b29zKdBlSrziDovQDxbdw4YjiaJBLZXU";
window.rootURL = "http://localhost:3003";

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
			// Routes for each collection
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
					})).attr("class", "main-content").addClass("models-container");
				});
			});

			// Routes for each model under each collection
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
					})).attr("class", "main-content").addClass("model-container");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqYXZhc2NyaXB0cy9jb2xsZWN0aW9uLmpzIiwiamF2YXNjcmlwdHMvY3VzdG9tLmpzIiwiamF2YXNjcmlwdHMvbW9kZWwuanMiLCJqYXZhc2NyaXB0cy9yb3V0ZXMuanMiLCJub2RlX21vZHVsZXMvand0LWRlY29kZS9saWIvYXRvYi5qcyIsIm5vZGVfbW9kdWxlcy9qd3QtZGVjb2RlL2xpYi9iYXNlNjRfdXJsX2RlY29kZS5qcyIsIm5vZGVfbW9kdWxlcy9qd3QtZGVjb2RlL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WyckJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWyckJ10gOiBudWxsKTtcbi8vIHJlcXVpcmUgb3RoZXIgbGlicmFyaWVzIGFmdGVyIHRoaXMgbGluZVxudmFyIF8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snXyddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnXyddIDogbnVsbCk7XG52YXIgQmFja2JvbmUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snQmFja2JvbmUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ0JhY2tib25lJ10gOiBudWxsKTtcbkJhY2tib25lLiQgPSAkO1xuXG52YXIgY2hhck1vZGVsID0gcmVxdWlyZShcIi4vbW9kZWwuanNcIik7XG5cbnZhciBjb2xsZWN0aW9uID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb2xsZWN0aW9uOyIsInZhciAkID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJyQnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJyQnXSA6IG51bGwpO1xuLy8gcmVxdWlyZSBvdGhlciBsaWJyYXJpZXMgYWZ0ZXIgdGhpcyBsaW5lXG52YXIgXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydfJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydfJ10gOiBudWxsKTtcbnZhciBCYWNrYm9uZSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydCYWNrYm9uZSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnQmFja2JvbmUnXSA6IG51bGwpO1xuQmFja2JvbmUuJCA9ICQ7XG52YXIgand0RGVjb2RlID0gcmVxdWlyZShcImp3dC1kZWNvZGVcIik7XG5cbnZhciBSb3V0ZXIgPSByZXF1aXJlKFwiLi9yb3V0ZXMuanNcIik7XG52YXIgcm91dGVyO1xuXG53aW5kb3cuaG9zdCA9IFwiaHR0cDovL2xvY2FsaG9zdDozMDAxXCI7XG5cbi8vIENoZWNrIGZvciBjb29raWUgYW5kIGlmIGRvZXNuJ3QgZXhpc3QsIGdvIHRvIGxvZ2luIHBhZ2VcbnZhciBhdXRoVG9rZW4gPSBcImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUoxYzJWeWJtRnRaU0k2SW1Ga2JXbHVJaXdpY205c1pTSTZJbUZrYldsdWFYTjBjbUYwYjNJaUxDSnBZWFFpT2pFMU1UQXlNVEUzTnpBc0ltVjRjQ0k2TVRVeE1EZ3hOalUzTUgwLjRYUWVVdVVCMmwxYjI5ektkQmxTcnppRG92UUR4YmR3NFlqaWFKQkxaWFVcIjtcbndpbmRvdy5yb290VVJMID0gXCJodHRwOi8vbG9jYWxob3N0OjMwMDNcIjtcblxud2luZG93LmZldGNoSGVhZGVycyA9IG5ldyBIZWFkZXJzKHtcblx0XCJBdXRob3JpemF0aW9uXCI6IFwiQmVhcmVyIFwiICsgYXV0aFRva2VuXG59KTtcblxudmFyIHRva2VuRGF0YSA9IGp3dERlY29kZShhdXRoVG9rZW4pO1xuXG52YXIgZ2V0U2NoZW1hcyA9IGZldGNoKGAke2hvc3R9L2FwaS9zY2hlbWFgLCB7XG5cdG1ldGhvZDogXCJnZXRcIixcblx0aGVhZGVyczogZmV0Y2hIZWFkZXJzXG59KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbn0pO1xuXG4vLyBCaW5kIHJvdXRlcnNcbmdldFNjaGVtYXMudGhlbihmdW5jdGlvbihzY2hlbWFzKXtcblx0cm91dGVyID0gbmV3IFJvdXRlcihzY2hlbWFzKTtcblx0QmFja2JvbmUuaGlzdG9yeS5zdGFydCh7cHVzaFN0YXRlOiB0cnVlfSk7XG59KTtcblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG5cdC8vIFJ1biBzdHVmZiBjb21tb24gdG8gYWxsIHBhZ2VzXG5cdGdldFNjaGVtYXMudGhlbihmdW5jdGlvbihzY2hlbWFzKXtcblx0XHQvLyBSZW5kZXIgc2NoZW1hIGludG8gc2lkZWJhclxuXHRcdHZhciB0cGwgPSBfLnRlbXBsYXRlKCQoXCIjc2lkZWJhci1saXN0LXRlbXBsYXRlXCIpLmh0bWwoKSk7XG5cdFx0JChcIiNwYWdlLWNvbnRlbnQgLnNpZGViYXIgLnNpZGViYXItbGlzdFwiKS5odG1sKHRwbCh7XG5cdFx0XHRzY2hlbWFzOiBzY2hlbWFzXG5cdFx0fSkpO1xuXG5cdFx0Ly8gQ2hlY2sgdXNlciByb2xlIGFuZCByZW5kZXIgYWRkaXRpb25hbCBzaWRlYmFyIGl0ZW1zIGFzIG5lZWRlZFxuXHRcdHRwbCA9IF8udGVtcGxhdGUoJChcIiNzaWRlYmFyLWFkbWluLWxpc3QtdGVtcGxhdGVcIikuaHRtbCgpKTtcblx0XHQkKFwiI3BhZ2UtY29udGVudCAuc2lkZWJhciAuc2lkZWJhci1hZG1pbi1saXN0XCIpLmh0bWwodHBsKHRva2VuRGF0YSkpO1xuXHR9KTtcblxuXHQvLyBSdW4gc3R1ZmYgZm9yIHNwZWNpZmljIHBhZ2VzXG5cdGdldFNjaGVtYXMudGhlbihmdW5jdGlvbihzY2hlbWFzKXtcblxuXHR9KTtcbn0pO1xuIiwidmFyICQgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snJCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnJCddIDogbnVsbCk7XG4vLyByZXF1aXJlIG90aGVyIGxpYnJhcmllcyBhZnRlciB0aGlzIGxpbmVcbnZhciBfID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ18nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ18nXSA6IG51bGwpO1xudmFyIEJhY2tib25lID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ0JhY2tib25lJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydCYWNrYm9uZSddIDogbnVsbCk7XG5CYWNrYm9uZS4kID0gJDtcblxudmFyIG1vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbW9kZWw7IiwidmFyICQgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snJCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnJCddIDogbnVsbCk7XG4vLyByZXF1aXJlIG90aGVyIGxpYnJhcmllcyBhZnRlciB0aGlzIGxpbmVcbnZhciBfID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ18nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ18nXSA6IG51bGwpO1xudmFyIEJhY2tib25lID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ0JhY2tib25lJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydCYWNrYm9uZSddIDogbnVsbCk7XG5CYWNrYm9uZS4kID0gJDtcblxudmFyIGNoYXJDb2xsZWN0aW9uID0gcmVxdWlyZShcIi4vY29sbGVjdGlvbi5qc1wiKTtcblxudmFyIHJvdXRlciA9IEJhY2tib25lLlJvdXRlci5leHRlbmQoe1xuXHRpbml0aWFsaXplOiBmdW5jdGlvbihzY2hlbWFzKXtcblx0XHRfLmVhY2goc2NoZW1hcywgZnVuY3Rpb24oZWwsIGkpe1xuXHRcdFx0Ly8gUm91dGVzIGZvciBlYWNoIGNvbGxlY3Rpb25cblx0XHRcdHRoaXMucm91dGUoXCJjb2xsZWN0aW9ucy9cIiArIGVsLmNvbGxlY3Rpb25TbHVnLCBlbC5jb2xsZWN0aW9uTmFtZSwgZnVuY3Rpb24oKXtcblx0XHRcdFx0ZmV0Y2goYCR7d2luZG93Lmhvc3R9L2FwaS9jb2xsZWN0aW9ucy8ke2VsLmNvbGxlY3Rpb25TbHVnfWAsIHtcblx0XHRcdFx0XHRoZWFkZXJzOiB3aW5kb3cuZmV0Y2hIZWFkZXJzXG5cdFx0XHRcdH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdFx0XHRcdH0pLnRoZW4oZnVuY3Rpb24oY29sKXtcblx0XHRcdFx0XHR2YXIgc2NoZW1hID0gZWw7XG5cdFx0XHRcdFx0dmFyIGNvbGxlY3Rpb24gPSBuZXcgY2hhckNvbGxlY3Rpb24oY29sKTtcblxuXHRcdFx0XHRcdC8vIFJlbmRlciBjb2xsZWN0aW9uXG5cdFx0XHRcdFx0dmFyIHRwbCA9IF8udGVtcGxhdGUoJChcIiNtb2RlbHMtbGlzdC10ZW1wbGF0ZVwiKS5odG1sKCkpO1xuXHRcdFx0XHRcdCQoXCIjcGFnZS1jb250ZW50IC5tYWluLWNvbnRlbnRcIikuaHRtbCh0cGwoe1xuXHRcdFx0XHRcdFx0ZGF0YTogY29sbGVjdGlvbi50b0pTT04oKSxcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb25TbHVnOiBlbC5jb2xsZWN0aW9uU2x1Zyxcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb25OYW1lOiBlbC5jb2xsZWN0aW9uTmFtZVxuXHRcdFx0XHRcdH0pKS5hdHRyKFwiY2xhc3NcIiwgXCJtYWluLWNvbnRlbnRcIikuYWRkQ2xhc3MoXCJtb2RlbHMtY29udGFpbmVyXCIpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBSb3V0ZXMgZm9yIGVhY2ggbW9kZWwgdW5kZXIgZWFjaCBjb2xsZWN0aW9uXG5cdFx0XHR0aGlzLnJvdXRlKFwiY29sbGVjdGlvbnMvXCIgKyBlbC5jb2xsZWN0aW9uU2x1ZyArIFwiLzp1aWRcIiwgZWwuY29sbGVjdGlvbk5hbWUsIGZ1bmN0aW9uKHVpZCl7XG5cdFx0XHRcdGZldGNoKGAke3dpbmRvdy5ob3N0fS9hcGkvY29sbGVjdGlvbnMvJHtlbC5jb2xsZWN0aW9uU2x1Z30vJHt1aWR9YCwge1xuXHRcdFx0XHRcdGhlYWRlcnM6IHdpbmRvdy5mZXRjaEhlYWRlcnNcblx0XHRcdFx0fSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcblx0XHRcdFx0fSkudGhlbihmdW5jdGlvbihtb2RlbCl7XG5cdFx0XHRcdFx0Ly8gUmVuZGVyIG1vZGVsXG5cdFx0XHRcdFx0dmFyIHRwbCA9IF8udGVtcGxhdGUoJChcIiNtb2RlbC10ZW1wbGF0ZVwiKS5odG1sKCkpO1xuXHRcdFx0XHRcdCQoXCIjcGFnZS1jb250ZW50IC5tYWluLWNvbnRlbnRcIikuaHRtbCh0cGwoe1xuXHRcdFx0XHRcdFx0ZGF0YTogbW9kZWwsXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uU2x1ZzogZWwuY29sbGVjdGlvblNsdWcsXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uTmFtZTogZWwuY29sbGVjdGlvbk5hbWUsXG5cdFx0XHRcdFx0XHRmaWVsZHM6IGVsLmZpZWxkc1xuXHRcdFx0XHRcdH0pKS5hdHRyKFwiY2xhc3NcIiwgXCJtYWluLWNvbnRlbnRcIikuYWRkQ2xhc3MoXCJtb2RlbC1jb250YWluZXJcIik7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSwgdGhpcyk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJvdXRlcjsiLCIvKipcbiAqIFRoZSBjb2RlIHdhcyBleHRyYWN0ZWQgZnJvbTpcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXZpZGNoYW1iZXJzL0Jhc2U2NC5qc1xuICovXG5cbnZhciBjaGFycyA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPSc7XG5cbmZ1bmN0aW9uIEludmFsaWRDaGFyYWN0ZXJFcnJvcihtZXNzYWdlKSB7XG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG59XG5cbkludmFsaWRDaGFyYWN0ZXJFcnJvci5wcm90b3R5cGUgPSBuZXcgRXJyb3IoKTtcbkludmFsaWRDaGFyYWN0ZXJFcnJvci5wcm90b3R5cGUubmFtZSA9ICdJbnZhbGlkQ2hhcmFjdGVyRXJyb3InO1xuXG5mdW5jdGlvbiBwb2x5ZmlsbCAoaW5wdXQpIHtcbiAgdmFyIHN0ciA9IFN0cmluZyhpbnB1dCkucmVwbGFjZSgvPSskLywgJycpO1xuICBpZiAoc3RyLmxlbmd0aCAlIDQgPT0gMSkge1xuICAgIHRocm93IG5ldyBJbnZhbGlkQ2hhcmFjdGVyRXJyb3IoXCInYXRvYicgZmFpbGVkOiBUaGUgc3RyaW5nIHRvIGJlIGRlY29kZWQgaXMgbm90IGNvcnJlY3RseSBlbmNvZGVkLlwiKTtcbiAgfVxuICBmb3IgKFxuICAgIC8vIGluaXRpYWxpemUgcmVzdWx0IGFuZCBjb3VudGVyc1xuICAgIHZhciBiYyA9IDAsIGJzLCBidWZmZXIsIGlkeCA9IDAsIG91dHB1dCA9ICcnO1xuICAgIC8vIGdldCBuZXh0IGNoYXJhY3RlclxuICAgIGJ1ZmZlciA9IHN0ci5jaGFyQXQoaWR4KyspO1xuICAgIC8vIGNoYXJhY3RlciBmb3VuZCBpbiB0YWJsZT8gaW5pdGlhbGl6ZSBiaXQgc3RvcmFnZSBhbmQgYWRkIGl0cyBhc2NpaSB2YWx1ZTtcbiAgICB+YnVmZmVyICYmIChicyA9IGJjICUgNCA/IGJzICogNjQgKyBidWZmZXIgOiBidWZmZXIsXG4gICAgICAvLyBhbmQgaWYgbm90IGZpcnN0IG9mIGVhY2ggNCBjaGFyYWN0ZXJzLFxuICAgICAgLy8gY29udmVydCB0aGUgZmlyc3QgOCBiaXRzIHRvIG9uZSBhc2NpaSBjaGFyYWN0ZXJcbiAgICAgIGJjKysgJSA0KSA/IG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDI1NSAmIGJzID4+ICgtMiAqIGJjICYgNikpIDogMFxuICApIHtcbiAgICAvLyB0cnkgdG8gZmluZCBjaGFyYWN0ZXIgaW4gdGFibGUgKDAtNjMsIG5vdCBmb3VuZCA9PiAtMSlcbiAgICBidWZmZXIgPSBjaGFycy5pbmRleE9mKGJ1ZmZlcik7XG4gIH1cbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5hdG9iICYmIHdpbmRvdy5hdG9iLmJpbmQod2luZG93KSB8fCBwb2x5ZmlsbDtcbiIsInZhciBhdG9iID0gcmVxdWlyZSgnLi9hdG9iJyk7XG5cbmZ1bmN0aW9uIGI2NERlY29kZVVuaWNvZGUoc3RyKSB7XG4gIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoYXRvYihzdHIpLnJlcGxhY2UoLyguKS9nLCBmdW5jdGlvbiAobSwgcCkge1xuICAgIHZhciBjb2RlID0gcC5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpO1xuICAgIGlmIChjb2RlLmxlbmd0aCA8IDIpIHtcbiAgICAgIGNvZGUgPSAnMCcgKyBjb2RlO1xuICAgIH1cbiAgICByZXR1cm4gJyUnICsgY29kZTtcbiAgfSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHN0cikge1xuICB2YXIgb3V0cHV0ID0gc3RyLnJlcGxhY2UoLy0vZywgXCIrXCIpLnJlcGxhY2UoL18vZywgXCIvXCIpO1xuICBzd2l0Y2ggKG91dHB1dC5sZW5ndGggJSA0KSB7XG4gICAgY2FzZSAwOlxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAyOlxuICAgICAgb3V0cHV0ICs9IFwiPT1cIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMzpcbiAgICAgIG91dHB1dCArPSBcIj1cIjtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBcIklsbGVnYWwgYmFzZTY0dXJsIHN0cmluZyFcIjtcbiAgfVxuXG4gIHRyeXtcbiAgICByZXR1cm4gYjY0RGVjb2RlVW5pY29kZShvdXRwdXQpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gYXRvYihvdXRwdXQpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZTY0X3VybF9kZWNvZGUgPSByZXF1aXJlKCcuL2Jhc2U2NF91cmxfZGVjb2RlJyk7XG5cbmZ1bmN0aW9uIEludmFsaWRUb2tlbkVycm9yKG1lc3NhZ2UpIHtcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbn1cblxuSW52YWxpZFRva2VuRXJyb3IucHJvdG90eXBlID0gbmV3IEVycm9yKCk7XG5JbnZhbGlkVG9rZW5FcnJvci5wcm90b3R5cGUubmFtZSA9ICdJbnZhbGlkVG9rZW5FcnJvcic7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRva2VuLG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiB0b2tlbiAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgSW52YWxpZFRva2VuRXJyb3IoJ0ludmFsaWQgdG9rZW4gc3BlY2lmaWVkJyk7XG4gIH1cblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIHBvcyA9IG9wdGlvbnMuaGVhZGVyID09PSB0cnVlID8gMCA6IDE7XG4gIHRyeSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoYmFzZTY0X3VybF9kZWNvZGUodG9rZW4uc3BsaXQoJy4nKVtwb3NdKSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyBuZXcgSW52YWxpZFRva2VuRXJyb3IoJ0ludmFsaWQgdG9rZW4gc3BlY2lmaWVkOiAnICsgZS5tZXNzYWdlKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuSW52YWxpZFRva2VuRXJyb3IgPSBJbnZhbGlkVG9rZW5FcnJvcjtcbiJdfQ==
