(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
// require other libraries after this line
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
Backbone.$ = $;

var charModel = require("./model.js");

var collection = Backbone.Collection.extend({
	model: charModel,

	render: function(){
		var tpl = _.template($("#models-list-template").html());
		$("#page-content .main-content").html(tpl({
			data: this.toJSON(),
			collectionSlug: this.slug,
			collectionName: this.name
		})).attr("class", "main-content").addClass("models-container");
	}
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
	render: function(){
		var tpl = _.template($("#model-template").html());
		$("#page-content .main-content").html(tpl({
			data: this.toJSON(),
			collectionSlug: this.collectionSlug,
			collectionName: this.collectionName,
			fields: this.fields
		})).attr("class", "main-content").addClass("model-container");
	}
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
var charModel = require("./model.js");
var collections = {};

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

					// Render collection
					collections[schema.collectionSlug] = new charCollection(col);
					var collection = collections[schema.collectionSlug];
					collection.slug = schema.collectionSlug;
					collection.name = schema.collectionName;
					collection.render();
				});
			});

			// Routes for each model under each collection
			this.route("collections/" + el.collectionSlug + "/:uid", el.collectionName, function(uid){
				fetch(`${window.host}/api/collections/${el.collectionSlug}/${uid}`, {
					headers: window.fetchHeaders
				}).then(function(response){
					return response.json();
				}).then(function(m){
					var model = new charModel(m);
					model.collectionSlug = el.collectionSlug;
					model.collectionName = el.collectionName;
					model.fields = el.fields;
					model.render();
				});
			});
		}, this);
	}
});

module.exports = router;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./collection.js":1,"./model.js":3}],5:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqYXZhc2NyaXB0cy9jb2xsZWN0aW9uLmpzIiwiamF2YXNjcmlwdHMvY3VzdG9tLmpzIiwiamF2YXNjcmlwdHMvbW9kZWwuanMiLCJqYXZhc2NyaXB0cy9yb3V0ZXMuanMiLCJub2RlX21vZHVsZXMvand0LWRlY29kZS9saWIvYXRvYi5qcyIsIm5vZGVfbW9kdWxlcy9qd3QtZGVjb2RlL2xpYi9iYXNlNjRfdXJsX2RlY29kZS5qcyIsIm5vZGVfbW9kdWxlcy9qd3QtZGVjb2RlL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WyckJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWyckJ10gOiBudWxsKTtcbi8vIHJlcXVpcmUgb3RoZXIgbGlicmFyaWVzIGFmdGVyIHRoaXMgbGluZVxudmFyIF8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snXyddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnXyddIDogbnVsbCk7XG52YXIgQmFja2JvbmUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snQmFja2JvbmUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ0JhY2tib25lJ10gOiBudWxsKTtcbkJhY2tib25lLiQgPSAkO1xuXG52YXIgY2hhck1vZGVsID0gcmVxdWlyZShcIi4vbW9kZWwuanNcIik7XG5cbnZhciBjb2xsZWN0aW9uID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xuXHRtb2RlbDogY2hhck1vZGVsLFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKXtcblx0XHR2YXIgdHBsID0gXy50ZW1wbGF0ZSgkKFwiI21vZGVscy1saXN0LXRlbXBsYXRlXCIpLmh0bWwoKSk7XG5cdFx0JChcIiNwYWdlLWNvbnRlbnQgLm1haW4tY29udGVudFwiKS5odG1sKHRwbCh7XG5cdFx0XHRkYXRhOiB0aGlzLnRvSlNPTigpLFxuXHRcdFx0Y29sbGVjdGlvblNsdWc6IHRoaXMuc2x1Zyxcblx0XHRcdGNvbGxlY3Rpb25OYW1lOiB0aGlzLm5hbWVcblx0XHR9KSkuYXR0cihcImNsYXNzXCIsIFwibWFpbi1jb250ZW50XCIpLmFkZENsYXNzKFwibW9kZWxzLWNvbnRhaW5lclwiKTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gY29sbGVjdGlvbjsiLCJ2YXIgJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WyckJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWyckJ10gOiBudWxsKTtcbi8vIHJlcXVpcmUgb3RoZXIgbGlicmFyaWVzIGFmdGVyIHRoaXMgbGluZVxudmFyIF8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snXyddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnXyddIDogbnVsbCk7XG52YXIgQmFja2JvbmUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snQmFja2JvbmUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ0JhY2tib25lJ10gOiBudWxsKTtcbkJhY2tib25lLiQgPSAkO1xudmFyIGp3dERlY29kZSA9IHJlcXVpcmUoXCJqd3QtZGVjb2RlXCIpO1xuXG52YXIgUm91dGVyID0gcmVxdWlyZShcIi4vcm91dGVzLmpzXCIpO1xudmFyIHJvdXRlcjtcblxud2luZG93Lmhvc3QgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMVwiO1xuXG4vLyBDaGVjayBmb3IgY29va2llIGFuZCBpZiBkb2Vzbid0IGV4aXN0LCBnbyB0byBsb2dpbiBwYWdlXG52YXIgYXV0aFRva2VuID0gXCJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKMWMyVnlibUZ0WlNJNkltRmtiV2x1SWl3aWNtOXNaU0k2SW1Ga2JXbHVhWE4wY21GMGIzSWlMQ0pwWVhRaU9qRTFNVEF5TVRFM056QXNJbVY0Y0NJNk1UVXhNRGd4TmpVM01IMC40WFFlVXVVQjJsMWIyOXpLZEJsU3J6aURvdlFEeGJkdzRZamlhSkJMWlhVXCI7XG53aW5kb3cucm9vdFVSTCA9IFwiaHR0cDovL2xvY2FsaG9zdDozMDAzXCI7XG5cbndpbmRvdy5mZXRjaEhlYWRlcnMgPSBuZXcgSGVhZGVycyh7XG5cdFwiQXV0aG9yaXphdGlvblwiOiBcIkJlYXJlciBcIiArIGF1dGhUb2tlblxufSk7XG5cbnZhciB0b2tlbkRhdGEgPSBqd3REZWNvZGUoYXV0aFRva2VuKTtcblxudmFyIGdldFNjaGVtYXMgPSBmZXRjaChgJHtob3N0fS9hcGkvc2NoZW1hYCwge1xuXHRtZXRob2Q6IFwiZ2V0XCIsXG5cdGhlYWRlcnM6IGZldGNoSGVhZGVyc1xufSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdHJldHVybiByZXNwb25zZS5qc29uKCk7XG59KTtcblxuLy8gQmluZCByb3V0ZXJzXG5nZXRTY2hlbWFzLnRoZW4oZnVuY3Rpb24oc2NoZW1hcyl7XG5cdHJvdXRlciA9IG5ldyBSb3V0ZXIoc2NoZW1hcyk7XG5cdEJhY2tib25lLmhpc3Rvcnkuc3RhcnQoe3B1c2hTdGF0ZTogdHJ1ZX0pO1xufSk7XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXHQvLyBSdW4gc3R1ZmYgY29tbW9uIHRvIGFsbCBwYWdlc1xuXHRnZXRTY2hlbWFzLnRoZW4oZnVuY3Rpb24oc2NoZW1hcyl7XG5cdFx0Ly8gUmVuZGVyIHNjaGVtYSBpbnRvIHNpZGViYXJcblx0XHR2YXIgdHBsID0gXy50ZW1wbGF0ZSgkKFwiI3NpZGViYXItbGlzdC10ZW1wbGF0ZVwiKS5odG1sKCkpO1xuXHRcdCQoXCIjcGFnZS1jb250ZW50IC5zaWRlYmFyIC5zaWRlYmFyLWxpc3RcIikuaHRtbCh0cGwoe1xuXHRcdFx0c2NoZW1hczogc2NoZW1hc1xuXHRcdH0pKTtcblxuXHRcdC8vIENoZWNrIHVzZXIgcm9sZSBhbmQgcmVuZGVyIGFkZGl0aW9uYWwgc2lkZWJhciBpdGVtcyBhcyBuZWVkZWRcblx0XHR0cGwgPSBfLnRlbXBsYXRlKCQoXCIjc2lkZWJhci1hZG1pbi1saXN0LXRlbXBsYXRlXCIpLmh0bWwoKSk7XG5cdFx0JChcIiNwYWdlLWNvbnRlbnQgLnNpZGViYXIgLnNpZGViYXItYWRtaW4tbGlzdFwiKS5odG1sKHRwbCh0b2tlbkRhdGEpKTtcblx0fSk7XG5cblx0Ly8gUnVuIHN0dWZmIGZvciBzcGVjaWZpYyBwYWdlc1xuXHRnZXRTY2hlbWFzLnRoZW4oZnVuY3Rpb24oc2NoZW1hcyl7XG5cblx0fSk7XG59KTtcbiIsInZhciAkID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJyQnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJyQnXSA6IG51bGwpO1xuLy8gcmVxdWlyZSBvdGhlciBsaWJyYXJpZXMgYWZ0ZXIgdGhpcyBsaW5lXG52YXIgXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydfJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydfJ10gOiBudWxsKTtcbnZhciBCYWNrYm9uZSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydCYWNrYm9uZSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnQmFja2JvbmUnXSA6IG51bGwpO1xuQmFja2JvbmUuJCA9ICQ7XG5cbnZhciBtb2RlbCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG5cdHJlbmRlcjogZnVuY3Rpb24oKXtcblx0XHR2YXIgdHBsID0gXy50ZW1wbGF0ZSgkKFwiI21vZGVsLXRlbXBsYXRlXCIpLmh0bWwoKSk7XG5cdFx0JChcIiNwYWdlLWNvbnRlbnQgLm1haW4tY29udGVudFwiKS5odG1sKHRwbCh7XG5cdFx0XHRkYXRhOiB0aGlzLnRvSlNPTigpLFxuXHRcdFx0Y29sbGVjdGlvblNsdWc6IHRoaXMuY29sbGVjdGlvblNsdWcsXG5cdFx0XHRjb2xsZWN0aW9uTmFtZTogdGhpcy5jb2xsZWN0aW9uTmFtZSxcblx0XHRcdGZpZWxkczogdGhpcy5maWVsZHNcblx0XHR9KSkuYXR0cihcImNsYXNzXCIsIFwibWFpbi1jb250ZW50XCIpLmFkZENsYXNzKFwibW9kZWwtY29udGFpbmVyXCIpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBtb2RlbDsiLCJ2YXIgJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WyckJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWyckJ10gOiBudWxsKTtcbi8vIHJlcXVpcmUgb3RoZXIgbGlicmFyaWVzIGFmdGVyIHRoaXMgbGluZVxudmFyIF8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snXyddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnXyddIDogbnVsbCk7XG52YXIgQmFja2JvbmUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snQmFja2JvbmUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ0JhY2tib25lJ10gOiBudWxsKTtcbkJhY2tib25lLiQgPSAkO1xuXG52YXIgY2hhckNvbGxlY3Rpb24gPSByZXF1aXJlKFwiLi9jb2xsZWN0aW9uLmpzXCIpO1xudmFyIGNoYXJNb2RlbCA9IHJlcXVpcmUoXCIuL21vZGVsLmpzXCIpO1xudmFyIGNvbGxlY3Rpb25zID0ge307XG5cbnZhciByb3V0ZXIgPSBCYWNrYm9uZS5Sb3V0ZXIuZXh0ZW5kKHtcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oc2NoZW1hcyl7XG5cdFx0Xy5lYWNoKHNjaGVtYXMsIGZ1bmN0aW9uKGVsLCBpKXtcblx0XHRcdC8vIFJvdXRlcyBmb3IgZWFjaCBjb2xsZWN0aW9uXG5cdFx0XHR0aGlzLnJvdXRlKFwiY29sbGVjdGlvbnMvXCIgKyBlbC5jb2xsZWN0aW9uU2x1ZywgZWwuY29sbGVjdGlvbk5hbWUsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGZldGNoKGAke3dpbmRvdy5ob3N0fS9hcGkvY29sbGVjdGlvbnMvJHtlbC5jb2xsZWN0aW9uU2x1Z31gLCB7XG5cdFx0XHRcdFx0aGVhZGVyczogd2luZG93LmZldGNoSGVhZGVyc1xuXHRcdFx0XHR9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHRcdFx0XHR9KS50aGVuKGZ1bmN0aW9uKGNvbCl7XG5cdFx0XHRcdFx0dmFyIHNjaGVtYSA9IGVsO1xuXG5cdFx0XHRcdFx0Ly8gUmVuZGVyIGNvbGxlY3Rpb25cblx0XHRcdFx0XHRjb2xsZWN0aW9uc1tzY2hlbWEuY29sbGVjdGlvblNsdWddID0gbmV3IGNoYXJDb2xsZWN0aW9uKGNvbCk7XG5cdFx0XHRcdFx0dmFyIGNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uc1tzY2hlbWEuY29sbGVjdGlvblNsdWddO1xuXHRcdFx0XHRcdGNvbGxlY3Rpb24uc2x1ZyA9IHNjaGVtYS5jb2xsZWN0aW9uU2x1Zztcblx0XHRcdFx0XHRjb2xsZWN0aW9uLm5hbWUgPSBzY2hlbWEuY29sbGVjdGlvbk5hbWU7XG5cdFx0XHRcdFx0Y29sbGVjdGlvbi5yZW5kZXIoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gUm91dGVzIGZvciBlYWNoIG1vZGVsIHVuZGVyIGVhY2ggY29sbGVjdGlvblxuXHRcdFx0dGhpcy5yb3V0ZShcImNvbGxlY3Rpb25zL1wiICsgZWwuY29sbGVjdGlvblNsdWcgKyBcIi86dWlkXCIsIGVsLmNvbGxlY3Rpb25OYW1lLCBmdW5jdGlvbih1aWQpe1xuXHRcdFx0XHRmZXRjaChgJHt3aW5kb3cuaG9zdH0vYXBpL2NvbGxlY3Rpb25zLyR7ZWwuY29sbGVjdGlvblNsdWd9LyR7dWlkfWAsIHtcblx0XHRcdFx0XHRoZWFkZXJzOiB3aW5kb3cuZmV0Y2hIZWFkZXJzXG5cdFx0XHRcdH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdFx0XHRcdH0pLnRoZW4oZnVuY3Rpb24obSl7XG5cdFx0XHRcdFx0dmFyIG1vZGVsID0gbmV3IGNoYXJNb2RlbChtKTtcblx0XHRcdFx0XHRtb2RlbC5jb2xsZWN0aW9uU2x1ZyA9IGVsLmNvbGxlY3Rpb25TbHVnO1xuXHRcdFx0XHRcdG1vZGVsLmNvbGxlY3Rpb25OYW1lID0gZWwuY29sbGVjdGlvbk5hbWU7XG5cdFx0XHRcdFx0bW9kZWwuZmllbGRzID0gZWwuZmllbGRzO1xuXHRcdFx0XHRcdG1vZGVsLnJlbmRlcigpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0sIHRoaXMpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSByb3V0ZXI7IiwiLyoqXG4gKiBUaGUgY29kZSB3YXMgZXh0cmFjdGVkIGZyb206XG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGF2aWRjaGFtYmVycy9CYXNlNjQuanNcbiAqL1xuXG52YXIgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nO1xuXG5mdW5jdGlvbiBJbnZhbGlkQ2hhcmFjdGVyRXJyb3IobWVzc2FnZSkge1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xufVxuXG5JbnZhbGlkQ2hhcmFjdGVyRXJyb3IucHJvdG90eXBlID0gbmV3IEVycm9yKCk7XG5JbnZhbGlkQ2hhcmFjdGVyRXJyb3IucHJvdG90eXBlLm5hbWUgPSAnSW52YWxpZENoYXJhY3RlckVycm9yJztcblxuZnVuY3Rpb24gcG9seWZpbGwgKGlucHV0KSB7XG4gIHZhciBzdHIgPSBTdHJpbmcoaW5wdXQpLnJlcGxhY2UoLz0rJC8sICcnKTtcbiAgaWYgKHN0ci5sZW5ndGggJSA0ID09IDEpIHtcbiAgICB0aHJvdyBuZXcgSW52YWxpZENoYXJhY3RlckVycm9yKFwiJ2F0b2InIGZhaWxlZDogVGhlIHN0cmluZyB0byBiZSBkZWNvZGVkIGlzIG5vdCBjb3JyZWN0bHkgZW5jb2RlZC5cIik7XG4gIH1cbiAgZm9yIChcbiAgICAvLyBpbml0aWFsaXplIHJlc3VsdCBhbmQgY291bnRlcnNcbiAgICB2YXIgYmMgPSAwLCBicywgYnVmZmVyLCBpZHggPSAwLCBvdXRwdXQgPSAnJztcbiAgICAvLyBnZXQgbmV4dCBjaGFyYWN0ZXJcbiAgICBidWZmZXIgPSBzdHIuY2hhckF0KGlkeCsrKTtcbiAgICAvLyBjaGFyYWN0ZXIgZm91bmQgaW4gdGFibGU/IGluaXRpYWxpemUgYml0IHN0b3JhZ2UgYW5kIGFkZCBpdHMgYXNjaWkgdmFsdWU7XG4gICAgfmJ1ZmZlciAmJiAoYnMgPSBiYyAlIDQgPyBicyAqIDY0ICsgYnVmZmVyIDogYnVmZmVyLFxuICAgICAgLy8gYW5kIGlmIG5vdCBmaXJzdCBvZiBlYWNoIDQgY2hhcmFjdGVycyxcbiAgICAgIC8vIGNvbnZlcnQgdGhlIGZpcnN0IDggYml0cyB0byBvbmUgYXNjaWkgY2hhcmFjdGVyXG4gICAgICBiYysrICUgNCkgPyBvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgyNTUgJiBicyA+PiAoLTIgKiBiYyAmIDYpKSA6IDBcbiAgKSB7XG4gICAgLy8gdHJ5IHRvIGZpbmQgY2hhcmFjdGVyIGluIHRhYmxlICgwLTYzLCBub3QgZm91bmQgPT4gLTEpXG4gICAgYnVmZmVyID0gY2hhcnMuaW5kZXhPZihidWZmZXIpO1xuICB9XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuYXRvYiAmJiB3aW5kb3cuYXRvYi5iaW5kKHdpbmRvdykgfHwgcG9seWZpbGw7XG4iLCJ2YXIgYXRvYiA9IHJlcXVpcmUoJy4vYXRvYicpO1xuXG5mdW5jdGlvbiBiNjREZWNvZGVVbmljb2RlKHN0cikge1xuICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGF0b2Ioc3RyKS5yZXBsYWNlKC8oLikvZywgZnVuY3Rpb24gKG0sIHApIHtcbiAgICB2YXIgY29kZSA9IHAuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTtcbiAgICBpZiAoY29kZS5sZW5ndGggPCAyKSB7XG4gICAgICBjb2RlID0gJzAnICsgY29kZTtcbiAgICB9XG4gICAgcmV0dXJuICclJyArIGNvZGU7XG4gIH0pKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzdHIpIHtcbiAgdmFyIG91dHB1dCA9IHN0ci5yZXBsYWNlKC8tL2csIFwiK1wiKS5yZXBsYWNlKC9fL2csIFwiL1wiKTtcbiAgc3dpdGNoIChvdXRwdXQubGVuZ3RoICUgNCkge1xuICAgIGNhc2UgMDpcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMjpcbiAgICAgIG91dHB1dCArPSBcIj09XCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDM6XG4gICAgICBvdXRwdXQgKz0gXCI9XCI7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgXCJJbGxlZ2FsIGJhc2U2NHVybCBzdHJpbmchXCI7XG4gIH1cblxuICB0cnl7XG4gICAgcmV0dXJuIGI2NERlY29kZVVuaWNvZGUob3V0cHV0KTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIGF0b2Iob3V0cHV0KTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2U2NF91cmxfZGVjb2RlID0gcmVxdWlyZSgnLi9iYXNlNjRfdXJsX2RlY29kZScpO1xuXG5mdW5jdGlvbiBJbnZhbGlkVG9rZW5FcnJvcihtZXNzYWdlKSB7XG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG59XG5cbkludmFsaWRUb2tlbkVycm9yLnByb3RvdHlwZSA9IG5ldyBFcnJvcigpO1xuSW52YWxpZFRva2VuRXJyb3IucHJvdG90eXBlLm5hbWUgPSAnSW52YWxpZFRva2VuRXJyb3InO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0b2tlbixvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgdG9rZW4gIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IEludmFsaWRUb2tlbkVycm9yKCdJbnZhbGlkIHRva2VuIHNwZWNpZmllZCcpO1xuICB9XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHZhciBwb3MgPSBvcHRpb25zLmhlYWRlciA9PT0gdHJ1ZSA/IDAgOiAxO1xuICB0cnkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGJhc2U2NF91cmxfZGVjb2RlKHRva2VuLnNwbGl0KCcuJylbcG9zXSkpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdGhyb3cgbmV3IEludmFsaWRUb2tlbkVycm9yKCdJbnZhbGlkIHRva2VuIHNwZWNpZmllZDogJyArIGUubWVzc2FnZSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLkludmFsaWRUb2tlbkVycm9yID0gSW52YWxpZFRva2VuRXJyb3I7XG4iXX0=
