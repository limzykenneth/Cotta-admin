(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
// require other libraries after this line
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
Backbone.$ = $;

var charModel = require("./model.js");

var collection = Backbone.Collection.extend({
	initialize: function(model, options){

	},

	model: charModel,

	render: function(){
		console.log(this.schema);
		var tpl = _.template($("#models-list-template").html());
		$("#page-content .main-content").html(tpl({
			data: this.toJSON(),
			schema: this.schema
		})).attr("class", "main-content").addClass("models-container");
	},

	renderForm: function(){
		var tpl = _.template($("#model-creation-template").html());
		$("#page-content .main-content").html(tpl(this.schema)).attr("class", "main-content").addClass("edit-model");
		bindFormEvent($("#page-content .main-content.edit-model .model-form"), this.schema);
	}
});

function bindFormEvent($form, schema){
	$form.submit(function(e) {
		e.preventDefault();

		var formContent = parseFormData($(this).serializeArray(), schema);

		fetch($(this).attr("action"), {
			method: "post",
			headers: window.fetchHeaders,
			body: JSON.stringify(formContent)
		}).then(function(response){
			return response.json();
		}).then(function(data){
			console.log(data);
		});
	});
}

function parseFormData(formData, schema){
	var result = {};
	_.each(formData, function(el, i){
		if(result[el.name]){
			if(typeof result[el.name] == "string"){
				result[el.name] = [result[el.name]];
			}
			result[el.name].push(el.value);
		}else{
			result[el.name] = el.value;
		}
	});

	_.each(schema.fields, function(el){
		if(el.type == "checkbox" && typeof result[el.slug] == "string"){
			result[el.slug] = [result[el.slug]];
		}
	});
	return result;
}

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
var localStore = require("store");

var Router = require("./routes.js");
var router;

window.host = "http://localhost:3001";

// Check for cookie and if doesn't exist, go to login page
var authToken = localStore.get("accessToken");
window.rootURL = "http://localhost:3003";

window.fetchHeaders = new Headers({
	"Authorization": "Bearer " + authToken,
	"Content-Type": "application/json"
});

window.tokenData = null;
if(authToken){
	tokenData = jwtDecode(authToken);
}
if(!tokenData || moment(tokenData.exp).isAfter(Date.now())){
	window.getSchemas = Promise.reject(new Error("Authentication token invalid or missing")).catch(function(err){});
	if(window.location.pathname != "/login"){
		window.location.replace("/login");
	}
}else{
	window.getSchemas = fetch(`${host}/api/schema`, {
		method: "get",
		headers: fetchHeaders
	}).then(function(response){
		return response.json();
	});
}

// Bind routers
getSchemas.then(function(schemas){
	router = new Router(schemas);
	Backbone.history.start({pushState: true});
});

$(document).ready(function() {
	// Render header
	var tpl = _.template($("#header-right-template").html());
	$("#page-header .right").html(tpl());

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
	}).catch(function(err){

	});

	// Run stuff for specific pages
	getSchemas.then(function(schemas){

	}).catch(function(err){

	});
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./routes.js":4,"jwt-decode":7,"store":8}],3:[function(require,module,exports){
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

		bindDeleteEvent($("#page-content .main-content.model-container .delete-btn"));
	}
});

function bindDeleteEvent($deleteBtn){
	$deleteBtn.click(function(e) {
		e.preventDefault();

		fetch($(this).attr("action"), {
			headers: window.fetchHeaders,
			method: "delete"
		}).then(function(response){
			return response.json();
		}).then(function(data){
			console.log(data);
		});
	});
}

module.exports = model;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],4:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
// require other libraries after this line
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
Backbone.$ = $;
var localStore = require("store");

var charCollection = require("./collection.js");
var charModel = require("./model.js");
var collections = {};

var router = Backbone.Router.extend({
	initialize: function(schemas){
		_.each(schemas, function(el, i){
			// Routes for each collection
			this.route("collections/" + el.collectionSlug, el.collectionName, function(){
				window.getSchemas.then(function(){
					fetch(`${window.host}/api/collections/${el.collectionSlug}`, {
						headers: window.fetchHeaders
					}).then(function(response){
						return response.json();
					}).then(function(col){
						// Render collection
						collections[el.collectionSlug] = new charCollection(col);
						var collection = collections[el.collectionSlug];
						collection.schema = el;
						collection.render();
					});
				});
			});

			// Routes for each model under each collection
			this.route("collections/" + el.collectionSlug + "/:uid", el.collectionName + ": model", function(uid){
				window.getSchemas.then(function(){
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
			});

			// Routes for new model under each collection
			this.route("collections/" + el.collectionSlug + "/new", el.collectionName + ": new", function(){
				window.getSchemas.then(function(){
					if(collections[el.collectionSlug]){
						collections[el.collectionSlug].renderForm();
					}else{
						fetch(`${window.host}/api/collections/${el.collectionSlug}`, {
							headers: window.fetchHeaders
						}).then(function(response){
							return response.json();
						}).then(function(col){
							collections[el.collectionSlug] = new charCollection(col);
							collections[el.collectionSlug].schema = el;
							collections[el.collectionSlug].renderForm();
						});
					}
				});
			});

			// Login route
			this.route("login", "login", function(){
				var tpl = _.template($("#login-form-template").html());
				$("#page-content .main-content").html(tpl());

				$("#page-content .main-content .login-form form").submit(function(e) {
					e.preventDefault();

					var requestBody = parseFormData($(this).serializeArray());

					fetch($(this).attr("action"), {
						headers: window.fetchHeaders,
						method: "post",
						body: JSON.stringify(requestBody)
					}).then(function(response){
						return response.json();
					}).then(function(data){
						localStore.set("accessToken", data.access_token);
						window.location.replace("/");
					});
				});

				function parseFormData(formData){
					var result = {};
					_.each(formData, function(el, i){
						result[el.name] = el.value;
					});

					return result;
				}
			});

			// Logout route
			this.route("logout", "logout", function(){
				localStore.remove("accessToken");
				window.location.replace("/login");
			});
		}, this);
	}
});

module.exports = router;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./collection.js":1,"./model.js":3,"store":8}],5:[function(require,module,exports){
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

},{"./base64_url_decode":6}],8:[function(require,module,exports){
var engine = require('../src/store-engine')

var storages = require('../storages/all')
var plugins = [require('../plugins/json2')]

module.exports = engine.createStore(storages, plugins)

},{"../plugins/json2":9,"../src/store-engine":11,"../storages/all":13}],9:[function(require,module,exports){
module.exports = json2Plugin

function json2Plugin() {
	require('./lib/json2')
	return {}
}

},{"./lib/json2":10}],10:[function(require,module,exports){
/* eslint-disable */

//  json2.js
//  2016-10-28
//  Public Domain.
//  NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
//  See http://www.JSON.org/js.html
//  This code should be minified before deployment.
//  See http://javascript.crockford.com/jsmin.html

//  USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
//  NOT CONTROL.

//  This file creates a global JSON object containing two methods: stringify
//  and parse. This file provides the ES5 JSON capability to ES3 systems.
//  If a project might run on IE8 or earlier, then this file should be included.
//  This file does nothing on ES5 systems.

//      JSON.stringify(value, replacer, space)
//          value       any JavaScript value, usually an object or array.
//          replacer    an optional parameter that determines how object
//                      values are stringified for objects. It can be a
//                      function or an array of strings.
//          space       an optional parameter that specifies the indentation
//                      of nested structures. If it is omitted, the text will
//                      be packed without extra whitespace. If it is a number,
//                      it will specify the number of spaces to indent at each
//                      level. If it is a string (such as "\t" or "&nbsp;"),
//                      it contains the characters used to indent at each level.
//          This method produces a JSON text from a JavaScript value.
//          When an object value is found, if the object contains a toJSON
//          method, its toJSON method will be called and the result will be
//          stringified. A toJSON method does not serialize: it returns the
//          value represented by the name/value pair that should be serialized,
//          or undefined if nothing should be serialized. The toJSON method
//          will be passed the key associated with the value, and this will be
//          bound to the value.

//          For example, this would serialize Dates as ISO strings.

//              Date.prototype.toJSON = function (key) {
//                  function f(n) {
//                      // Format integers to have at least two digits.
//                      return (n < 10)
//                          ? "0" + n
//                          : n;
//                  }
//                  return this.getUTCFullYear()   + "-" +
//                       f(this.getUTCMonth() + 1) + "-" +
//                       f(this.getUTCDate())      + "T" +
//                       f(this.getUTCHours())     + ":" +
//                       f(this.getUTCMinutes())   + ":" +
//                       f(this.getUTCSeconds())   + "Z";
//              };

//          You can provide an optional replacer method. It will be passed the
//          key and value of each member, with this bound to the containing
//          object. The value that is returned from your method will be
//          serialized. If your method returns undefined, then the member will
//          be excluded from the serialization.

//          If the replacer parameter is an array of strings, then it will be
//          used to select the members to be serialized. It filters the results
//          such that only members with keys listed in the replacer array are
//          stringified.

//          Values that do not have JSON representations, such as undefined or
//          functions, will not be serialized. Such values in objects will be
//          dropped; in arrays they will be replaced with null. You can use
//          a replacer function to replace those with JSON values.

//          JSON.stringify(undefined) returns undefined.

//          The optional space parameter produces a stringification of the
//          value that is filled with line breaks and indentation to make it
//          easier to read.

//          If the space parameter is a non-empty string, then that string will
//          be used for indentation. If the space parameter is a number, then
//          the indentation will be that many spaces.

//          Example:

//          text = JSON.stringify(["e", {pluribus: "unum"}]);
//          // text is '["e",{"pluribus":"unum"}]'

//          text = JSON.stringify(["e", {pluribus: "unum"}], null, "\t");
//          // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

//          text = JSON.stringify([new Date()], function (key, value) {
//              return this[key] instanceof Date
//                  ? "Date(" + this[key] + ")"
//                  : value;
//          });
//          // text is '["Date(---current time---)"]'

//      JSON.parse(text, reviver)
//          This method parses a JSON text to produce an object or array.
//          It can throw a SyntaxError exception.

//          The optional reviver parameter is a function that can filter and
//          transform the results. It receives each of the keys and values,
//          and its return value is used instead of the original value.
//          If it returns what it received, then the structure is not modified.
//          If it returns undefined then the member is deleted.

//          Example:

//          // Parse the text. Values that look like ISO date strings will
//          // be converted to Date objects.

//          myData = JSON.parse(text, function (key, value) {
//              var a;
//              if (typeof value === "string") {
//                  a =
//   /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
//                  if (a) {
//                      return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
//                          +a[5], +a[6]));
//                  }
//              }
//              return value;
//          });

//          myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
//              var d;
//              if (typeof value === "string" &&
//                      value.slice(0, 5) === "Date(" &&
//                      value.slice(-1) === ")") {
//                  d = new Date(value.slice(5, -1));
//                  if (d) {
//                      return d;
//                  }
//              }
//              return value;
//          });

//  This is a reference implementation. You are free to copy, modify, or
//  redistribute.

/*jslint
    eval, for, this
*/

/*property
    JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== "object") {
    JSON = {};
}

(function () {
    "use strict";

    var rx_one = /^[\],:{}\s]*$/;
    var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
    var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10
            ? "0" + n
            : n;
    }

    function this_value() {
        return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== "function") {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear() + "-" +
                        f(this.getUTCMonth() + 1) + "-" +
                        f(this.getUTCDate()) + "T" +
                        f(this.getUTCHours()) + ":" +
                        f(this.getUTCMinutes()) + ":" +
                        f(this.getUTCSeconds()) + "Z"
                : null;
        };

        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }

    var gap;
    var indent;
    var meta;
    var rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string)
            ? "\"" + string.replace(rx_escapable, function (a) {
                var c = meta[a];
                return typeof c === "string"
                    ? c
                    : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + "\""
            : "\"" + string + "\"";
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i;          // The loop counter.
        var k;          // The member key.
        var v;          // The member value.
        var length;
        var mind = gap;
        var partial;
        var value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === "object" &&
                typeof value.toJSON === "function") {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case "string":
            return quote(value);

        case "number":

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value)
                ? String(value)
                : "null";

        case "boolean":
        case "null":

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce "null". The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is "object", we might be dealing with an object or an array or
// null.

        case "object":

// Due to a specification blunder in ECMAScript, typeof null is "object",
// so watch out for that case.

            if (!value) {
                return "null";
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === "[object Array]") {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || "null";
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? "[]"
                    : gap
                        ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]"
                        : "[" + partial.join(",") + "]";
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === "object") {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === "string") {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                gap
                                    ? ": "
                                    : ":"
                            ) + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                gap
                                    ? ": "
                                    : ":"
                            ) + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? "{}"
                : gap
                    ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
                    : "{" + partial.join(",") + "}";
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== "function") {
        meta = {    // table of character substitutions
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = "";
            indent = "";

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === "string") {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== "function" &&
                    (typeof replacer !== "object" ||
                    typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify");
            }

// Make a fake root object containing our value under the key of "".
// Return the result of stringifying the value.

            return str("", {"": value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== "function") {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k;
                var v;
                var value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function (a) {
                    return "\\u" +
                            ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with "()" and "new"
// because they can cause invocation, and "=" because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
// replace all simple value tokens with "]" characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or "]" or
// "," or ":" or "{" or "}". If that is so, then the text is safe for eval.

            if (
                rx_one.test(
                    text
                        .replace(rx_two, "@")
                        .replace(rx_three, "]")
                        .replace(rx_four, "")
                )
            ) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The "{" operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval("(" + text + ")");

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return (typeof reviver === "function")
                    ? walk({"": j}, "")
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError("JSON.parse");
        };
    }
}());
},{}],11:[function(require,module,exports){
var util = require('./util')
var slice = util.slice
var pluck = util.pluck
var each = util.each
var bind = util.bind
var create = util.create
var isList = util.isList
var isFunction = util.isFunction
var isObject = util.isObject

module.exports = {
	createStore: createStore
}

var storeAPI = {
	version: '2.0.12',
	enabled: false,
	
	// get returns the value of the given key. If that value
	// is undefined, it returns optionalDefaultValue instead.
	get: function(key, optionalDefaultValue) {
		var data = this.storage.read(this._namespacePrefix + key)
		return this._deserialize(data, optionalDefaultValue)
	},

	// set will store the given value at key and returns value.
	// Calling set with value === undefined is equivalent to calling remove.
	set: function(key, value) {
		if (value === undefined) {
			return this.remove(key)
		}
		this.storage.write(this._namespacePrefix + key, this._serialize(value))
		return value
	},

	// remove deletes the key and value stored at the given key.
	remove: function(key) {
		this.storage.remove(this._namespacePrefix + key)
	},

	// each will call the given callback once for each key-value pair
	// in this store.
	each: function(callback) {
		var self = this
		this.storage.each(function(val, namespacedKey) {
			callback.call(self, self._deserialize(val), (namespacedKey || '').replace(self._namespaceRegexp, ''))
		})
	},

	// clearAll will remove all the stored key-value pairs in this store.
	clearAll: function() {
		this.storage.clearAll()
	},

	// additional functionality that can't live in plugins
	// ---------------------------------------------------

	// hasNamespace returns true if this store instance has the given namespace.
	hasNamespace: function(namespace) {
		return (this._namespacePrefix == '__storejs_'+namespace+'_')
	},

	// createStore creates a store.js instance with the first
	// functioning storage in the list of storage candidates,
	// and applies the the given mixins to the instance.
	createStore: function() {
		return createStore.apply(this, arguments)
	},
	
	addPlugin: function(plugin) {
		this._addPlugin(plugin)
	},
	
	namespace: function(namespace) {
		return createStore(this.storage, this.plugins, namespace)
	}
}

function _warn() {
	var _console = (typeof console == 'undefined' ? null : console)
	if (!_console) { return }
	var fn = (_console.warn ? _console.warn : _console.log)
	fn.apply(_console, arguments)
}

function createStore(storages, plugins, namespace) {
	if (!namespace) {
		namespace = ''
	}
	if (storages && !isList(storages)) {
		storages = [storages]
	}
	if (plugins && !isList(plugins)) {
		plugins = [plugins]
	}

	var namespacePrefix = (namespace ? '__storejs_'+namespace+'_' : '')
	var namespaceRegexp = (namespace ? new RegExp('^'+namespacePrefix) : null)
	var legalNamespaces = /^[a-zA-Z0-9_\-]*$/ // alpha-numeric + underscore and dash
	if (!legalNamespaces.test(namespace)) {
		throw new Error('store.js namespaces can only have alphanumerics + underscores and dashes')
	}
	
	var _privateStoreProps = {
		_namespacePrefix: namespacePrefix,
		_namespaceRegexp: namespaceRegexp,

		_testStorage: function(storage) {
			try {
				var testStr = '__storejs__test__'
				storage.write(testStr, testStr)
				var ok = (storage.read(testStr) === testStr)
				storage.remove(testStr)
				return ok
			} catch(e) {
				return false
			}
		},

		_assignPluginFnProp: function(pluginFnProp, propName) {
			var oldFn = this[propName]
			this[propName] = function pluginFn() {
				var args = slice(arguments, 0)
				var self = this

				// super_fn calls the old function which was overwritten by
				// this mixin.
				function super_fn() {
					if (!oldFn) { return }
					each(arguments, function(arg, i) {
						args[i] = arg
					})
					return oldFn.apply(self, args)
				}

				// Give mixing function access to super_fn by prefixing all mixin function
				// arguments with super_fn.
				var newFnArgs = [super_fn].concat(args)

				return pluginFnProp.apply(self, newFnArgs)
			}
		},

		_serialize: function(obj) {
			return JSON.stringify(obj)
		},

		_deserialize: function(strVal, defaultVal) {
			if (!strVal) { return defaultVal }
			// It is possible that a raw string value has been previously stored
			// in a storage without using store.js, meaning it will be a raw
			// string value instead of a JSON serialized string. By defaulting
			// to the raw string value in case of a JSON parse error, we allow
			// for past stored values to be forwards-compatible with store.js
			var val = ''
			try { val = JSON.parse(strVal) }
			catch(e) { val = strVal }

			return (val !== undefined ? val : defaultVal)
		},
		
		_addStorage: function(storage) {
			if (this.enabled) { return }
			if (this._testStorage(storage)) {
				this.storage = storage
				this.enabled = true
			}
		},

		_addPlugin: function(plugin) {
			var self = this

			// If the plugin is an array, then add all plugins in the array.
			// This allows for a plugin to depend on other plugins.
			if (isList(plugin)) {
				each(plugin, function(plugin) {
					self._addPlugin(plugin)
				})
				return
			}

			// Keep track of all plugins we've seen so far, so that we
			// don't add any of them twice.
			var seenPlugin = pluck(this.plugins, function(seenPlugin) {
				return (plugin === seenPlugin)
			})
			if (seenPlugin) {
				return
			}
			this.plugins.push(plugin)

			// Check that the plugin is properly formed
			if (!isFunction(plugin)) {
				throw new Error('Plugins must be function values that return objects')
			}

			var pluginProperties = plugin.call(this)
			if (!isObject(pluginProperties)) {
				throw new Error('Plugins must return an object of function properties')
			}

			// Add the plugin function properties to this store instance.
			each(pluginProperties, function(pluginFnProp, propName) {
				if (!isFunction(pluginFnProp)) {
					throw new Error('Bad plugin property: '+propName+' from plugin '+plugin.name+'. Plugins should only return functions.')
				}
				self._assignPluginFnProp(pluginFnProp, propName)
			})
		},
		
		// Put deprecated properties in the private API, so as to not expose it to accidential
		// discovery through inspection of the store object.
		
		// Deprecated: addStorage
		addStorage: function(storage) {
			_warn('store.addStorage(storage) is deprecated. Use createStore([storages])')
			this._addStorage(storage)
		}
	}

	var store = create(_privateStoreProps, storeAPI, {
		plugins: []
	})
	store.raw = {}
	each(store, function(prop, propName) {
		if (isFunction(prop)) {
			store.raw[propName] = bind(store, prop)			
		}
	})
	each(storages, function(storage) {
		store._addStorage(storage)
	})
	each(plugins, function(plugin) {
		store._addPlugin(plugin)
	})
	return store
}

},{"./util":12}],12:[function(require,module,exports){
(function (global){
var assign = make_assign()
var create = make_create()
var trim = make_trim()
var Global = (typeof window !== 'undefined' ? window : global)

module.exports = {
	assign: assign,
	create: create,
	trim: trim,
	bind: bind,
	slice: slice,
	each: each,
	map: map,
	pluck: pluck,
	isList: isList,
	isFunction: isFunction,
	isObject: isObject,
	Global: Global
}

function make_assign() {
	if (Object.assign) {
		return Object.assign
	} else {
		return function shimAssign(obj, props1, props2, etc) {
			for (var i = 1; i < arguments.length; i++) {
				each(Object(arguments[i]), function(val, key) {
					obj[key] = val
				})
			}			
			return obj
		}
	}
}

function make_create() {
	if (Object.create) {
		return function create(obj, assignProps1, assignProps2, etc) {
			var assignArgsList = slice(arguments, 1)
			return assign.apply(this, [Object.create(obj)].concat(assignArgsList))
		}
	} else {
		function F() {} // eslint-disable-line no-inner-declarations
		return function create(obj, assignProps1, assignProps2, etc) {
			var assignArgsList = slice(arguments, 1)
			F.prototype = obj
			return assign.apply(this, [new F()].concat(assignArgsList))
		}
	}
}

function make_trim() {
	if (String.prototype.trim) {
		return function trim(str) {
			return String.prototype.trim.call(str)
		}
	} else {
		return function trim(str) {
			return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
		}
	}
}

function bind(obj, fn) {
	return function() {
		return fn.apply(obj, Array.prototype.slice.call(arguments, 0))
	}
}

function slice(arr, index) {
	return Array.prototype.slice.call(arr, index || 0)
}

function each(obj, fn) {
	pluck(obj, function(val, key) {
		fn(val, key)
		return false
	})
}

function map(obj, fn) {
	var res = (isList(obj) ? [] : {})
	pluck(obj, function(v, k) {
		res[k] = fn(v, k)
		return false
	})
	return res
}

function pluck(obj, fn) {
	if (isList(obj)) {
		for (var i=0; i<obj.length; i++) {
			if (fn(obj[i], i)) {
				return obj[i]
			}
		}
	} else {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (fn(obj[key], key)) {
					return obj[key]
				}
			}
		}
	}
}

function isList(val) {
	return (val != null && typeof val != 'function' && typeof val.length == 'number')
}

function isFunction(val) {
	return val && {}.toString.call(val) === '[object Function]'
}

function isObject(val) {
	return val && {}.toString.call(val) === '[object Object]'
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],13:[function(require,module,exports){
module.exports = [
	// Listed in order of usage preference
	require('./localStorage'),
	require('./oldFF-globalStorage'),
	require('./oldIE-userDataStorage'),
	require('./cookieStorage'),
	require('./sessionStorage'),
	require('./memoryStorage')
]

},{"./cookieStorage":14,"./localStorage":15,"./memoryStorage":16,"./oldFF-globalStorage":17,"./oldIE-userDataStorage":18,"./sessionStorage":19}],14:[function(require,module,exports){
// cookieStorage is useful Safari private browser mode, where localStorage
// doesn't work but cookies do. This implementation is adopted from
// https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage

var util = require('../src/util')
var Global = util.Global
var trim = util.trim

module.exports = {
	name: 'cookieStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

var doc = Global.document

function read(key) {
	if (!key || !_has(key)) { return null }
	var regexpStr = "(?:^|.*;\\s*)" +
		escape(key).replace(/[\-\.\+\*]/g, "\\$&") +
		"\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"
	return unescape(doc.cookie.replace(new RegExp(regexpStr), "$1"))
}

function each(callback) {
	var cookies = doc.cookie.split(/; ?/g)
	for (var i = cookies.length - 1; i >= 0; i--) {
		if (!trim(cookies[i])) {
			continue
		}
		var kvp = cookies[i].split('=')
		var key = unescape(kvp[0])
		var val = unescape(kvp[1])
		callback(val, key)
	}
}

function write(key, data) {
	if(!key) { return }
	doc.cookie = escape(key) + "=" + escape(data) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/"
}

function remove(key) {
	if (!key || !_has(key)) {
		return
	}
	doc.cookie = escape(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"
}

function clearAll() {
	each(function(_, key) {
		remove(key)
	})
}

function _has(key) {
	return (new RegExp("(?:^|;\\s*)" + escape(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(doc.cookie)
}

},{"../src/util":12}],15:[function(require,module,exports){
var util = require('../src/util')
var Global = util.Global

module.exports = {
	name: 'localStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

function localStorage() {
	return Global.localStorage
}

function read(key) {
	return localStorage().getItem(key)
}

function write(key, data) {
	return localStorage().setItem(key, data)
}

function each(fn) {
	for (var i = localStorage().length - 1; i >= 0; i--) {
		var key = localStorage().key(i)
		fn(read(key), key)
	}
}

function remove(key) {
	return localStorage().removeItem(key)
}

function clearAll() {
	return localStorage().clear()
}

},{"../src/util":12}],16:[function(require,module,exports){
// memoryStorage is a useful last fallback to ensure that the store
// is functions (meaning store.get(), store.set(), etc will all function).
// However, stored values will not persist when the browser navigates to
// a new page or reloads the current page.

module.exports = {
	name: 'memoryStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

var memoryStorage = {}

function read(key) {
	return memoryStorage[key]
}

function write(key, data) {
	memoryStorage[key] = data
}

function each(callback) {
	for (var key in memoryStorage) {
		if (memoryStorage.hasOwnProperty(key)) {
			callback(memoryStorage[key], key)
		}
	}
}

function remove(key) {
	delete memoryStorage[key]
}

function clearAll(key) {
	memoryStorage = {}
}

},{}],17:[function(require,module,exports){
// oldFF-globalStorage provides storage for Firefox
// versions 6 and 7, where no localStorage, etc
// is available.

var util = require('../src/util')
var Global = util.Global

module.exports = {
	name: 'oldFF-globalStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

var globalStorage = Global.globalStorage

function read(key) {
	return globalStorage[key]
}

function write(key, data) {
	globalStorage[key] = data
}

function each(fn) {
	for (var i = globalStorage.length - 1; i >= 0; i--) {
		var key = globalStorage.key(i)
		fn(globalStorage[key], key)
	}
}

function remove(key) {
	return globalStorage.removeItem(key)
}

function clearAll() {
	each(function(key, _) {
		delete globalStorage[key]
	})
}

},{"../src/util":12}],18:[function(require,module,exports){
// oldIE-userDataStorage provides storage for Internet Explorer
// versions 6 and 7, where no localStorage, sessionStorage, etc
// is available.

var util = require('../src/util')
var Global = util.Global

module.exports = {
	name: 'oldIE-userDataStorage',
	write: write,
	read: read,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

var storageName = 'storejs'
var doc = Global.document
var _withStorageEl = _makeIEStorageElFunction()
var disable = (Global.navigator ? Global.navigator.userAgent : '').match(/ (MSIE 8|MSIE 9|MSIE 10)\./) // MSIE 9.x, MSIE 10.x

function write(unfixedKey, data) {
	if (disable) { return }
	var fixedKey = fixKey(unfixedKey)
	_withStorageEl(function(storageEl) {
		storageEl.setAttribute(fixedKey, data)
		storageEl.save(storageName)
	})
}

function read(unfixedKey) {
	if (disable) { return }
	var fixedKey = fixKey(unfixedKey)
	var res = null
	_withStorageEl(function(storageEl) {
		res = storageEl.getAttribute(fixedKey)
	})
	return res
}

function each(callback) {
	_withStorageEl(function(storageEl) {
		var attributes = storageEl.XMLDocument.documentElement.attributes
		for (var i=attributes.length-1; i>=0; i--) {
			var attr = attributes[i]
			callback(storageEl.getAttribute(attr.name), attr.name)
		}
	})
}

function remove(unfixedKey) {
	var fixedKey = fixKey(unfixedKey)
	_withStorageEl(function(storageEl) {
		storageEl.removeAttribute(fixedKey)
		storageEl.save(storageName)
	})
}

function clearAll() {
	_withStorageEl(function(storageEl) {
		var attributes = storageEl.XMLDocument.documentElement.attributes
		storageEl.load(storageName)
		for (var i=attributes.length-1; i>=0; i--) {
			storageEl.removeAttribute(attributes[i].name)
		}
		storageEl.save(storageName)
	})
}

// Helpers
//////////

// In IE7, keys cannot start with a digit or contain certain chars.
// See https://github.com/marcuswestin/store.js/issues/40
// See https://github.com/marcuswestin/store.js/issues/83
var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
function fixKey(key) {
	return key.replace(/^\d/, '___$&').replace(forbiddenCharsRegex, '___')
}

function _makeIEStorageElFunction() {
	if (!doc || !doc.documentElement || !doc.documentElement.addBehavior) {
		return null
	}
	var scriptTag = 'script',
		storageOwner,
		storageContainer,
		storageEl

	// Since #userData storage applies only to specific paths, we need to
	// somehow link our data to a specific path.  We choose /favicon.ico
	// as a pretty safe option, since all browsers already make a request to
	// this URL anyway and being a 404 will not hurt us here.  We wrap an
	// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
	// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
	// since the iframe access rules appear to allow direct access and
	// manipulation of the document element, even for a 404 page.  This
	// document can be used instead of the current document (which would
	// have been limited to the current path) to perform #userData storage.
	try {
		/* global ActiveXObject */
		storageContainer = new ActiveXObject('htmlfile')
		storageContainer.open()
		storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>')
		storageContainer.close()
		storageOwner = storageContainer.w.frames[0].document
		storageEl = storageOwner.createElement('div')
	} catch(e) {
		// somehow ActiveXObject instantiation failed (perhaps some special
		// security settings or otherwse), fall back to per-path storage
		storageEl = doc.createElement('div')
		storageOwner = doc.body
	}

	return function(storeFunction) {
		var args = [].slice.call(arguments, 0)
		args.unshift(storageEl)
		// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
		// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
		storageOwner.appendChild(storageEl)
		storageEl.addBehavior('#default#userData')
		storageEl.load(storageName)
		storeFunction.apply(this, args)
		storageOwner.removeChild(storageEl)
		return
	}
}

},{"../src/util":12}],19:[function(require,module,exports){
var util = require('../src/util')
var Global = util.Global

module.exports = {
	name: 'sessionStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll
}

function sessionStorage() {
	return Global.sessionStorage
}

function read(key) {
	return sessionStorage().getItem(key)
}

function write(key, data) {
	return sessionStorage().setItem(key, data)
}

function each(fn) {
	for (var i = sessionStorage().length - 1; i >= 0; i--) {
		var key = sessionStorage().key(i)
		fn(read(key), key)
	}
}

function remove(key) {
	return sessionStorage().removeItem(key)
}

function clearAll() {
	return sessionStorage().clear()
}

},{"../src/util":12}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqYXZhc2NyaXB0cy9jb2xsZWN0aW9uLmpzIiwiamF2YXNjcmlwdHMvY3VzdG9tLmpzIiwiamF2YXNjcmlwdHMvbW9kZWwuanMiLCJqYXZhc2NyaXB0cy9yb3V0ZXMuanMiLCJub2RlX21vZHVsZXMvand0LWRlY29kZS9saWIvYXRvYi5qcyIsIm5vZGVfbW9kdWxlcy9qd3QtZGVjb2RlL2xpYi9iYXNlNjRfdXJsX2RlY29kZS5qcyIsIm5vZGVfbW9kdWxlcy9qd3QtZGVjb2RlL2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zdG9yZS9kaXN0L3N0b3JlLmxlZ2FjeS5qcyIsIm5vZGVfbW9kdWxlcy9zdG9yZS9wbHVnaW5zL2pzb24yLmpzIiwibm9kZV9tb2R1bGVzL3N0b3JlL3BsdWdpbnMvbGliL2pzb24yLmpzIiwibm9kZV9tb2R1bGVzL3N0b3JlL3NyYy9zdG9yZS1lbmdpbmUuanMiLCJub2RlX21vZHVsZXMvc3RvcmUvc3JjL3V0aWwuanMiLCJub2RlX21vZHVsZXMvc3RvcmUvc3RvcmFnZXMvYWxsLmpzIiwibm9kZV9tb2R1bGVzL3N0b3JlL3N0b3JhZ2VzL2Nvb2tpZVN0b3JhZ2UuanMiLCJub2RlX21vZHVsZXMvc3RvcmUvc3RvcmFnZXMvbG9jYWxTdG9yYWdlLmpzIiwibm9kZV9tb2R1bGVzL3N0b3JlL3N0b3JhZ2VzL21lbW9yeVN0b3JhZ2UuanMiLCJub2RlX21vZHVsZXMvc3RvcmUvc3RvcmFnZXMvb2xkRkYtZ2xvYmFsU3RvcmFnZS5qcyIsIm5vZGVfbW9kdWxlcy9zdG9yZS9zdG9yYWdlcy9vbGRJRS11c2VyRGF0YVN0b3JhZ2UuanMiLCJub2RlX21vZHVsZXMvc3RvcmUvc3RvcmFnZXMvc2Vzc2lvblN0b3JhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDN09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WyckJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWyckJ10gOiBudWxsKTtcbi8vIHJlcXVpcmUgb3RoZXIgbGlicmFyaWVzIGFmdGVyIHRoaXMgbGluZVxudmFyIF8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snXyddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnXyddIDogbnVsbCk7XG52YXIgQmFja2JvbmUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snQmFja2JvbmUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ0JhY2tib25lJ10gOiBudWxsKTtcbkJhY2tib25lLiQgPSAkO1xuXG52YXIgY2hhck1vZGVsID0gcmVxdWlyZShcIi4vbW9kZWwuanNcIik7XG5cbnZhciBjb2xsZWN0aW9uID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xuXHRpbml0aWFsaXplOiBmdW5jdGlvbihtb2RlbCwgb3B0aW9ucyl7XG5cblx0fSxcblxuXHRtb2RlbDogY2hhck1vZGVsLFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKXtcblx0XHRjb25zb2xlLmxvZyh0aGlzLnNjaGVtYSk7XG5cdFx0dmFyIHRwbCA9IF8udGVtcGxhdGUoJChcIiNtb2RlbHMtbGlzdC10ZW1wbGF0ZVwiKS5odG1sKCkpO1xuXHRcdCQoXCIjcGFnZS1jb250ZW50IC5tYWluLWNvbnRlbnRcIikuaHRtbCh0cGwoe1xuXHRcdFx0ZGF0YTogdGhpcy50b0pTT04oKSxcblx0XHRcdHNjaGVtYTogdGhpcy5zY2hlbWFcblx0XHR9KSkuYXR0cihcImNsYXNzXCIsIFwibWFpbi1jb250ZW50XCIpLmFkZENsYXNzKFwibW9kZWxzLWNvbnRhaW5lclwiKTtcblx0fSxcblxuXHRyZW5kZXJGb3JtOiBmdW5jdGlvbigpe1xuXHRcdHZhciB0cGwgPSBfLnRlbXBsYXRlKCQoXCIjbW9kZWwtY3JlYXRpb24tdGVtcGxhdGVcIikuaHRtbCgpKTtcblx0XHQkKFwiI3BhZ2UtY29udGVudCAubWFpbi1jb250ZW50XCIpLmh0bWwodHBsKHRoaXMuc2NoZW1hKSkuYXR0cihcImNsYXNzXCIsIFwibWFpbi1jb250ZW50XCIpLmFkZENsYXNzKFwiZWRpdC1tb2RlbFwiKTtcblx0XHRiaW5kRm9ybUV2ZW50KCQoXCIjcGFnZS1jb250ZW50IC5tYWluLWNvbnRlbnQuZWRpdC1tb2RlbCAubW9kZWwtZm9ybVwiKSwgdGhpcy5zY2hlbWEpO1xuXHR9XG59KTtcblxuZnVuY3Rpb24gYmluZEZvcm1FdmVudCgkZm9ybSwgc2NoZW1hKXtcblx0JGZvcm0uc3VibWl0KGZ1bmN0aW9uKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHR2YXIgZm9ybUNvbnRlbnQgPSBwYXJzZUZvcm1EYXRhKCQodGhpcykuc2VyaWFsaXplQXJyYXkoKSwgc2NoZW1hKTtcblxuXHRcdGZldGNoKCQodGhpcykuYXR0cihcImFjdGlvblwiKSwge1xuXHRcdFx0bWV0aG9kOiBcInBvc3RcIixcblx0XHRcdGhlYWRlcnM6IHdpbmRvdy5mZXRjaEhlYWRlcnMsXG5cdFx0XHRib2R5OiBKU09OLnN0cmluZ2lmeShmb3JtQ29udGVudClcblx0XHR9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdFx0fSkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdGNvbnNvbGUubG9nKGRhdGEpO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gcGFyc2VGb3JtRGF0YShmb3JtRGF0YSwgc2NoZW1hKXtcblx0dmFyIHJlc3VsdCA9IHt9O1xuXHRfLmVhY2goZm9ybURhdGEsIGZ1bmN0aW9uKGVsLCBpKXtcblx0XHRpZihyZXN1bHRbZWwubmFtZV0pe1xuXHRcdFx0aWYodHlwZW9mIHJlc3VsdFtlbC5uYW1lXSA9PSBcInN0cmluZ1wiKXtcblx0XHRcdFx0cmVzdWx0W2VsLm5hbWVdID0gW3Jlc3VsdFtlbC5uYW1lXV07XG5cdFx0XHR9XG5cdFx0XHRyZXN1bHRbZWwubmFtZV0ucHVzaChlbC52YWx1ZSk7XG5cdFx0fWVsc2V7XG5cdFx0XHRyZXN1bHRbZWwubmFtZV0gPSBlbC52YWx1ZTtcblx0XHR9XG5cdH0pO1xuXG5cdF8uZWFjaChzY2hlbWEuZmllbGRzLCBmdW5jdGlvbihlbCl7XG5cdFx0aWYoZWwudHlwZSA9PSBcImNoZWNrYm94XCIgJiYgdHlwZW9mIHJlc3VsdFtlbC5zbHVnXSA9PSBcInN0cmluZ1wiKXtcblx0XHRcdHJlc3VsdFtlbC5zbHVnXSA9IFtyZXN1bHRbZWwuc2x1Z11dO1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29sbGVjdGlvbjsiLCJ2YXIgJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WyckJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWyckJ10gOiBudWxsKTtcbi8vIHJlcXVpcmUgb3RoZXIgbGlicmFyaWVzIGFmdGVyIHRoaXMgbGluZVxudmFyIF8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snXyddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnXyddIDogbnVsbCk7XG52YXIgQmFja2JvbmUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snQmFja2JvbmUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ0JhY2tib25lJ10gOiBudWxsKTtcbkJhY2tib25lLiQgPSAkO1xudmFyIGp3dERlY29kZSA9IHJlcXVpcmUoXCJqd3QtZGVjb2RlXCIpO1xudmFyIGxvY2FsU3RvcmUgPSByZXF1aXJlKFwic3RvcmVcIik7XG5cbnZhciBSb3V0ZXIgPSByZXF1aXJlKFwiLi9yb3V0ZXMuanNcIik7XG52YXIgcm91dGVyO1xuXG53aW5kb3cuaG9zdCA9IFwiaHR0cDovL2xvY2FsaG9zdDozMDAxXCI7XG5cbi8vIENoZWNrIGZvciBjb29raWUgYW5kIGlmIGRvZXNuJ3QgZXhpc3QsIGdvIHRvIGxvZ2luIHBhZ2VcbnZhciBhdXRoVG9rZW4gPSBsb2NhbFN0b3JlLmdldChcImFjY2Vzc1Rva2VuXCIpO1xud2luZG93LnJvb3RVUkwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwM1wiO1xuXG53aW5kb3cuZmV0Y2hIZWFkZXJzID0gbmV3IEhlYWRlcnMoe1xuXHRcIkF1dGhvcml6YXRpb25cIjogXCJCZWFyZXIgXCIgKyBhdXRoVG9rZW4sXG5cdFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXG59KTtcblxud2luZG93LnRva2VuRGF0YSA9IG51bGw7XG5pZihhdXRoVG9rZW4pe1xuXHR0b2tlbkRhdGEgPSBqd3REZWNvZGUoYXV0aFRva2VuKTtcbn1cbmlmKCF0b2tlbkRhdGEgfHwgbW9tZW50KHRva2VuRGF0YS5leHApLmlzQWZ0ZXIoRGF0ZS5ub3coKSkpe1xuXHR3aW5kb3cuZ2V0U2NoZW1hcyA9IFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkF1dGhlbnRpY2F0aW9uIHRva2VuIGludmFsaWQgb3IgbWlzc2luZ1wiKSkuY2F0Y2goZnVuY3Rpb24oZXJyKXt9KTtcblx0aWYod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICE9IFwiL2xvZ2luXCIpe1xuXHRcdHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKFwiL2xvZ2luXCIpO1xuXHR9XG59ZWxzZXtcblx0d2luZG93LmdldFNjaGVtYXMgPSBmZXRjaChgJHtob3N0fS9hcGkvc2NoZW1hYCwge1xuXHRcdG1ldGhvZDogXCJnZXRcIixcblx0XHRoZWFkZXJzOiBmZXRjaEhlYWRlcnNcblx0fSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcblx0fSk7XG59XG5cbi8vIEJpbmQgcm91dGVyc1xuZ2V0U2NoZW1hcy50aGVuKGZ1bmN0aW9uKHNjaGVtYXMpe1xuXHRyb3V0ZXIgPSBuZXcgUm91dGVyKHNjaGVtYXMpO1xuXHRCYWNrYm9uZS5oaXN0b3J5LnN0YXJ0KHtwdXNoU3RhdGU6IHRydWV9KTtcbn0pO1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblx0Ly8gUmVuZGVyIGhlYWRlclxuXHR2YXIgdHBsID0gXy50ZW1wbGF0ZSgkKFwiI2hlYWRlci1yaWdodC10ZW1wbGF0ZVwiKS5odG1sKCkpO1xuXHQkKFwiI3BhZ2UtaGVhZGVyIC5yaWdodFwiKS5odG1sKHRwbCgpKTtcblxuXHQvLyBSdW4gc3R1ZmYgY29tbW9uIHRvIGFsbCBwYWdlc1xuXHRnZXRTY2hlbWFzLnRoZW4oZnVuY3Rpb24oc2NoZW1hcyl7XG5cdFx0Ly8gUmVuZGVyIHNjaGVtYSBpbnRvIHNpZGViYXJcblx0XHR2YXIgdHBsID0gXy50ZW1wbGF0ZSgkKFwiI3NpZGViYXItbGlzdC10ZW1wbGF0ZVwiKS5odG1sKCkpO1xuXHRcdCQoXCIjcGFnZS1jb250ZW50IC5zaWRlYmFyIC5zaWRlYmFyLWxpc3RcIikuaHRtbCh0cGwoe1xuXHRcdFx0c2NoZW1hczogc2NoZW1hc1xuXHRcdH0pKTtcblxuXHRcdC8vIENoZWNrIHVzZXIgcm9sZSBhbmQgcmVuZGVyIGFkZGl0aW9uYWwgc2lkZWJhciBpdGVtcyBhcyBuZWVkZWRcblx0XHR0cGwgPSBfLnRlbXBsYXRlKCQoXCIjc2lkZWJhci1hZG1pbi1saXN0LXRlbXBsYXRlXCIpLmh0bWwoKSk7XG5cdFx0JChcIiNwYWdlLWNvbnRlbnQgLnNpZGViYXIgLnNpZGViYXItYWRtaW4tbGlzdFwiKS5odG1sKHRwbCh0b2tlbkRhdGEpKTtcblx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyKXtcblxuXHR9KTtcblxuXHQvLyBSdW4gc3R1ZmYgZm9yIHNwZWNpZmljIHBhZ2VzXG5cdGdldFNjaGVtYXMudGhlbihmdW5jdGlvbihzY2hlbWFzKXtcblxuXHR9KS5jYXRjaChmdW5jdGlvbihlcnIpe1xuXG5cdH0pO1xufSk7XG4iLCJ2YXIgJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WyckJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWyckJ10gOiBudWxsKTtcbi8vIHJlcXVpcmUgb3RoZXIgbGlicmFyaWVzIGFmdGVyIHRoaXMgbGluZVxudmFyIF8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snXyddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnXyddIDogbnVsbCk7XG52YXIgQmFja2JvbmUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snQmFja2JvbmUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ0JhY2tib25lJ10gOiBudWxsKTtcbkJhY2tib25lLiQgPSAkO1xuXG52YXIgbW9kZWwgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuXHRyZW5kZXI6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIHRwbCA9IF8udGVtcGxhdGUoJChcIiNtb2RlbC10ZW1wbGF0ZVwiKS5odG1sKCkpO1xuXHRcdCQoXCIjcGFnZS1jb250ZW50IC5tYWluLWNvbnRlbnRcIikuaHRtbCh0cGwoe1xuXHRcdFx0ZGF0YTogdGhpcy50b0pTT04oKSxcblx0XHRcdGNvbGxlY3Rpb25TbHVnOiB0aGlzLmNvbGxlY3Rpb25TbHVnLFxuXHRcdFx0Y29sbGVjdGlvbk5hbWU6IHRoaXMuY29sbGVjdGlvbk5hbWUsXG5cdFx0XHRmaWVsZHM6IHRoaXMuZmllbGRzXG5cdFx0fSkpLmF0dHIoXCJjbGFzc1wiLCBcIm1haW4tY29udGVudFwiKS5hZGRDbGFzcyhcIm1vZGVsLWNvbnRhaW5lclwiKTtcblxuXHRcdGJpbmREZWxldGVFdmVudCgkKFwiI3BhZ2UtY29udGVudCAubWFpbi1jb250ZW50Lm1vZGVsLWNvbnRhaW5lciAuZGVsZXRlLWJ0blwiKSk7XG5cdH1cbn0pO1xuXG5mdW5jdGlvbiBiaW5kRGVsZXRlRXZlbnQoJGRlbGV0ZUJ0bil7XG5cdCRkZWxldGVCdG4uY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGZldGNoKCQodGhpcykuYXR0cihcImFjdGlvblwiKSwge1xuXHRcdFx0aGVhZGVyczogd2luZG93LmZldGNoSGVhZGVycyxcblx0XHRcdG1ldGhvZDogXCJkZWxldGVcIlxuXHRcdH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcblx0XHR9KS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0Y29uc29sZS5sb2coZGF0YSk7XG5cdFx0fSk7XG5cdH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1vZGVsOyIsInZhciAkID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJyQnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJyQnXSA6IG51bGwpO1xuLy8gcmVxdWlyZSBvdGhlciBsaWJyYXJpZXMgYWZ0ZXIgdGhpcyBsaW5lXG52YXIgXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydfJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydfJ10gOiBudWxsKTtcbnZhciBCYWNrYm9uZSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydCYWNrYm9uZSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnQmFja2JvbmUnXSA6IG51bGwpO1xuQmFja2JvbmUuJCA9ICQ7XG52YXIgbG9jYWxTdG9yZSA9IHJlcXVpcmUoXCJzdG9yZVwiKTtcblxudmFyIGNoYXJDb2xsZWN0aW9uID0gcmVxdWlyZShcIi4vY29sbGVjdGlvbi5qc1wiKTtcbnZhciBjaGFyTW9kZWwgPSByZXF1aXJlKFwiLi9tb2RlbC5qc1wiKTtcbnZhciBjb2xsZWN0aW9ucyA9IHt9O1xuXG52YXIgcm91dGVyID0gQmFja2JvbmUuUm91dGVyLmV4dGVuZCh7XG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKHNjaGVtYXMpe1xuXHRcdF8uZWFjaChzY2hlbWFzLCBmdW5jdGlvbihlbCwgaSl7XG5cdFx0XHQvLyBSb3V0ZXMgZm9yIGVhY2ggY29sbGVjdGlvblxuXHRcdFx0dGhpcy5yb3V0ZShcImNvbGxlY3Rpb25zL1wiICsgZWwuY29sbGVjdGlvblNsdWcsIGVsLmNvbGxlY3Rpb25OYW1lLCBmdW5jdGlvbigpe1xuXHRcdFx0XHR3aW5kb3cuZ2V0U2NoZW1hcy50aGVuKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0ZmV0Y2goYCR7d2luZG93Lmhvc3R9L2FwaS9jb2xsZWN0aW9ucy8ke2VsLmNvbGxlY3Rpb25TbHVnfWAsIHtcblx0XHRcdFx0XHRcdGhlYWRlcnM6IHdpbmRvdy5mZXRjaEhlYWRlcnNcblx0XHRcdFx0XHR9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdFx0XHRcdFx0fSkudGhlbihmdW5jdGlvbihjb2wpe1xuXHRcdFx0XHRcdFx0Ly8gUmVuZGVyIGNvbGxlY3Rpb25cblx0XHRcdFx0XHRcdGNvbGxlY3Rpb25zW2VsLmNvbGxlY3Rpb25TbHVnXSA9IG5ldyBjaGFyQ29sbGVjdGlvbihjb2wpO1xuXHRcdFx0XHRcdFx0dmFyIGNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uc1tlbC5jb2xsZWN0aW9uU2x1Z107XG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uLnNjaGVtYSA9IGVsO1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbi5yZW5kZXIoKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gUm91dGVzIGZvciBlYWNoIG1vZGVsIHVuZGVyIGVhY2ggY29sbGVjdGlvblxuXHRcdFx0dGhpcy5yb3V0ZShcImNvbGxlY3Rpb25zL1wiICsgZWwuY29sbGVjdGlvblNsdWcgKyBcIi86dWlkXCIsIGVsLmNvbGxlY3Rpb25OYW1lICsgXCI6IG1vZGVsXCIsIGZ1bmN0aW9uKHVpZCl7XG5cdFx0XHRcdHdpbmRvdy5nZXRTY2hlbWFzLnRoZW4oZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRmZXRjaChgJHt3aW5kb3cuaG9zdH0vYXBpL2NvbGxlY3Rpb25zLyR7ZWwuY29sbGVjdGlvblNsdWd9LyR7dWlkfWAsIHtcblx0XHRcdFx0XHRcdGhlYWRlcnM6IHdpbmRvdy5mZXRjaEhlYWRlcnNcblx0XHRcdFx0XHR9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdFx0XHRcdFx0fSkudGhlbihmdW5jdGlvbihtKXtcblx0XHRcdFx0XHRcdHZhciBtb2RlbCA9IG5ldyBjaGFyTW9kZWwobSk7XG5cdFx0XHRcdFx0XHRtb2RlbC5jb2xsZWN0aW9uU2x1ZyA9IGVsLmNvbGxlY3Rpb25TbHVnO1xuXHRcdFx0XHRcdFx0bW9kZWwuY29sbGVjdGlvbk5hbWUgPSBlbC5jb2xsZWN0aW9uTmFtZTtcblx0XHRcdFx0XHRcdG1vZGVsLmZpZWxkcyA9IGVsLmZpZWxkcztcblx0XHRcdFx0XHRcdG1vZGVsLnJlbmRlcigpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBSb3V0ZXMgZm9yIG5ldyBtb2RlbCB1bmRlciBlYWNoIGNvbGxlY3Rpb25cblx0XHRcdHRoaXMucm91dGUoXCJjb2xsZWN0aW9ucy9cIiArIGVsLmNvbGxlY3Rpb25TbHVnICsgXCIvbmV3XCIsIGVsLmNvbGxlY3Rpb25OYW1lICsgXCI6IG5ld1wiLCBmdW5jdGlvbigpe1xuXHRcdFx0XHR3aW5kb3cuZ2V0U2NoZW1hcy50aGVuKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0aWYoY29sbGVjdGlvbnNbZWwuY29sbGVjdGlvblNsdWddKXtcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb25zW2VsLmNvbGxlY3Rpb25TbHVnXS5yZW5kZXJGb3JtKCk7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRmZXRjaChgJHt3aW5kb3cuaG9zdH0vYXBpL2NvbGxlY3Rpb25zLyR7ZWwuY29sbGVjdGlvblNsdWd9YCwge1xuXHRcdFx0XHRcdFx0XHRoZWFkZXJzOiB3aW5kb3cuZmV0Y2hIZWFkZXJzXG5cdFx0XHRcdFx0XHR9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcblx0XHRcdFx0XHRcdH0pLnRoZW4oZnVuY3Rpb24oY29sKXtcblx0XHRcdFx0XHRcdFx0Y29sbGVjdGlvbnNbZWwuY29sbGVjdGlvblNsdWddID0gbmV3IGNoYXJDb2xsZWN0aW9uKGNvbCk7XG5cdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb25zW2VsLmNvbGxlY3Rpb25TbHVnXS5zY2hlbWEgPSBlbDtcblx0XHRcdFx0XHRcdFx0Y29sbGVjdGlvbnNbZWwuY29sbGVjdGlvblNsdWddLnJlbmRlckZvcm0oKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gTG9naW4gcm91dGVcblx0XHRcdHRoaXMucm91dGUoXCJsb2dpblwiLCBcImxvZ2luXCIsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciB0cGwgPSBfLnRlbXBsYXRlKCQoXCIjbG9naW4tZm9ybS10ZW1wbGF0ZVwiKS5odG1sKCkpO1xuXHRcdFx0XHQkKFwiI3BhZ2UtY29udGVudCAubWFpbi1jb250ZW50XCIpLmh0bWwodHBsKCkpO1xuXG5cdFx0XHRcdCQoXCIjcGFnZS1jb250ZW50IC5tYWluLWNvbnRlbnQgLmxvZ2luLWZvcm0gZm9ybVwiKS5zdWJtaXQoZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdHZhciByZXF1ZXN0Qm9keSA9IHBhcnNlRm9ybURhdGEoJCh0aGlzKS5zZXJpYWxpemVBcnJheSgpKTtcblxuXHRcdFx0XHRcdGZldGNoKCQodGhpcykuYXR0cihcImFjdGlvblwiKSwge1xuXHRcdFx0XHRcdFx0aGVhZGVyczogd2luZG93LmZldGNoSGVhZGVycyxcblx0XHRcdFx0XHRcdG1ldGhvZDogXCJwb3N0XCIsXG5cdFx0XHRcdFx0XHRib2R5OiBKU09OLnN0cmluZ2lmeShyZXF1ZXN0Qm9keSlcblx0XHRcdFx0XHR9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdFx0XHRcdFx0fSkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRcdGxvY2FsU3RvcmUuc2V0KFwiYWNjZXNzVG9rZW5cIiwgZGF0YS5hY2Nlc3NfdG9rZW4pO1xuXHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLnJlcGxhY2UoXCIvXCIpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRmdW5jdGlvbiBwYXJzZUZvcm1EYXRhKGZvcm1EYXRhKXtcblx0XHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdFx0Xy5lYWNoKGZvcm1EYXRhLCBmdW5jdGlvbihlbCwgaSl7XG5cdFx0XHRcdFx0XHRyZXN1bHRbZWwubmFtZV0gPSBlbC52YWx1ZTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBMb2dvdXQgcm91dGVcblx0XHRcdHRoaXMucm91dGUoXCJsb2dvdXRcIiwgXCJsb2dvdXRcIiwgZnVuY3Rpb24oKXtcblx0XHRcdFx0bG9jYWxTdG9yZS5yZW1vdmUoXCJhY2Nlc3NUb2tlblwiKTtcblx0XHRcdFx0d2luZG93LmxvY2F0aW9uLnJlcGxhY2UoXCIvbG9naW5cIik7XG5cdFx0XHR9KTtcblx0XHR9LCB0aGlzKTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gcm91dGVyOyIsIi8qKlxuICogVGhlIGNvZGUgd2FzIGV4dHJhY3RlZCBmcm9tOlxuICogaHR0cHM6Ly9naXRodWIuY29tL2RhdmlkY2hhbWJlcnMvQmFzZTY0LmpzXG4gKi9cblxudmFyIGNoYXJzID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89JztcblxuZnVuY3Rpb24gSW52YWxpZENoYXJhY3RlckVycm9yKG1lc3NhZ2UpIHtcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbn1cblxuSW52YWxpZENoYXJhY3RlckVycm9yLnByb3RvdHlwZSA9IG5ldyBFcnJvcigpO1xuSW52YWxpZENoYXJhY3RlckVycm9yLnByb3RvdHlwZS5uYW1lID0gJ0ludmFsaWRDaGFyYWN0ZXJFcnJvcic7XG5cbmZ1bmN0aW9uIHBvbHlmaWxsIChpbnB1dCkge1xuICB2YXIgc3RyID0gU3RyaW5nKGlucHV0KS5yZXBsYWNlKC89KyQvLCAnJyk7XG4gIGlmIChzdHIubGVuZ3RoICUgNCA9PSAxKSB7XG4gICAgdGhyb3cgbmV3IEludmFsaWRDaGFyYWN0ZXJFcnJvcihcIidhdG9iJyBmYWlsZWQ6IFRoZSBzdHJpbmcgdG8gYmUgZGVjb2RlZCBpcyBub3QgY29ycmVjdGx5IGVuY29kZWQuXCIpO1xuICB9XG4gIGZvciAoXG4gICAgLy8gaW5pdGlhbGl6ZSByZXN1bHQgYW5kIGNvdW50ZXJzXG4gICAgdmFyIGJjID0gMCwgYnMsIGJ1ZmZlciwgaWR4ID0gMCwgb3V0cHV0ID0gJyc7XG4gICAgLy8gZ2V0IG5leHQgY2hhcmFjdGVyXG4gICAgYnVmZmVyID0gc3RyLmNoYXJBdChpZHgrKyk7XG4gICAgLy8gY2hhcmFjdGVyIGZvdW5kIGluIHRhYmxlPyBpbml0aWFsaXplIGJpdCBzdG9yYWdlIGFuZCBhZGQgaXRzIGFzY2lpIHZhbHVlO1xuICAgIH5idWZmZXIgJiYgKGJzID0gYmMgJSA0ID8gYnMgKiA2NCArIGJ1ZmZlciA6IGJ1ZmZlcixcbiAgICAgIC8vIGFuZCBpZiBub3QgZmlyc3Qgb2YgZWFjaCA0IGNoYXJhY3RlcnMsXG4gICAgICAvLyBjb252ZXJ0IHRoZSBmaXJzdCA4IGJpdHMgdG8gb25lIGFzY2lpIGNoYXJhY3RlclxuICAgICAgYmMrKyAlIDQpID8gb3V0cHV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoMjU1ICYgYnMgPj4gKC0yICogYmMgJiA2KSkgOiAwXG4gICkge1xuICAgIC8vIHRyeSB0byBmaW5kIGNoYXJhY3RlciBpbiB0YWJsZSAoMC02Mywgbm90IGZvdW5kID0+IC0xKVxuICAgIGJ1ZmZlciA9IGNoYXJzLmluZGV4T2YoYnVmZmVyKTtcbiAgfVxuICByZXR1cm4gb3V0cHV0O1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmF0b2IgJiYgd2luZG93LmF0b2IuYmluZCh3aW5kb3cpIHx8IHBvbHlmaWxsO1xuIiwidmFyIGF0b2IgPSByZXF1aXJlKCcuL2F0b2InKTtcblxuZnVuY3Rpb24gYjY0RGVjb2RlVW5pY29kZShzdHIpIHtcbiAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChhdG9iKHN0cikucmVwbGFjZSgvKC4pL2csIGZ1bmN0aW9uIChtLCBwKSB7XG4gICAgdmFyIGNvZGUgPSBwLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XG4gICAgaWYgKGNvZGUubGVuZ3RoIDwgMikge1xuICAgICAgY29kZSA9ICcwJyArIGNvZGU7XG4gICAgfVxuICAgIHJldHVybiAnJScgKyBjb2RlO1xuICB9KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc3RyKSB7XG4gIHZhciBvdXRwdXQgPSBzdHIucmVwbGFjZSgvLS9nLCBcIitcIikucmVwbGFjZSgvXy9nLCBcIi9cIik7XG4gIHN3aXRjaCAob3V0cHV0Lmxlbmd0aCAlIDQpIHtcbiAgICBjYXNlIDA6XG4gICAgICBicmVhaztcbiAgICBjYXNlIDI6XG4gICAgICBvdXRwdXQgKz0gXCI9PVwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAzOlxuICAgICAgb3V0cHV0ICs9IFwiPVwiO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IFwiSWxsZWdhbCBiYXNlNjR1cmwgc3RyaW5nIVwiO1xuICB9XG5cbiAgdHJ5e1xuICAgIHJldHVybiBiNjREZWNvZGVVbmljb2RlKG91dHB1dCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBhdG9iKG91dHB1dCk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlNjRfdXJsX2RlY29kZSA9IHJlcXVpcmUoJy4vYmFzZTY0X3VybF9kZWNvZGUnKTtcblxuZnVuY3Rpb24gSW52YWxpZFRva2VuRXJyb3IobWVzc2FnZSkge1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xufVxuXG5JbnZhbGlkVG9rZW5FcnJvci5wcm90b3R5cGUgPSBuZXcgRXJyb3IoKTtcbkludmFsaWRUb2tlbkVycm9yLnByb3RvdHlwZS5uYW1lID0gJ0ludmFsaWRUb2tlbkVycm9yJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodG9rZW4sb3B0aW9ucykge1xuICBpZiAodHlwZW9mIHRva2VuICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBJbnZhbGlkVG9rZW5FcnJvcignSW52YWxpZCB0b2tlbiBzcGVjaWZpZWQnKTtcbiAgfVxuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICB2YXIgcG9zID0gb3B0aW9ucy5oZWFkZXIgPT09IHRydWUgPyAwIDogMTtcbiAgdHJ5IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShiYXNlNjRfdXJsX2RlY29kZSh0b2tlbi5zcGxpdCgnLicpW3Bvc10pKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRocm93IG5ldyBJbnZhbGlkVG9rZW5FcnJvcignSW52YWxpZCB0b2tlbiBzcGVjaWZpZWQ6ICcgKyBlLm1lc3NhZ2UpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5JbnZhbGlkVG9rZW5FcnJvciA9IEludmFsaWRUb2tlbkVycm9yO1xuIiwidmFyIGVuZ2luZSA9IHJlcXVpcmUoJy4uL3NyYy9zdG9yZS1lbmdpbmUnKVxuXG52YXIgc3RvcmFnZXMgPSByZXF1aXJlKCcuLi9zdG9yYWdlcy9hbGwnKVxudmFyIHBsdWdpbnMgPSBbcmVxdWlyZSgnLi4vcGx1Z2lucy9qc29uMicpXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVuZ2luZS5jcmVhdGVTdG9yZShzdG9yYWdlcywgcGx1Z2lucylcbiIsIm1vZHVsZS5leHBvcnRzID0ganNvbjJQbHVnaW5cblxuZnVuY3Rpb24ganNvbjJQbHVnaW4oKSB7XG5cdHJlcXVpcmUoJy4vbGliL2pzb24yJylcblx0cmV0dXJuIHt9XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4vLyAganNvbjIuanNcbi8vICAyMDE2LTEwLTI4XG4vLyAgUHVibGljIERvbWFpbi5cbi8vICBOTyBXQVJSQU5UWSBFWFBSRVNTRUQgT1IgSU1QTElFRC4gVVNFIEFUIFlPVVIgT1dOIFJJU0suXG4vLyAgU2VlIGh0dHA6Ly93d3cuSlNPTi5vcmcvanMuaHRtbFxuLy8gIFRoaXMgY29kZSBzaG91bGQgYmUgbWluaWZpZWQgYmVmb3JlIGRlcGxveW1lbnQuXG4vLyAgU2VlIGh0dHA6Ly9qYXZhc2NyaXB0LmNyb2NrZm9yZC5jb20vanNtaW4uaHRtbFxuXG4vLyAgVVNFIFlPVVIgT1dOIENPUFkuIElUIElTIEVYVFJFTUVMWSBVTldJU0UgVE8gTE9BRCBDT0RFIEZST00gU0VSVkVSUyBZT1UgRE9cbi8vICBOT1QgQ09OVFJPTC5cblxuLy8gIFRoaXMgZmlsZSBjcmVhdGVzIGEgZ2xvYmFsIEpTT04gb2JqZWN0IGNvbnRhaW5pbmcgdHdvIG1ldGhvZHM6IHN0cmluZ2lmeVxuLy8gIGFuZCBwYXJzZS4gVGhpcyBmaWxlIHByb3ZpZGVzIHRoZSBFUzUgSlNPTiBjYXBhYmlsaXR5IHRvIEVTMyBzeXN0ZW1zLlxuLy8gIElmIGEgcHJvamVjdCBtaWdodCBydW4gb24gSUU4IG9yIGVhcmxpZXIsIHRoZW4gdGhpcyBmaWxlIHNob3VsZCBiZSBpbmNsdWRlZC5cbi8vICBUaGlzIGZpbGUgZG9lcyBub3RoaW5nIG9uIEVTNSBzeXN0ZW1zLlxuXG4vLyAgICAgIEpTT04uc3RyaW5naWZ5KHZhbHVlLCByZXBsYWNlciwgc3BhY2UpXG4vLyAgICAgICAgICB2YWx1ZSAgICAgICBhbnkgSmF2YVNjcmlwdCB2YWx1ZSwgdXN1YWxseSBhbiBvYmplY3Qgb3IgYXJyYXkuXG4vLyAgICAgICAgICByZXBsYWNlciAgICBhbiBvcHRpb25hbCBwYXJhbWV0ZXIgdGhhdCBkZXRlcm1pbmVzIGhvdyBvYmplY3Rcbi8vICAgICAgICAgICAgICAgICAgICAgIHZhbHVlcyBhcmUgc3RyaW5naWZpZWQgZm9yIG9iamVjdHMuIEl0IGNhbiBiZSBhXG4vLyAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBvciBhbiBhcnJheSBvZiBzdHJpbmdzLlxuLy8gICAgICAgICAgc3BhY2UgICAgICAgYW4gb3B0aW9uYWwgcGFyYW1ldGVyIHRoYXQgc3BlY2lmaWVzIHRoZSBpbmRlbnRhdGlvblxuLy8gICAgICAgICAgICAgICAgICAgICAgb2YgbmVzdGVkIHN0cnVjdHVyZXMuIElmIGl0IGlzIG9taXR0ZWQsIHRoZSB0ZXh0IHdpbGxcbi8vICAgICAgICAgICAgICAgICAgICAgIGJlIHBhY2tlZCB3aXRob3V0IGV4dHJhIHdoaXRlc3BhY2UuIElmIGl0IGlzIGEgbnVtYmVyLFxuLy8gICAgICAgICAgICAgICAgICAgICAgaXQgd2lsbCBzcGVjaWZ5IHRoZSBudW1iZXIgb2Ygc3BhY2VzIHRvIGluZGVudCBhdCBlYWNoXG4vLyAgICAgICAgICAgICAgICAgICAgICBsZXZlbC4gSWYgaXQgaXMgYSBzdHJpbmcgKHN1Y2ggYXMgXCJcXHRcIiBvciBcIiZuYnNwO1wiKSxcbi8vICAgICAgICAgICAgICAgICAgICAgIGl0IGNvbnRhaW5zIHRoZSBjaGFyYWN0ZXJzIHVzZWQgdG8gaW5kZW50IGF0IGVhY2ggbGV2ZWwuXG4vLyAgICAgICAgICBUaGlzIG1ldGhvZCBwcm9kdWNlcyBhIEpTT04gdGV4dCBmcm9tIGEgSmF2YVNjcmlwdCB2YWx1ZS5cbi8vICAgICAgICAgIFdoZW4gYW4gb2JqZWN0IHZhbHVlIGlzIGZvdW5kLCBpZiB0aGUgb2JqZWN0IGNvbnRhaW5zIGEgdG9KU09OXG4vLyAgICAgICAgICBtZXRob2QsIGl0cyB0b0pTT04gbWV0aG9kIHdpbGwgYmUgY2FsbGVkIGFuZCB0aGUgcmVzdWx0IHdpbGwgYmVcbi8vICAgICAgICAgIHN0cmluZ2lmaWVkLiBBIHRvSlNPTiBtZXRob2QgZG9lcyBub3Qgc2VyaWFsaXplOiBpdCByZXR1cm5zIHRoZVxuLy8gICAgICAgICAgdmFsdWUgcmVwcmVzZW50ZWQgYnkgdGhlIG5hbWUvdmFsdWUgcGFpciB0aGF0IHNob3VsZCBiZSBzZXJpYWxpemVkLFxuLy8gICAgICAgICAgb3IgdW5kZWZpbmVkIGlmIG5vdGhpbmcgc2hvdWxkIGJlIHNlcmlhbGl6ZWQuIFRoZSB0b0pTT04gbWV0aG9kXG4vLyAgICAgICAgICB3aWxsIGJlIHBhc3NlZCB0aGUga2V5IGFzc29jaWF0ZWQgd2l0aCB0aGUgdmFsdWUsIGFuZCB0aGlzIHdpbGwgYmVcbi8vICAgICAgICAgIGJvdW5kIHRvIHRoZSB2YWx1ZS5cblxuLy8gICAgICAgICAgRm9yIGV4YW1wbGUsIHRoaXMgd291bGQgc2VyaWFsaXplIERhdGVzIGFzIElTTyBzdHJpbmdzLlxuXG4vLyAgICAgICAgICAgICAgRGF0ZS5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKGtleSkge1xuLy8gICAgICAgICAgICAgICAgICBmdW5jdGlvbiBmKG4pIHtcbi8vICAgICAgICAgICAgICAgICAgICAgIC8vIEZvcm1hdCBpbnRlZ2VycyB0byBoYXZlIGF0IGxlYXN0IHR3byBkaWdpdHMuXG4vLyAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKG4gPCAxMClcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiMFwiICsgblxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIDogbjtcbi8vICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRVVENGdWxsWWVhcigpICAgKyBcIi1cIiArXG4vLyAgICAgICAgICAgICAgICAgICAgICAgZih0aGlzLmdldFVUQ01vbnRoKCkgKyAxKSArIFwiLVwiICtcbi8vICAgICAgICAgICAgICAgICAgICAgICBmKHRoaXMuZ2V0VVRDRGF0ZSgpKSAgICAgICsgXCJUXCIgK1xuLy8gICAgICAgICAgICAgICAgICAgICAgIGYodGhpcy5nZXRVVENIb3VycygpKSAgICAgKyBcIjpcIiArXG4vLyAgICAgICAgICAgICAgICAgICAgICAgZih0aGlzLmdldFVUQ01pbnV0ZXMoKSkgICArIFwiOlwiICtcbi8vICAgICAgICAgICAgICAgICAgICAgICBmKHRoaXMuZ2V0VVRDU2Vjb25kcygpKSAgICsgXCJaXCI7XG4vLyAgICAgICAgICAgICAgfTtcblxuLy8gICAgICAgICAgWW91IGNhbiBwcm92aWRlIGFuIG9wdGlvbmFsIHJlcGxhY2VyIG1ldGhvZC4gSXQgd2lsbCBiZSBwYXNzZWQgdGhlXG4vLyAgICAgICAgICBrZXkgYW5kIHZhbHVlIG9mIGVhY2ggbWVtYmVyLCB3aXRoIHRoaXMgYm91bmQgdG8gdGhlIGNvbnRhaW5pbmdcbi8vICAgICAgICAgIG9iamVjdC4gVGhlIHZhbHVlIHRoYXQgaXMgcmV0dXJuZWQgZnJvbSB5b3VyIG1ldGhvZCB3aWxsIGJlXG4vLyAgICAgICAgICBzZXJpYWxpemVkLiBJZiB5b3VyIG1ldGhvZCByZXR1cm5zIHVuZGVmaW5lZCwgdGhlbiB0aGUgbWVtYmVyIHdpbGxcbi8vICAgICAgICAgIGJlIGV4Y2x1ZGVkIGZyb20gdGhlIHNlcmlhbGl6YXRpb24uXG5cbi8vICAgICAgICAgIElmIHRoZSByZXBsYWNlciBwYXJhbWV0ZXIgaXMgYW4gYXJyYXkgb2Ygc3RyaW5ncywgdGhlbiBpdCB3aWxsIGJlXG4vLyAgICAgICAgICB1c2VkIHRvIHNlbGVjdCB0aGUgbWVtYmVycyB0byBiZSBzZXJpYWxpemVkLiBJdCBmaWx0ZXJzIHRoZSByZXN1bHRzXG4vLyAgICAgICAgICBzdWNoIHRoYXQgb25seSBtZW1iZXJzIHdpdGgga2V5cyBsaXN0ZWQgaW4gdGhlIHJlcGxhY2VyIGFycmF5IGFyZVxuLy8gICAgICAgICAgc3RyaW5naWZpZWQuXG5cbi8vICAgICAgICAgIFZhbHVlcyB0aGF0IGRvIG5vdCBoYXZlIEpTT04gcmVwcmVzZW50YXRpb25zLCBzdWNoIGFzIHVuZGVmaW5lZCBvclxuLy8gICAgICAgICAgZnVuY3Rpb25zLCB3aWxsIG5vdCBiZSBzZXJpYWxpemVkLiBTdWNoIHZhbHVlcyBpbiBvYmplY3RzIHdpbGwgYmVcbi8vICAgICAgICAgIGRyb3BwZWQ7IGluIGFycmF5cyB0aGV5IHdpbGwgYmUgcmVwbGFjZWQgd2l0aCBudWxsLiBZb3UgY2FuIHVzZVxuLy8gICAgICAgICAgYSByZXBsYWNlciBmdW5jdGlvbiB0byByZXBsYWNlIHRob3NlIHdpdGggSlNPTiB2YWx1ZXMuXG5cbi8vICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHVuZGVmaW5lZCkgcmV0dXJucyB1bmRlZmluZWQuXG5cbi8vICAgICAgICAgIFRoZSBvcHRpb25hbCBzcGFjZSBwYXJhbWV0ZXIgcHJvZHVjZXMgYSBzdHJpbmdpZmljYXRpb24gb2YgdGhlXG4vLyAgICAgICAgICB2YWx1ZSB0aGF0IGlzIGZpbGxlZCB3aXRoIGxpbmUgYnJlYWtzIGFuZCBpbmRlbnRhdGlvbiB0byBtYWtlIGl0XG4vLyAgICAgICAgICBlYXNpZXIgdG8gcmVhZC5cblxuLy8gICAgICAgICAgSWYgdGhlIHNwYWNlIHBhcmFtZXRlciBpcyBhIG5vbi1lbXB0eSBzdHJpbmcsIHRoZW4gdGhhdCBzdHJpbmcgd2lsbFxuLy8gICAgICAgICAgYmUgdXNlZCBmb3IgaW5kZW50YXRpb24uIElmIHRoZSBzcGFjZSBwYXJhbWV0ZXIgaXMgYSBudW1iZXIsIHRoZW5cbi8vICAgICAgICAgIHRoZSBpbmRlbnRhdGlvbiB3aWxsIGJlIHRoYXQgbWFueSBzcGFjZXMuXG5cbi8vICAgICAgICAgIEV4YW1wbGU6XG5cbi8vICAgICAgICAgIHRleHQgPSBKU09OLnN0cmluZ2lmeShbXCJlXCIsIHtwbHVyaWJ1czogXCJ1bnVtXCJ9XSk7XG4vLyAgICAgICAgICAvLyB0ZXh0IGlzICdbXCJlXCIse1wicGx1cmlidXNcIjpcInVudW1cIn1dJ1xuXG4vLyAgICAgICAgICB0ZXh0ID0gSlNPTi5zdHJpbmdpZnkoW1wiZVwiLCB7cGx1cmlidXM6IFwidW51bVwifV0sIG51bGwsIFwiXFx0XCIpO1xuLy8gICAgICAgICAgLy8gdGV4dCBpcyAnW1xcblxcdFwiZVwiLFxcblxcdHtcXG5cXHRcXHRcInBsdXJpYnVzXCI6IFwidW51bVwiXFxuXFx0fVxcbl0nXG5cbi8vICAgICAgICAgIHRleHQgPSBKU09OLnN0cmluZ2lmeShbbmV3IERhdGUoKV0sIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4vLyAgICAgICAgICAgICAgcmV0dXJuIHRoaXNba2V5XSBpbnN0YW5jZW9mIERhdGVcbi8vICAgICAgICAgICAgICAgICAgPyBcIkRhdGUoXCIgKyB0aGlzW2tleV0gKyBcIilcIlxuLy8gICAgICAgICAgICAgICAgICA6IHZhbHVlO1xuLy8gICAgICAgICAgfSk7XG4vLyAgICAgICAgICAvLyB0ZXh0IGlzICdbXCJEYXRlKC0tLWN1cnJlbnQgdGltZS0tLSlcIl0nXG5cbi8vICAgICAgSlNPTi5wYXJzZSh0ZXh0LCByZXZpdmVyKVxuLy8gICAgICAgICAgVGhpcyBtZXRob2QgcGFyc2VzIGEgSlNPTiB0ZXh0IHRvIHByb2R1Y2UgYW4gb2JqZWN0IG9yIGFycmF5LlxuLy8gICAgICAgICAgSXQgY2FuIHRocm93IGEgU3ludGF4RXJyb3IgZXhjZXB0aW9uLlxuXG4vLyAgICAgICAgICBUaGUgb3B0aW9uYWwgcmV2aXZlciBwYXJhbWV0ZXIgaXMgYSBmdW5jdGlvbiB0aGF0IGNhbiBmaWx0ZXIgYW5kXG4vLyAgICAgICAgICB0cmFuc2Zvcm0gdGhlIHJlc3VsdHMuIEl0IHJlY2VpdmVzIGVhY2ggb2YgdGhlIGtleXMgYW5kIHZhbHVlcyxcbi8vICAgICAgICAgIGFuZCBpdHMgcmV0dXJuIHZhbHVlIGlzIHVzZWQgaW5zdGVhZCBvZiB0aGUgb3JpZ2luYWwgdmFsdWUuXG4vLyAgICAgICAgICBJZiBpdCByZXR1cm5zIHdoYXQgaXQgcmVjZWl2ZWQsIHRoZW4gdGhlIHN0cnVjdHVyZSBpcyBub3QgbW9kaWZpZWQuXG4vLyAgICAgICAgICBJZiBpdCByZXR1cm5zIHVuZGVmaW5lZCB0aGVuIHRoZSBtZW1iZXIgaXMgZGVsZXRlZC5cblxuLy8gICAgICAgICAgRXhhbXBsZTpcblxuLy8gICAgICAgICAgLy8gUGFyc2UgdGhlIHRleHQuIFZhbHVlcyB0aGF0IGxvb2sgbGlrZSBJU08gZGF0ZSBzdHJpbmdzIHdpbGxcbi8vICAgICAgICAgIC8vIGJlIGNvbnZlcnRlZCB0byBEYXRlIG9iamVjdHMuXG5cbi8vICAgICAgICAgIG15RGF0YSA9IEpTT04ucGFyc2UodGV4dCwgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbi8vICAgICAgICAgICAgICB2YXIgYTtcbi8vICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSB7XG4vLyAgICAgICAgICAgICAgICAgIGEgPVxuLy8gICAvXihcXGR7NH0pLShcXGR7Mn0pLShcXGR7Mn0pVChcXGR7Mn0pOihcXGR7Mn0pOihcXGR7Mn0oPzpcXC5cXGQqKT8pWiQvLmV4ZWModmFsdWUpO1xuLy8gICAgICAgICAgICAgICAgICBpZiAoYSkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKCthWzFdLCArYVsyXSAtIDEsICthWzNdLCArYVs0XSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICArYVs1XSwgK2FbNl0pKTtcbi8vICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4vLyAgICAgICAgICB9KTtcblxuLy8gICAgICAgICAgbXlEYXRhID0gSlNPTi5wYXJzZSgnW1wiRGF0ZSgwOS8wOS8yMDAxKVwiXScsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4vLyAgICAgICAgICAgICAgdmFyIGQ7XG4vLyAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJlxuLy8gICAgICAgICAgICAgICAgICAgICAgdmFsdWUuc2xpY2UoMCwgNSkgPT09IFwiRGF0ZShcIiAmJlxuLy8gICAgICAgICAgICAgICAgICAgICAgdmFsdWUuc2xpY2UoLTEpID09PSBcIilcIikge1xuLy8gICAgICAgICAgICAgICAgICBkID0gbmV3IERhdGUodmFsdWUuc2xpY2UoNSwgLTEpKTtcbi8vICAgICAgICAgICAgICAgICAgaWYgKGQpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkO1xuLy8gICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbi8vICAgICAgICAgIH0pO1xuXG4vLyAgVGhpcyBpcyBhIHJlZmVyZW5jZSBpbXBsZW1lbnRhdGlvbi4gWW91IGFyZSBmcmVlIHRvIGNvcHksIG1vZGlmeSwgb3Jcbi8vICByZWRpc3RyaWJ1dGUuXG5cbi8qanNsaW50XG4gICAgZXZhbCwgZm9yLCB0aGlzXG4qL1xuXG4vKnByb3BlcnR5XG4gICAgSlNPTiwgYXBwbHksIGNhbGwsIGNoYXJDb2RlQXQsIGdldFVUQ0RhdGUsIGdldFVUQ0Z1bGxZZWFyLCBnZXRVVENIb3VycyxcbiAgICBnZXRVVENNaW51dGVzLCBnZXRVVENNb250aCwgZ2V0VVRDU2Vjb25kcywgaGFzT3duUHJvcGVydHksIGpvaW4sXG4gICAgbGFzdEluZGV4LCBsZW5ndGgsIHBhcnNlLCBwcm90b3R5cGUsIHB1c2gsIHJlcGxhY2UsIHNsaWNlLCBzdHJpbmdpZnksXG4gICAgdGVzdCwgdG9KU09OLCB0b1N0cmluZywgdmFsdWVPZlxuKi9cblxuXG4vLyBDcmVhdGUgYSBKU09OIG9iamVjdCBvbmx5IGlmIG9uZSBkb2VzIG5vdCBhbHJlYWR5IGV4aXN0LiBXZSBjcmVhdGUgdGhlXG4vLyBtZXRob2RzIGluIGEgY2xvc3VyZSB0byBhdm9pZCBjcmVhdGluZyBnbG9iYWwgdmFyaWFibGVzLlxuXG5pZiAodHlwZW9mIEpTT04gIT09IFwib2JqZWN0XCIpIHtcbiAgICBKU09OID0ge307XG59XG5cbihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgcnhfb25lID0gL15bXFxdLDp7fVxcc10qJC87XG4gICAgdmFyIHJ4X3R3byA9IC9cXFxcKD86W1wiXFxcXFxcL2JmbnJ0XXx1WzAtOWEtZkEtRl17NH0pL2c7XG4gICAgdmFyIHJ4X3RocmVlID0gL1wiW15cIlxcXFxcXG5cXHJdKlwifHRydWV8ZmFsc2V8bnVsbHwtP1xcZCsoPzpcXC5cXGQqKT8oPzpbZUVdWytcXC1dP1xcZCspPy9nO1xuICAgIHZhciByeF9mb3VyID0gLyg/Ol58OnwsKSg/OlxccypcXFspKy9nO1xuICAgIHZhciByeF9lc2NhcGFibGUgPSAvW1xcXFxcIlxcdTAwMDAtXFx1MDAxZlxcdTAwN2YtXFx1MDA5ZlxcdTAwYWRcXHUwNjAwLVxcdTA2MDRcXHUwNzBmXFx1MTdiNFxcdTE3YjVcXHUyMDBjLVxcdTIwMGZcXHUyMDI4LVxcdTIwMmZcXHUyMDYwLVxcdTIwNmZcXHVmZWZmXFx1ZmZmMC1cXHVmZmZmXS9nO1xuICAgIHZhciByeF9kYW5nZXJvdXMgPSAvW1xcdTAwMDBcXHUwMGFkXFx1MDYwMC1cXHUwNjA0XFx1MDcwZlxcdTE3YjRcXHUxN2I1XFx1MjAwYy1cXHUyMDBmXFx1MjAyOC1cXHUyMDJmXFx1MjA2MC1cXHUyMDZmXFx1ZmVmZlxcdWZmZjAtXFx1ZmZmZl0vZztcblxuICAgIGZ1bmN0aW9uIGYobikge1xuICAgICAgICAvLyBGb3JtYXQgaW50ZWdlcnMgdG8gaGF2ZSBhdCBsZWFzdCB0d28gZGlnaXRzLlxuICAgICAgICByZXR1cm4gbiA8IDEwXG4gICAgICAgICAgICA/IFwiMFwiICsgblxuICAgICAgICAgICAgOiBuO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRoaXNfdmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlT2YoKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIERhdGUucHJvdG90eXBlLnRvSlNPTiAhPT0gXCJmdW5jdGlvblwiKSB7XG5cbiAgICAgICAgRGF0ZS5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICByZXR1cm4gaXNGaW5pdGUodGhpcy52YWx1ZU9mKCkpXG4gICAgICAgICAgICAgICAgPyB0aGlzLmdldFVUQ0Z1bGxZZWFyKCkgKyBcIi1cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICBmKHRoaXMuZ2V0VVRDTW9udGgoKSArIDEpICsgXCItXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgZih0aGlzLmdldFVUQ0RhdGUoKSkgKyBcIlRcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICBmKHRoaXMuZ2V0VVRDSG91cnMoKSkgKyBcIjpcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICBmKHRoaXMuZ2V0VVRDTWludXRlcygpKSArIFwiOlwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGYodGhpcy5nZXRVVENTZWNvbmRzKCkpICsgXCJaXCJcbiAgICAgICAgICAgICAgICA6IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgQm9vbGVhbi5wcm90b3R5cGUudG9KU09OID0gdGhpc192YWx1ZTtcbiAgICAgICAgTnVtYmVyLnByb3RvdHlwZS50b0pTT04gPSB0aGlzX3ZhbHVlO1xuICAgICAgICBTdHJpbmcucHJvdG90eXBlLnRvSlNPTiA9IHRoaXNfdmFsdWU7XG4gICAgfVxuXG4gICAgdmFyIGdhcDtcbiAgICB2YXIgaW5kZW50O1xuICAgIHZhciBtZXRhO1xuICAgIHZhciByZXA7XG5cblxuICAgIGZ1bmN0aW9uIHF1b3RlKHN0cmluZykge1xuXG4vLyBJZiB0aGUgc3RyaW5nIGNvbnRhaW5zIG5vIGNvbnRyb2wgY2hhcmFjdGVycywgbm8gcXVvdGUgY2hhcmFjdGVycywgYW5kIG5vXG4vLyBiYWNrc2xhc2ggY2hhcmFjdGVycywgdGhlbiB3ZSBjYW4gc2FmZWx5IHNsYXAgc29tZSBxdW90ZXMgYXJvdW5kIGl0LlxuLy8gT3RoZXJ3aXNlIHdlIG11c3QgYWxzbyByZXBsYWNlIHRoZSBvZmZlbmRpbmcgY2hhcmFjdGVycyB3aXRoIHNhZmUgZXNjYXBlXG4vLyBzZXF1ZW5jZXMuXG5cbiAgICAgICAgcnhfZXNjYXBhYmxlLmxhc3RJbmRleCA9IDA7XG4gICAgICAgIHJldHVybiByeF9lc2NhcGFibGUudGVzdChzdHJpbmcpXG4gICAgICAgICAgICA/IFwiXFxcIlwiICsgc3RyaW5nLnJlcGxhY2UocnhfZXNjYXBhYmxlLCBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgIHZhciBjID0gbWV0YVthXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIGMgPT09IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgPyBjXG4gICAgICAgICAgICAgICAgICAgIDogXCJcXFxcdVwiICsgKFwiMDAwMFwiICsgYS5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTQpO1xuICAgICAgICAgICAgfSkgKyBcIlxcXCJcIlxuICAgICAgICAgICAgOiBcIlxcXCJcIiArIHN0cmluZyArIFwiXFxcIlwiO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gc3RyKGtleSwgaG9sZGVyKSB7XG5cbi8vIFByb2R1Y2UgYSBzdHJpbmcgZnJvbSBob2xkZXJba2V5XS5cblxuICAgICAgICB2YXIgaTsgICAgICAgICAgLy8gVGhlIGxvb3AgY291bnRlci5cbiAgICAgICAgdmFyIGs7ICAgICAgICAgIC8vIFRoZSBtZW1iZXIga2V5LlxuICAgICAgICB2YXIgdjsgICAgICAgICAgLy8gVGhlIG1lbWJlciB2YWx1ZS5cbiAgICAgICAgdmFyIGxlbmd0aDtcbiAgICAgICAgdmFyIG1pbmQgPSBnYXA7XG4gICAgICAgIHZhciBwYXJ0aWFsO1xuICAgICAgICB2YXIgdmFsdWUgPSBob2xkZXJba2V5XTtcblxuLy8gSWYgdGhlIHZhbHVlIGhhcyBhIHRvSlNPTiBtZXRob2QsIGNhbGwgaXQgdG8gb2J0YWluIGEgcmVwbGFjZW1lbnQgdmFsdWUuXG5cbiAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiB2YWx1ZS50b0pTT04gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0pTT04oa2V5KTtcbiAgICAgICAgfVxuXG4vLyBJZiB3ZSB3ZXJlIGNhbGxlZCB3aXRoIGEgcmVwbGFjZXIgZnVuY3Rpb24sIHRoZW4gY2FsbCB0aGUgcmVwbGFjZXIgdG9cbi8vIG9idGFpbiBhIHJlcGxhY2VtZW50IHZhbHVlLlxuXG4gICAgICAgIGlmICh0eXBlb2YgcmVwID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHZhbHVlID0gcmVwLmNhbGwoaG9sZGVyLCBrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuXG4vLyBXaGF0IGhhcHBlbnMgbmV4dCBkZXBlbmRzIG9uIHRoZSB2YWx1ZSdzIHR5cGUuXG5cbiAgICAgICAgc3dpdGNoICh0eXBlb2YgdmFsdWUpIHtcbiAgICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgICAgICAgcmV0dXJuIHF1b3RlKHZhbHVlKTtcblxuICAgICAgICBjYXNlIFwibnVtYmVyXCI6XG5cbi8vIEpTT04gbnVtYmVycyBtdXN0IGJlIGZpbml0ZS4gRW5jb2RlIG5vbi1maW5pdGUgbnVtYmVycyBhcyBudWxsLlxuXG4gICAgICAgICAgICByZXR1cm4gaXNGaW5pdGUodmFsdWUpXG4gICAgICAgICAgICAgICAgPyBTdHJpbmcodmFsdWUpXG4gICAgICAgICAgICAgICAgOiBcIm51bGxcIjtcblxuICAgICAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgICAgICBjYXNlIFwibnVsbFwiOlxuXG4vLyBJZiB0aGUgdmFsdWUgaXMgYSBib29sZWFuIG9yIG51bGwsIGNvbnZlcnQgaXQgdG8gYSBzdHJpbmcuIE5vdGU6XG4vLyB0eXBlb2YgbnVsbCBkb2VzIG5vdCBwcm9kdWNlIFwibnVsbFwiLiBUaGUgY2FzZSBpcyBpbmNsdWRlZCBoZXJlIGluXG4vLyB0aGUgcmVtb3RlIGNoYW5jZSB0aGF0IHRoaXMgZ2V0cyBmaXhlZCBzb21lZGF5LlxuXG4gICAgICAgICAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcblxuLy8gSWYgdGhlIHR5cGUgaXMgXCJvYmplY3RcIiwgd2UgbWlnaHQgYmUgZGVhbGluZyB3aXRoIGFuIG9iamVjdCBvciBhbiBhcnJheSBvclxuLy8gbnVsbC5cblxuICAgICAgICBjYXNlIFwib2JqZWN0XCI6XG5cbi8vIER1ZSB0byBhIHNwZWNpZmljYXRpb24gYmx1bmRlciBpbiBFQ01BU2NyaXB0LCB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLFxuLy8gc28gd2F0Y2ggb3V0IGZvciB0aGF0IGNhc2UuXG5cbiAgICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJudWxsXCI7XG4gICAgICAgICAgICB9XG5cbi8vIE1ha2UgYW4gYXJyYXkgdG8gaG9sZCB0aGUgcGFydGlhbCByZXN1bHRzIG9mIHN0cmluZ2lmeWluZyB0aGlzIG9iamVjdCB2YWx1ZS5cblxuICAgICAgICAgICAgZ2FwICs9IGluZGVudDtcbiAgICAgICAgICAgIHBhcnRpYWwgPSBbXTtcblxuLy8gSXMgdGhlIHZhbHVlIGFuIGFycmF5P1xuXG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5hcHBseSh2YWx1ZSkgPT09IFwiW29iamVjdCBBcnJheV1cIikge1xuXG4vLyBUaGUgdmFsdWUgaXMgYW4gYXJyYXkuIFN0cmluZ2lmeSBldmVyeSBlbGVtZW50LiBVc2UgbnVsbCBhcyBhIHBsYWNlaG9sZGVyXG4vLyBmb3Igbm9uLUpTT04gdmFsdWVzLlxuXG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBwYXJ0aWFsW2ldID0gc3RyKGksIHZhbHVlKSB8fCBcIm51bGxcIjtcbiAgICAgICAgICAgICAgICB9XG5cbi8vIEpvaW4gYWxsIG9mIHRoZSBlbGVtZW50cyB0b2dldGhlciwgc2VwYXJhdGVkIHdpdGggY29tbWFzLCBhbmQgd3JhcCB0aGVtIGluXG4vLyBicmFja2V0cy5cblxuICAgICAgICAgICAgICAgIHYgPSBwYXJ0aWFsLmxlbmd0aCA9PT0gMFxuICAgICAgICAgICAgICAgICAgICA/IFwiW11cIlxuICAgICAgICAgICAgICAgICAgICA6IGdhcFxuICAgICAgICAgICAgICAgICAgICAgICAgPyBcIltcXG5cIiArIGdhcCArIHBhcnRpYWwuam9pbihcIixcXG5cIiArIGdhcCkgKyBcIlxcblwiICsgbWluZCArIFwiXVwiXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFwiW1wiICsgcGFydGlhbC5qb2luKFwiLFwiKSArIFwiXVwiO1xuICAgICAgICAgICAgICAgIGdhcCA9IG1pbmQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHY7XG4gICAgICAgICAgICB9XG5cbi8vIElmIHRoZSByZXBsYWNlciBpcyBhbiBhcnJheSwgdXNlIGl0IHRvIHNlbGVjdCB0aGUgbWVtYmVycyB0byBiZSBzdHJpbmdpZmllZC5cblxuICAgICAgICAgICAgaWYgKHJlcCAmJiB0eXBlb2YgcmVwID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gcmVwLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZXBbaV0gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGsgPSByZXBbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICB2ID0gc3RyKGssIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydGlhbC5wdXNoKHF1b3RlKGspICsgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCI6IFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiOlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSArIHYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcblxuLy8gT3RoZXJ3aXNlLCBpdGVyYXRlIHRocm91Z2ggYWxsIG9mIHRoZSBrZXlzIGluIHRoZSBvYmplY3QuXG5cbiAgICAgICAgICAgICAgICBmb3IgKGsgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgaykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHYgPSBzdHIoaywgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWFsLnB1c2gocXVvdGUoaykgKyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcIjogXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCI6XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApICsgdik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbi8vIEpvaW4gYWxsIG9mIHRoZSBtZW1iZXIgdGV4dHMgdG9nZXRoZXIsIHNlcGFyYXRlZCB3aXRoIGNvbW1hcyxcbi8vIGFuZCB3cmFwIHRoZW0gaW4gYnJhY2VzLlxuXG4gICAgICAgICAgICB2ID0gcGFydGlhbC5sZW5ndGggPT09IDBcbiAgICAgICAgICAgICAgICA/IFwie31cIlxuICAgICAgICAgICAgICAgIDogZ2FwXG4gICAgICAgICAgICAgICAgICAgID8gXCJ7XFxuXCIgKyBnYXAgKyBwYXJ0aWFsLmpvaW4oXCIsXFxuXCIgKyBnYXApICsgXCJcXG5cIiArIG1pbmQgKyBcIn1cIlxuICAgICAgICAgICAgICAgICAgICA6IFwie1wiICsgcGFydGlhbC5qb2luKFwiLFwiKSArIFwifVwiO1xuICAgICAgICAgICAgZ2FwID0gbWluZDtcbiAgICAgICAgICAgIHJldHVybiB2O1xuICAgICAgICB9XG4gICAgfVxuXG4vLyBJZiB0aGUgSlNPTiBvYmplY3QgZG9lcyBub3QgeWV0IGhhdmUgYSBzdHJpbmdpZnkgbWV0aG9kLCBnaXZlIGl0IG9uZS5cblxuICAgIGlmICh0eXBlb2YgSlNPTi5zdHJpbmdpZnkgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBtZXRhID0geyAgICAvLyB0YWJsZSBvZiBjaGFyYWN0ZXIgc3Vic3RpdHV0aW9uc1xuICAgICAgICAgICAgXCJcXGJcIjogXCJcXFxcYlwiLFxuICAgICAgICAgICAgXCJcXHRcIjogXCJcXFxcdFwiLFxuICAgICAgICAgICAgXCJcXG5cIjogXCJcXFxcblwiLFxuICAgICAgICAgICAgXCJcXGZcIjogXCJcXFxcZlwiLFxuICAgICAgICAgICAgXCJcXHJcIjogXCJcXFxcclwiLFxuICAgICAgICAgICAgXCJcXFwiXCI6IFwiXFxcXFxcXCJcIixcbiAgICAgICAgICAgIFwiXFxcXFwiOiBcIlxcXFxcXFxcXCJcbiAgICAgICAgfTtcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkgPSBmdW5jdGlvbiAodmFsdWUsIHJlcGxhY2VyLCBzcGFjZSkge1xuXG4vLyBUaGUgc3RyaW5naWZ5IG1ldGhvZCB0YWtlcyBhIHZhbHVlIGFuZCBhbiBvcHRpb25hbCByZXBsYWNlciwgYW5kIGFuIG9wdGlvbmFsXG4vLyBzcGFjZSBwYXJhbWV0ZXIsIGFuZCByZXR1cm5zIGEgSlNPTiB0ZXh0LiBUaGUgcmVwbGFjZXIgY2FuIGJlIGEgZnVuY3Rpb25cbi8vIHRoYXQgY2FuIHJlcGxhY2UgdmFsdWVzLCBvciBhbiBhcnJheSBvZiBzdHJpbmdzIHRoYXQgd2lsbCBzZWxlY3QgdGhlIGtleXMuXG4vLyBBIGRlZmF1bHQgcmVwbGFjZXIgbWV0aG9kIGNhbiBiZSBwcm92aWRlZC4gVXNlIG9mIHRoZSBzcGFjZSBwYXJhbWV0ZXIgY2FuXG4vLyBwcm9kdWNlIHRleHQgdGhhdCBpcyBtb3JlIGVhc2lseSByZWFkYWJsZS5cblxuICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICBnYXAgPSBcIlwiO1xuICAgICAgICAgICAgaW5kZW50ID0gXCJcIjtcblxuLy8gSWYgdGhlIHNwYWNlIHBhcmFtZXRlciBpcyBhIG51bWJlciwgbWFrZSBhbiBpbmRlbnQgc3RyaW5nIGNvbnRhaW5pbmcgdGhhdFxuLy8gbWFueSBzcGFjZXMuXG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc3BhY2UgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc3BhY2U7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpbmRlbnQgKz0gXCIgXCI7XG4gICAgICAgICAgICAgICAgfVxuXG4vLyBJZiB0aGUgc3BhY2UgcGFyYW1ldGVyIGlzIGEgc3RyaW5nLCBpdCB3aWxsIGJlIHVzZWQgYXMgdGhlIGluZGVudCBzdHJpbmcuXG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHNwYWNlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgaW5kZW50ID0gc3BhY2U7XG4gICAgICAgICAgICB9XG5cbi8vIElmIHRoZXJlIGlzIGEgcmVwbGFjZXIsIGl0IG11c3QgYmUgYSBmdW5jdGlvbiBvciBhbiBhcnJheS5cbi8vIE90aGVyd2lzZSwgdGhyb3cgYW4gZXJyb3IuXG5cbiAgICAgICAgICAgIHJlcCA9IHJlcGxhY2VyO1xuICAgICAgICAgICAgaWYgKHJlcGxhY2VyICYmIHR5cGVvZiByZXBsYWNlciAhPT0gXCJmdW5jdGlvblwiICYmXG4gICAgICAgICAgICAgICAgICAgICh0eXBlb2YgcmVwbGFjZXIgIT09IFwib2JqZWN0XCIgfHxcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHJlcGxhY2VyLmxlbmd0aCAhPT0gXCJudW1iZXJcIikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJKU09OLnN0cmluZ2lmeVwiKTtcbiAgICAgICAgICAgIH1cblxuLy8gTWFrZSBhIGZha2Ugcm9vdCBvYmplY3QgY29udGFpbmluZyBvdXIgdmFsdWUgdW5kZXIgdGhlIGtleSBvZiBcIlwiLlxuLy8gUmV0dXJuIHRoZSByZXN1bHQgb2Ygc3RyaW5naWZ5aW5nIHRoZSB2YWx1ZS5cblxuICAgICAgICAgICAgcmV0dXJuIHN0cihcIlwiLCB7XCJcIjogdmFsdWV9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cblxuLy8gSWYgdGhlIEpTT04gb2JqZWN0IGRvZXMgbm90IHlldCBoYXZlIGEgcGFyc2UgbWV0aG9kLCBnaXZlIGl0IG9uZS5cblxuICAgIGlmICh0eXBlb2YgSlNPTi5wYXJzZSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIEpTT04ucGFyc2UgPSBmdW5jdGlvbiAodGV4dCwgcmV2aXZlcikge1xuXG4vLyBUaGUgcGFyc2UgbWV0aG9kIHRha2VzIGEgdGV4dCBhbmQgYW4gb3B0aW9uYWwgcmV2aXZlciBmdW5jdGlvbiwgYW5kIHJldHVybnNcbi8vIGEgSmF2YVNjcmlwdCB2YWx1ZSBpZiB0aGUgdGV4dCBpcyBhIHZhbGlkIEpTT04gdGV4dC5cblxuICAgICAgICAgICAgdmFyIGo7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHdhbGsoaG9sZGVyLCBrZXkpIHtcblxuLy8gVGhlIHdhbGsgbWV0aG9kIGlzIHVzZWQgdG8gcmVjdXJzaXZlbHkgd2FsayB0aGUgcmVzdWx0aW5nIHN0cnVjdHVyZSBzb1xuLy8gdGhhdCBtb2RpZmljYXRpb25zIGNhbiBiZSBtYWRlLlxuXG4gICAgICAgICAgICAgICAgdmFyIGs7XG4gICAgICAgICAgICAgICAgdmFyIHY7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gaG9sZGVyW2tleV07XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGsgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGspKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdiA9IHdhbGsodmFsdWUsIGspO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVba10gPSB2O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB2YWx1ZVtrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldml2ZXIuY2FsbChob2xkZXIsIGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuXG5cbi8vIFBhcnNpbmcgaGFwcGVucyBpbiBmb3VyIHN0YWdlcy4gSW4gdGhlIGZpcnN0IHN0YWdlLCB3ZSByZXBsYWNlIGNlcnRhaW5cbi8vIFVuaWNvZGUgY2hhcmFjdGVycyB3aXRoIGVzY2FwZSBzZXF1ZW5jZXMuIEphdmFTY3JpcHQgaGFuZGxlcyBtYW55IGNoYXJhY3RlcnNcbi8vIGluY29ycmVjdGx5LCBlaXRoZXIgc2lsZW50bHkgZGVsZXRpbmcgdGhlbSwgb3IgdHJlYXRpbmcgdGhlbSBhcyBsaW5lIGVuZGluZ3MuXG5cbiAgICAgICAgICAgIHRleHQgPSBTdHJpbmcodGV4dCk7XG4gICAgICAgICAgICByeF9kYW5nZXJvdXMubGFzdEluZGV4ID0gMDtcbiAgICAgICAgICAgIGlmIChyeF9kYW5nZXJvdXMudGVzdCh0ZXh0KSkge1xuICAgICAgICAgICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UocnhfZGFuZ2Vyb3VzLCBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcXFxcdVwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoXCIwMDAwXCIgKyBhLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtNCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbi8vIEluIHRoZSBzZWNvbmQgc3RhZ2UsIHdlIHJ1biB0aGUgdGV4dCBhZ2FpbnN0IHJlZ3VsYXIgZXhwcmVzc2lvbnMgdGhhdCBsb29rXG4vLyBmb3Igbm9uLUpTT04gcGF0dGVybnMuIFdlIGFyZSBlc3BlY2lhbGx5IGNvbmNlcm5lZCB3aXRoIFwiKClcIiBhbmQgXCJuZXdcIlxuLy8gYmVjYXVzZSB0aGV5IGNhbiBjYXVzZSBpbnZvY2F0aW9uLCBhbmQgXCI9XCIgYmVjYXVzZSBpdCBjYW4gY2F1c2UgbXV0YXRpb24uXG4vLyBCdXQganVzdCB0byBiZSBzYWZlLCB3ZSB3YW50IHRvIHJlamVjdCBhbGwgdW5leHBlY3RlZCBmb3Jtcy5cblxuLy8gV2Ugc3BsaXQgdGhlIHNlY29uZCBzdGFnZSBpbnRvIDQgcmVnZXhwIG9wZXJhdGlvbnMgaW4gb3JkZXIgdG8gd29yayBhcm91bmRcbi8vIGNyaXBwbGluZyBpbmVmZmljaWVuY2llcyBpbiBJRSdzIGFuZCBTYWZhcmkncyByZWdleHAgZW5naW5lcy4gRmlyc3Qgd2Vcbi8vIHJlcGxhY2UgdGhlIEpTT04gYmFja3NsYXNoIHBhaXJzIHdpdGggXCJAXCIgKGEgbm9uLUpTT04gY2hhcmFjdGVyKS4gU2Vjb25kLCB3ZVxuLy8gcmVwbGFjZSBhbGwgc2ltcGxlIHZhbHVlIHRva2VucyB3aXRoIFwiXVwiIGNoYXJhY3RlcnMuIFRoaXJkLCB3ZSBkZWxldGUgYWxsXG4vLyBvcGVuIGJyYWNrZXRzIHRoYXQgZm9sbG93IGEgY29sb24gb3IgY29tbWEgb3IgdGhhdCBiZWdpbiB0aGUgdGV4dC4gRmluYWxseSxcbi8vIHdlIGxvb2sgdG8gc2VlIHRoYXQgdGhlIHJlbWFpbmluZyBjaGFyYWN0ZXJzIGFyZSBvbmx5IHdoaXRlc3BhY2Ugb3IgXCJdXCIgb3Jcbi8vIFwiLFwiIG9yIFwiOlwiIG9yIFwie1wiIG9yIFwifVwiLiBJZiB0aGF0IGlzIHNvLCB0aGVuIHRoZSB0ZXh0IGlzIHNhZmUgZm9yIGV2YWwuXG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICByeF9vbmUudGVzdChcbiAgICAgICAgICAgICAgICAgICAgdGV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UocnhfdHdvLCBcIkBcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKHJ4X3RocmVlLCBcIl1cIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKHJ4X2ZvdXIsIFwiXCIpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSB7XG5cbi8vIEluIHRoZSB0aGlyZCBzdGFnZSB3ZSB1c2UgdGhlIGV2YWwgZnVuY3Rpb24gdG8gY29tcGlsZSB0aGUgdGV4dCBpbnRvIGFcbi8vIEphdmFTY3JpcHQgc3RydWN0dXJlLiBUaGUgXCJ7XCIgb3BlcmF0b3IgaXMgc3ViamVjdCB0byBhIHN5bnRhY3RpYyBhbWJpZ3VpdHlcbi8vIGluIEphdmFTY3JpcHQ6IGl0IGNhbiBiZWdpbiBhIGJsb2NrIG9yIGFuIG9iamVjdCBsaXRlcmFsLiBXZSB3cmFwIHRoZSB0ZXh0XG4vLyBpbiBwYXJlbnMgdG8gZWxpbWluYXRlIHRoZSBhbWJpZ3VpdHkuXG5cbiAgICAgICAgICAgICAgICBqID0gZXZhbChcIihcIiArIHRleHQgKyBcIilcIik7XG5cbi8vIEluIHRoZSBvcHRpb25hbCBmb3VydGggc3RhZ2UsIHdlIHJlY3Vyc2l2ZWx5IHdhbGsgdGhlIG5ldyBzdHJ1Y3R1cmUsIHBhc3Npbmdcbi8vIGVhY2ggbmFtZS92YWx1ZSBwYWlyIHRvIGEgcmV2aXZlciBmdW5jdGlvbiBmb3IgcG9zc2libGUgdHJhbnNmb3JtYXRpb24uXG5cbiAgICAgICAgICAgICAgICByZXR1cm4gKHR5cGVvZiByZXZpdmVyID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICAgICAgICAgID8gd2Fsayh7XCJcIjogan0sIFwiXCIpXG4gICAgICAgICAgICAgICAgICAgIDogajtcbiAgICAgICAgICAgIH1cblxuLy8gSWYgdGhlIHRleHQgaXMgbm90IEpTT04gcGFyc2VhYmxlLCB0aGVuIGEgU3ludGF4RXJyb3IgaXMgdGhyb3duLlxuXG4gICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJKU09OLnBhcnNlXCIpO1xuICAgICAgICB9O1xuICAgIH1cbn0oKSk7IiwidmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKVxudmFyIHNsaWNlID0gdXRpbC5zbGljZVxudmFyIHBsdWNrID0gdXRpbC5wbHVja1xudmFyIGVhY2ggPSB1dGlsLmVhY2hcbnZhciBiaW5kID0gdXRpbC5iaW5kXG52YXIgY3JlYXRlID0gdXRpbC5jcmVhdGVcbnZhciBpc0xpc3QgPSB1dGlsLmlzTGlzdFxudmFyIGlzRnVuY3Rpb24gPSB1dGlsLmlzRnVuY3Rpb25cbnZhciBpc09iamVjdCA9IHV0aWwuaXNPYmplY3RcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGNyZWF0ZVN0b3JlOiBjcmVhdGVTdG9yZVxufVxuXG52YXIgc3RvcmVBUEkgPSB7XG5cdHZlcnNpb246ICcyLjAuMTInLFxuXHRlbmFibGVkOiBmYWxzZSxcblx0XG5cdC8vIGdldCByZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGUgZ2l2ZW4ga2V5LiBJZiB0aGF0IHZhbHVlXG5cdC8vIGlzIHVuZGVmaW5lZCwgaXQgcmV0dXJucyBvcHRpb25hbERlZmF1bHRWYWx1ZSBpbnN0ZWFkLlxuXHRnZXQ6IGZ1bmN0aW9uKGtleSwgb3B0aW9uYWxEZWZhdWx0VmFsdWUpIHtcblx0XHR2YXIgZGF0YSA9IHRoaXMuc3RvcmFnZS5yZWFkKHRoaXMuX25hbWVzcGFjZVByZWZpeCArIGtleSlcblx0XHRyZXR1cm4gdGhpcy5fZGVzZXJpYWxpemUoZGF0YSwgb3B0aW9uYWxEZWZhdWx0VmFsdWUpXG5cdH0sXG5cblx0Ly8gc2V0IHdpbGwgc3RvcmUgdGhlIGdpdmVuIHZhbHVlIGF0IGtleSBhbmQgcmV0dXJucyB2YWx1ZS5cblx0Ly8gQ2FsbGluZyBzZXQgd2l0aCB2YWx1ZSA9PT0gdW5kZWZpbmVkIGlzIGVxdWl2YWxlbnQgdG8gY2FsbGluZyByZW1vdmUuXG5cdHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuXHRcdGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5yZW1vdmUoa2V5KVxuXHRcdH1cblx0XHR0aGlzLnN0b3JhZ2Uud3JpdGUodGhpcy5fbmFtZXNwYWNlUHJlZml4ICsga2V5LCB0aGlzLl9zZXJpYWxpemUodmFsdWUpKVxuXHRcdHJldHVybiB2YWx1ZVxuXHR9LFxuXG5cdC8vIHJlbW92ZSBkZWxldGVzIHRoZSBrZXkgYW5kIHZhbHVlIHN0b3JlZCBhdCB0aGUgZ2l2ZW4ga2V5LlxuXHRyZW1vdmU6IGZ1bmN0aW9uKGtleSkge1xuXHRcdHRoaXMuc3RvcmFnZS5yZW1vdmUodGhpcy5fbmFtZXNwYWNlUHJlZml4ICsga2V5KVxuXHR9LFxuXG5cdC8vIGVhY2ggd2lsbCBjYWxsIHRoZSBnaXZlbiBjYWxsYmFjayBvbmNlIGZvciBlYWNoIGtleS12YWx1ZSBwYWlyXG5cdC8vIGluIHRoaXMgc3RvcmUuXG5cdGVhY2g6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzXG5cdFx0dGhpcy5zdG9yYWdlLmVhY2goZnVuY3Rpb24odmFsLCBuYW1lc3BhY2VkS2V5KSB7XG5cdFx0XHRjYWxsYmFjay5jYWxsKHNlbGYsIHNlbGYuX2Rlc2VyaWFsaXplKHZhbCksIChuYW1lc3BhY2VkS2V5IHx8ICcnKS5yZXBsYWNlKHNlbGYuX25hbWVzcGFjZVJlZ2V4cCwgJycpKVxuXHRcdH0pXG5cdH0sXG5cblx0Ly8gY2xlYXJBbGwgd2lsbCByZW1vdmUgYWxsIHRoZSBzdG9yZWQga2V5LXZhbHVlIHBhaXJzIGluIHRoaXMgc3RvcmUuXG5cdGNsZWFyQWxsOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnN0b3JhZ2UuY2xlYXJBbGwoKVxuXHR9LFxuXG5cdC8vIGFkZGl0aW9uYWwgZnVuY3Rpb25hbGl0eSB0aGF0IGNhbid0IGxpdmUgaW4gcGx1Z2luc1xuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHQvLyBoYXNOYW1lc3BhY2UgcmV0dXJucyB0cnVlIGlmIHRoaXMgc3RvcmUgaW5zdGFuY2UgaGFzIHRoZSBnaXZlbiBuYW1lc3BhY2UuXG5cdGhhc05hbWVzcGFjZTogZnVuY3Rpb24obmFtZXNwYWNlKSB7XG5cdFx0cmV0dXJuICh0aGlzLl9uYW1lc3BhY2VQcmVmaXggPT0gJ19fc3RvcmVqc18nK25hbWVzcGFjZSsnXycpXG5cdH0sXG5cblx0Ly8gY3JlYXRlU3RvcmUgY3JlYXRlcyBhIHN0b3JlLmpzIGluc3RhbmNlIHdpdGggdGhlIGZpcnN0XG5cdC8vIGZ1bmN0aW9uaW5nIHN0b3JhZ2UgaW4gdGhlIGxpc3Qgb2Ygc3RvcmFnZSBjYW5kaWRhdGVzLFxuXHQvLyBhbmQgYXBwbGllcyB0aGUgdGhlIGdpdmVuIG1peGlucyB0byB0aGUgaW5zdGFuY2UuXG5cdGNyZWF0ZVN0b3JlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gY3JlYXRlU3RvcmUuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuXHR9LFxuXHRcblx0YWRkUGx1Z2luOiBmdW5jdGlvbihwbHVnaW4pIHtcblx0XHR0aGlzLl9hZGRQbHVnaW4ocGx1Z2luKVxuXHR9LFxuXHRcblx0bmFtZXNwYWNlOiBmdW5jdGlvbihuYW1lc3BhY2UpIHtcblx0XHRyZXR1cm4gY3JlYXRlU3RvcmUodGhpcy5zdG9yYWdlLCB0aGlzLnBsdWdpbnMsIG5hbWVzcGFjZSlcblx0fVxufVxuXG5mdW5jdGlvbiBfd2FybigpIHtcblx0dmFyIF9jb25zb2xlID0gKHR5cGVvZiBjb25zb2xlID09ICd1bmRlZmluZWQnID8gbnVsbCA6IGNvbnNvbGUpXG5cdGlmICghX2NvbnNvbGUpIHsgcmV0dXJuIH1cblx0dmFyIGZuID0gKF9jb25zb2xlLndhcm4gPyBfY29uc29sZS53YXJuIDogX2NvbnNvbGUubG9nKVxuXHRmbi5hcHBseShfY29uc29sZSwgYXJndW1lbnRzKVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdG9yZShzdG9yYWdlcywgcGx1Z2lucywgbmFtZXNwYWNlKSB7XG5cdGlmICghbmFtZXNwYWNlKSB7XG5cdFx0bmFtZXNwYWNlID0gJydcblx0fVxuXHRpZiAoc3RvcmFnZXMgJiYgIWlzTGlzdChzdG9yYWdlcykpIHtcblx0XHRzdG9yYWdlcyA9IFtzdG9yYWdlc11cblx0fVxuXHRpZiAocGx1Z2lucyAmJiAhaXNMaXN0KHBsdWdpbnMpKSB7XG5cdFx0cGx1Z2lucyA9IFtwbHVnaW5zXVxuXHR9XG5cblx0dmFyIG5hbWVzcGFjZVByZWZpeCA9IChuYW1lc3BhY2UgPyAnX19zdG9yZWpzXycrbmFtZXNwYWNlKydfJyA6ICcnKVxuXHR2YXIgbmFtZXNwYWNlUmVnZXhwID0gKG5hbWVzcGFjZSA/IG5ldyBSZWdFeHAoJ14nK25hbWVzcGFjZVByZWZpeCkgOiBudWxsKVxuXHR2YXIgbGVnYWxOYW1lc3BhY2VzID0gL15bYS16QS1aMC05X1xcLV0qJC8gLy8gYWxwaGEtbnVtZXJpYyArIHVuZGVyc2NvcmUgYW5kIGRhc2hcblx0aWYgKCFsZWdhbE5hbWVzcGFjZXMudGVzdChuYW1lc3BhY2UpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdzdG9yZS5qcyBuYW1lc3BhY2VzIGNhbiBvbmx5IGhhdmUgYWxwaGFudW1lcmljcyArIHVuZGVyc2NvcmVzIGFuZCBkYXNoZXMnKVxuXHR9XG5cdFxuXHR2YXIgX3ByaXZhdGVTdG9yZVByb3BzID0ge1xuXHRcdF9uYW1lc3BhY2VQcmVmaXg6IG5hbWVzcGFjZVByZWZpeCxcblx0XHRfbmFtZXNwYWNlUmVnZXhwOiBuYW1lc3BhY2VSZWdleHAsXG5cblx0XHRfdGVzdFN0b3JhZ2U6IGZ1bmN0aW9uKHN0b3JhZ2UpIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdHZhciB0ZXN0U3RyID0gJ19fc3RvcmVqc19fdGVzdF9fJ1xuXHRcdFx0XHRzdG9yYWdlLndyaXRlKHRlc3RTdHIsIHRlc3RTdHIpXG5cdFx0XHRcdHZhciBvayA9IChzdG9yYWdlLnJlYWQodGVzdFN0cikgPT09IHRlc3RTdHIpXG5cdFx0XHRcdHN0b3JhZ2UucmVtb3ZlKHRlc3RTdHIpXG5cdFx0XHRcdHJldHVybiBva1xuXHRcdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRfYXNzaWduUGx1Z2luRm5Qcm9wOiBmdW5jdGlvbihwbHVnaW5GblByb3AsIHByb3BOYW1lKSB7XG5cdFx0XHR2YXIgb2xkRm4gPSB0aGlzW3Byb3BOYW1lXVxuXHRcdFx0dGhpc1twcm9wTmFtZV0gPSBmdW5jdGlvbiBwbHVnaW5GbigpIHtcblx0XHRcdFx0dmFyIGFyZ3MgPSBzbGljZShhcmd1bWVudHMsIDApXG5cdFx0XHRcdHZhciBzZWxmID0gdGhpc1xuXG5cdFx0XHRcdC8vIHN1cGVyX2ZuIGNhbGxzIHRoZSBvbGQgZnVuY3Rpb24gd2hpY2ggd2FzIG92ZXJ3cml0dGVuIGJ5XG5cdFx0XHRcdC8vIHRoaXMgbWl4aW4uXG5cdFx0XHRcdGZ1bmN0aW9uIHN1cGVyX2ZuKCkge1xuXHRcdFx0XHRcdGlmICghb2xkRm4pIHsgcmV0dXJuIH1cblx0XHRcdFx0XHRlYWNoKGFyZ3VtZW50cywgZnVuY3Rpb24oYXJnLCBpKSB7XG5cdFx0XHRcdFx0XHRhcmdzW2ldID0gYXJnXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRyZXR1cm4gb2xkRm4uYXBwbHkoc2VsZiwgYXJncylcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEdpdmUgbWl4aW5nIGZ1bmN0aW9uIGFjY2VzcyB0byBzdXBlcl9mbiBieSBwcmVmaXhpbmcgYWxsIG1peGluIGZ1bmN0aW9uXG5cdFx0XHRcdC8vIGFyZ3VtZW50cyB3aXRoIHN1cGVyX2ZuLlxuXHRcdFx0XHR2YXIgbmV3Rm5BcmdzID0gW3N1cGVyX2ZuXS5jb25jYXQoYXJncylcblxuXHRcdFx0XHRyZXR1cm4gcGx1Z2luRm5Qcm9wLmFwcGx5KHNlbGYsIG5ld0ZuQXJncylcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0X3NlcmlhbGl6ZTogZnVuY3Rpb24ob2JqKSB7XG5cdFx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqKVxuXHRcdH0sXG5cblx0XHRfZGVzZXJpYWxpemU6IGZ1bmN0aW9uKHN0clZhbCwgZGVmYXVsdFZhbCkge1xuXHRcdFx0aWYgKCFzdHJWYWwpIHsgcmV0dXJuIGRlZmF1bHRWYWwgfVxuXHRcdFx0Ly8gSXQgaXMgcG9zc2libGUgdGhhdCBhIHJhdyBzdHJpbmcgdmFsdWUgaGFzIGJlZW4gcHJldmlvdXNseSBzdG9yZWRcblx0XHRcdC8vIGluIGEgc3RvcmFnZSB3aXRob3V0IHVzaW5nIHN0b3JlLmpzLCBtZWFuaW5nIGl0IHdpbGwgYmUgYSByYXdcblx0XHRcdC8vIHN0cmluZyB2YWx1ZSBpbnN0ZWFkIG9mIGEgSlNPTiBzZXJpYWxpemVkIHN0cmluZy4gQnkgZGVmYXVsdGluZ1xuXHRcdFx0Ly8gdG8gdGhlIHJhdyBzdHJpbmcgdmFsdWUgaW4gY2FzZSBvZiBhIEpTT04gcGFyc2UgZXJyb3IsIHdlIGFsbG93XG5cdFx0XHQvLyBmb3IgcGFzdCBzdG9yZWQgdmFsdWVzIHRvIGJlIGZvcndhcmRzLWNvbXBhdGlibGUgd2l0aCBzdG9yZS5qc1xuXHRcdFx0dmFyIHZhbCA9ICcnXG5cdFx0XHR0cnkgeyB2YWwgPSBKU09OLnBhcnNlKHN0clZhbCkgfVxuXHRcdFx0Y2F0Y2goZSkgeyB2YWwgPSBzdHJWYWwgfVxuXG5cdFx0XHRyZXR1cm4gKHZhbCAhPT0gdW5kZWZpbmVkID8gdmFsIDogZGVmYXVsdFZhbClcblx0XHR9LFxuXHRcdFxuXHRcdF9hZGRTdG9yYWdlOiBmdW5jdGlvbihzdG9yYWdlKSB7XG5cdFx0XHRpZiAodGhpcy5lbmFibGVkKSB7IHJldHVybiB9XG5cdFx0XHRpZiAodGhpcy5fdGVzdFN0b3JhZ2Uoc3RvcmFnZSkpIHtcblx0XHRcdFx0dGhpcy5zdG9yYWdlID0gc3RvcmFnZVxuXHRcdFx0XHR0aGlzLmVuYWJsZWQgPSB0cnVlXG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdF9hZGRQbHVnaW46IGZ1bmN0aW9uKHBsdWdpbikge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzXG5cblx0XHRcdC8vIElmIHRoZSBwbHVnaW4gaXMgYW4gYXJyYXksIHRoZW4gYWRkIGFsbCBwbHVnaW5zIGluIHRoZSBhcnJheS5cblx0XHRcdC8vIFRoaXMgYWxsb3dzIGZvciBhIHBsdWdpbiB0byBkZXBlbmQgb24gb3RoZXIgcGx1Z2lucy5cblx0XHRcdGlmIChpc0xpc3QocGx1Z2luKSkge1xuXHRcdFx0XHRlYWNoKHBsdWdpbiwgZnVuY3Rpb24ocGx1Z2luKSB7XG5cdFx0XHRcdFx0c2VsZi5fYWRkUGx1Z2luKHBsdWdpbilcblx0XHRcdFx0fSlcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR9XG5cblx0XHRcdC8vIEtlZXAgdHJhY2sgb2YgYWxsIHBsdWdpbnMgd2UndmUgc2VlbiBzbyBmYXIsIHNvIHRoYXQgd2Vcblx0XHRcdC8vIGRvbid0IGFkZCBhbnkgb2YgdGhlbSB0d2ljZS5cblx0XHRcdHZhciBzZWVuUGx1Z2luID0gcGx1Y2sodGhpcy5wbHVnaW5zLCBmdW5jdGlvbihzZWVuUGx1Z2luKSB7XG5cdFx0XHRcdHJldHVybiAocGx1Z2luID09PSBzZWVuUGx1Z2luKVxuXHRcdFx0fSlcblx0XHRcdGlmIChzZWVuUGx1Z2luKSB7XG5cdFx0XHRcdHJldHVyblxuXHRcdFx0fVxuXHRcdFx0dGhpcy5wbHVnaW5zLnB1c2gocGx1Z2luKVxuXG5cdFx0XHQvLyBDaGVjayB0aGF0IHRoZSBwbHVnaW4gaXMgcHJvcGVybHkgZm9ybWVkXG5cdFx0XHRpZiAoIWlzRnVuY3Rpb24ocGx1Z2luKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1BsdWdpbnMgbXVzdCBiZSBmdW5jdGlvbiB2YWx1ZXMgdGhhdCByZXR1cm4gb2JqZWN0cycpXG5cdFx0XHR9XG5cblx0XHRcdHZhciBwbHVnaW5Qcm9wZXJ0aWVzID0gcGx1Z2luLmNhbGwodGhpcylcblx0XHRcdGlmICghaXNPYmplY3QocGx1Z2luUHJvcGVydGllcykpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdQbHVnaW5zIG11c3QgcmV0dXJuIGFuIG9iamVjdCBvZiBmdW5jdGlvbiBwcm9wZXJ0aWVzJylcblx0XHRcdH1cblxuXHRcdFx0Ly8gQWRkIHRoZSBwbHVnaW4gZnVuY3Rpb24gcHJvcGVydGllcyB0byB0aGlzIHN0b3JlIGluc3RhbmNlLlxuXHRcdFx0ZWFjaChwbHVnaW5Qcm9wZXJ0aWVzLCBmdW5jdGlvbihwbHVnaW5GblByb3AsIHByb3BOYW1lKSB7XG5cdFx0XHRcdGlmICghaXNGdW5jdGlvbihwbHVnaW5GblByb3ApKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdCYWQgcGx1Z2luIHByb3BlcnR5OiAnK3Byb3BOYW1lKycgZnJvbSBwbHVnaW4gJytwbHVnaW4ubmFtZSsnLiBQbHVnaW5zIHNob3VsZCBvbmx5IHJldHVybiBmdW5jdGlvbnMuJylcblx0XHRcdFx0fVxuXHRcdFx0XHRzZWxmLl9hc3NpZ25QbHVnaW5GblByb3AocGx1Z2luRm5Qcm9wLCBwcm9wTmFtZSlcblx0XHRcdH0pXG5cdFx0fSxcblx0XHRcblx0XHQvLyBQdXQgZGVwcmVjYXRlZCBwcm9wZXJ0aWVzIGluIHRoZSBwcml2YXRlIEFQSSwgc28gYXMgdG8gbm90IGV4cG9zZSBpdCB0byBhY2NpZGVudGlhbFxuXHRcdC8vIGRpc2NvdmVyeSB0aHJvdWdoIGluc3BlY3Rpb24gb2YgdGhlIHN0b3JlIG9iamVjdC5cblx0XHRcblx0XHQvLyBEZXByZWNhdGVkOiBhZGRTdG9yYWdlXG5cdFx0YWRkU3RvcmFnZTogZnVuY3Rpb24oc3RvcmFnZSkge1xuXHRcdFx0X3dhcm4oJ3N0b3JlLmFkZFN0b3JhZ2Uoc3RvcmFnZSkgaXMgZGVwcmVjYXRlZC4gVXNlIGNyZWF0ZVN0b3JlKFtzdG9yYWdlc10pJylcblx0XHRcdHRoaXMuX2FkZFN0b3JhZ2Uoc3RvcmFnZSlcblx0XHR9XG5cdH1cblxuXHR2YXIgc3RvcmUgPSBjcmVhdGUoX3ByaXZhdGVTdG9yZVByb3BzLCBzdG9yZUFQSSwge1xuXHRcdHBsdWdpbnM6IFtdXG5cdH0pXG5cdHN0b3JlLnJhdyA9IHt9XG5cdGVhY2goc3RvcmUsIGZ1bmN0aW9uKHByb3AsIHByb3BOYW1lKSB7XG5cdFx0aWYgKGlzRnVuY3Rpb24ocHJvcCkpIHtcblx0XHRcdHN0b3JlLnJhd1twcm9wTmFtZV0gPSBiaW5kKHN0b3JlLCBwcm9wKVx0XHRcdFxuXHRcdH1cblx0fSlcblx0ZWFjaChzdG9yYWdlcywgZnVuY3Rpb24oc3RvcmFnZSkge1xuXHRcdHN0b3JlLl9hZGRTdG9yYWdlKHN0b3JhZ2UpXG5cdH0pXG5cdGVhY2gocGx1Z2lucywgZnVuY3Rpb24ocGx1Z2luKSB7XG5cdFx0c3RvcmUuX2FkZFBsdWdpbihwbHVnaW4pXG5cdH0pXG5cdHJldHVybiBzdG9yZVxufVxuIiwidmFyIGFzc2lnbiA9IG1ha2VfYXNzaWduKClcbnZhciBjcmVhdGUgPSBtYWtlX2NyZWF0ZSgpXG52YXIgdHJpbSA9IG1ha2VfdHJpbSgpXG52YXIgR2xvYmFsID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogZ2xvYmFsKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0YXNzaWduOiBhc3NpZ24sXG5cdGNyZWF0ZTogY3JlYXRlLFxuXHR0cmltOiB0cmltLFxuXHRiaW5kOiBiaW5kLFxuXHRzbGljZTogc2xpY2UsXG5cdGVhY2g6IGVhY2gsXG5cdG1hcDogbWFwLFxuXHRwbHVjazogcGx1Y2ssXG5cdGlzTGlzdDogaXNMaXN0LFxuXHRpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuXHRpc09iamVjdDogaXNPYmplY3QsXG5cdEdsb2JhbDogR2xvYmFsXG59XG5cbmZ1bmN0aW9uIG1ha2VfYXNzaWduKCkge1xuXHRpZiAoT2JqZWN0LmFzc2lnbikge1xuXHRcdHJldHVybiBPYmplY3QuYXNzaWduXG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIHNoaW1Bc3NpZ24ob2JqLCBwcm9wczEsIHByb3BzMiwgZXRjKSB7XG5cdFx0XHRmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRlYWNoKE9iamVjdChhcmd1bWVudHNbaV0pLCBmdW5jdGlvbih2YWwsIGtleSkge1xuXHRcdFx0XHRcdG9ialtrZXldID0gdmFsXG5cdFx0XHRcdH0pXG5cdFx0XHR9XHRcdFx0XG5cdFx0XHRyZXR1cm4gb2JqXG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIG1ha2VfY3JlYXRlKCkge1xuXHRpZiAoT2JqZWN0LmNyZWF0ZSkge1xuXHRcdHJldHVybiBmdW5jdGlvbiBjcmVhdGUob2JqLCBhc3NpZ25Qcm9wczEsIGFzc2lnblByb3BzMiwgZXRjKSB7XG5cdFx0XHR2YXIgYXNzaWduQXJnc0xpc3QgPSBzbGljZShhcmd1bWVudHMsIDEpXG5cdFx0XHRyZXR1cm4gYXNzaWduLmFwcGx5KHRoaXMsIFtPYmplY3QuY3JlYXRlKG9iaildLmNvbmNhdChhc3NpZ25BcmdzTGlzdCkpXG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGZ1bmN0aW9uIEYoKSB7fSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWlubmVyLWRlY2xhcmF0aW9uc1xuXHRcdHJldHVybiBmdW5jdGlvbiBjcmVhdGUob2JqLCBhc3NpZ25Qcm9wczEsIGFzc2lnblByb3BzMiwgZXRjKSB7XG5cdFx0XHR2YXIgYXNzaWduQXJnc0xpc3QgPSBzbGljZShhcmd1bWVudHMsIDEpXG5cdFx0XHRGLnByb3RvdHlwZSA9IG9ialxuXHRcdFx0cmV0dXJuIGFzc2lnbi5hcHBseSh0aGlzLCBbbmV3IEYoKV0uY29uY2F0KGFzc2lnbkFyZ3NMaXN0KSlcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbWFrZV90cmltKCkge1xuXHRpZiAoU3RyaW5nLnByb3RvdHlwZS50cmltKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIHRyaW0oc3RyKSB7XG5cdFx0XHRyZXR1cm4gU3RyaW5nLnByb3RvdHlwZS50cmltLmNhbGwoc3RyKVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gdHJpbShzdHIpIHtcblx0XHRcdHJldHVybiBzdHIucmVwbGFjZSgvXltcXHNcXHVGRUZGXFx4QTBdK3xbXFxzXFx1RkVGRlxceEEwXSskL2csICcnKVxuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBiaW5kKG9iaiwgZm4pIHtcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBmbi5hcHBseShvYmosIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCkpXG5cdH1cbn1cblxuZnVuY3Rpb24gc2xpY2UoYXJyLCBpbmRleCkge1xuXHRyZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJyLCBpbmRleCB8fCAwKVxufVxuXG5mdW5jdGlvbiBlYWNoKG9iaiwgZm4pIHtcblx0cGx1Y2sob2JqLCBmdW5jdGlvbih2YWwsIGtleSkge1xuXHRcdGZuKHZhbCwga2V5KVxuXHRcdHJldHVybiBmYWxzZVxuXHR9KVxufVxuXG5mdW5jdGlvbiBtYXAob2JqLCBmbikge1xuXHR2YXIgcmVzID0gKGlzTGlzdChvYmopID8gW10gOiB7fSlcblx0cGx1Y2sob2JqLCBmdW5jdGlvbih2LCBrKSB7XG5cdFx0cmVzW2tdID0gZm4odiwgaylcblx0XHRyZXR1cm4gZmFsc2Vcblx0fSlcblx0cmV0dXJuIHJlc1xufVxuXG5mdW5jdGlvbiBwbHVjayhvYmosIGZuKSB7XG5cdGlmIChpc0xpc3Qob2JqKSkge1xuXHRcdGZvciAodmFyIGk9MDsgaTxvYmoubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmIChmbihvYmpbaV0sIGkpKSB7XG5cdFx0XHRcdHJldHVybiBvYmpbaV1cblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Zm9yICh2YXIga2V5IGluIG9iaikge1xuXHRcdFx0aWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdFx0XHRcdGlmIChmbihvYmpba2V5XSwga2V5KSkge1xuXHRcdFx0XHRcdHJldHVybiBvYmpba2V5XVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGlzTGlzdCh2YWwpIHtcblx0cmV0dXJuICh2YWwgIT0gbnVsbCAmJiB0eXBlb2YgdmFsICE9ICdmdW5jdGlvbicgJiYgdHlwZW9mIHZhbC5sZW5ndGggPT0gJ251bWJlcicpXG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsKSB7XG5cdHJldHVybiB2YWwgJiYge30udG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGdW5jdGlvbl0nXG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbCkge1xuXHRyZXR1cm4gdmFsICYmIHt9LnRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSdcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gW1xuXHQvLyBMaXN0ZWQgaW4gb3JkZXIgb2YgdXNhZ2UgcHJlZmVyZW5jZVxuXHRyZXF1aXJlKCcuL2xvY2FsU3RvcmFnZScpLFxuXHRyZXF1aXJlKCcuL29sZEZGLWdsb2JhbFN0b3JhZ2UnKSxcblx0cmVxdWlyZSgnLi9vbGRJRS11c2VyRGF0YVN0b3JhZ2UnKSxcblx0cmVxdWlyZSgnLi9jb29raWVTdG9yYWdlJyksXG5cdHJlcXVpcmUoJy4vc2Vzc2lvblN0b3JhZ2UnKSxcblx0cmVxdWlyZSgnLi9tZW1vcnlTdG9yYWdlJylcbl1cbiIsIi8vIGNvb2tpZVN0b3JhZ2UgaXMgdXNlZnVsIFNhZmFyaSBwcml2YXRlIGJyb3dzZXIgbW9kZSwgd2hlcmUgbG9jYWxTdG9yYWdlXG4vLyBkb2Vzbid0IHdvcmsgYnV0IGNvb2tpZXMgZG8uIFRoaXMgaW1wbGVtZW50YXRpb24gaXMgYWRvcHRlZCBmcm9tXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvU3RvcmFnZS9Mb2NhbFN0b3JhZ2VcblxudmFyIHV0aWwgPSByZXF1aXJlKCcuLi9zcmMvdXRpbCcpXG52YXIgR2xvYmFsID0gdXRpbC5HbG9iYWxcbnZhciB0cmltID0gdXRpbC50cmltXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRuYW1lOiAnY29va2llU3RvcmFnZScsXG5cdHJlYWQ6IHJlYWQsXG5cdHdyaXRlOiB3cml0ZSxcblx0ZWFjaDogZWFjaCxcblx0cmVtb3ZlOiByZW1vdmUsXG5cdGNsZWFyQWxsOiBjbGVhckFsbCxcbn1cblxudmFyIGRvYyA9IEdsb2JhbC5kb2N1bWVudFxuXG5mdW5jdGlvbiByZWFkKGtleSkge1xuXHRpZiAoIWtleSB8fCAhX2hhcyhrZXkpKSB7IHJldHVybiBudWxsIH1cblx0dmFyIHJlZ2V4cFN0ciA9IFwiKD86XnwuKjtcXFxccyopXCIgK1xuXHRcdGVzY2FwZShrZXkpLnJlcGxhY2UoL1tcXC1cXC5cXCtcXCpdL2csIFwiXFxcXCQmXCIpICtcblx0XHRcIlxcXFxzKlxcXFw9XFxcXHMqKCg/OlteO10oPyE7KSkqW147XT8pLipcIlxuXHRyZXR1cm4gdW5lc2NhcGUoZG9jLmNvb2tpZS5yZXBsYWNlKG5ldyBSZWdFeHAocmVnZXhwU3RyKSwgXCIkMVwiKSlcbn1cblxuZnVuY3Rpb24gZWFjaChjYWxsYmFjaykge1xuXHR2YXIgY29va2llcyA9IGRvYy5jb29raWUuc3BsaXQoLzsgPy9nKVxuXHRmb3IgKHZhciBpID0gY29va2llcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdGlmICghdHJpbShjb29raWVzW2ldKSkge1xuXHRcdFx0Y29udGludWVcblx0XHR9XG5cdFx0dmFyIGt2cCA9IGNvb2tpZXNbaV0uc3BsaXQoJz0nKVxuXHRcdHZhciBrZXkgPSB1bmVzY2FwZShrdnBbMF0pXG5cdFx0dmFyIHZhbCA9IHVuZXNjYXBlKGt2cFsxXSlcblx0XHRjYWxsYmFjayh2YWwsIGtleSlcblx0fVxufVxuXG5mdW5jdGlvbiB3cml0ZShrZXksIGRhdGEpIHtcblx0aWYoIWtleSkgeyByZXR1cm4gfVxuXHRkb2MuY29va2llID0gZXNjYXBlKGtleSkgKyBcIj1cIiArIGVzY2FwZShkYXRhKSArIFwiOyBleHBpcmVzPVR1ZSwgMTkgSmFuIDIwMzggMDM6MTQ6MDcgR01UOyBwYXRoPS9cIlxufVxuXG5mdW5jdGlvbiByZW1vdmUoa2V5KSB7XG5cdGlmICgha2V5IHx8ICFfaGFzKGtleSkpIHtcblx0XHRyZXR1cm5cblx0fVxuXHRkb2MuY29va2llID0gZXNjYXBlKGtleSkgKyBcIj07IGV4cGlyZXM9VGh1LCAwMSBKYW4gMTk3MCAwMDowMDowMCBHTVQ7IHBhdGg9L1wiXG59XG5cbmZ1bmN0aW9uIGNsZWFyQWxsKCkge1xuXHRlYWNoKGZ1bmN0aW9uKF8sIGtleSkge1xuXHRcdHJlbW92ZShrZXkpXG5cdH0pXG59XG5cbmZ1bmN0aW9uIF9oYXMoa2V5KSB7XG5cdHJldHVybiAobmV3IFJlZ0V4cChcIig/Ol58O1xcXFxzKilcIiArIGVzY2FwZShrZXkpLnJlcGxhY2UoL1tcXC1cXC5cXCtcXCpdL2csIFwiXFxcXCQmXCIpICsgXCJcXFxccypcXFxcPVwiKSkudGVzdChkb2MuY29va2llKVxufVxuIiwidmFyIHV0aWwgPSByZXF1aXJlKCcuLi9zcmMvdXRpbCcpXG52YXIgR2xvYmFsID0gdXRpbC5HbG9iYWxcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdG5hbWU6ICdsb2NhbFN0b3JhZ2UnLFxuXHRyZWFkOiByZWFkLFxuXHR3cml0ZTogd3JpdGUsXG5cdGVhY2g6IGVhY2gsXG5cdHJlbW92ZTogcmVtb3ZlLFxuXHRjbGVhckFsbDogY2xlYXJBbGwsXG59XG5cbmZ1bmN0aW9uIGxvY2FsU3RvcmFnZSgpIHtcblx0cmV0dXJuIEdsb2JhbC5sb2NhbFN0b3JhZ2Vcbn1cblxuZnVuY3Rpb24gcmVhZChrZXkpIHtcblx0cmV0dXJuIGxvY2FsU3RvcmFnZSgpLmdldEl0ZW0oa2V5KVxufVxuXG5mdW5jdGlvbiB3cml0ZShrZXksIGRhdGEpIHtcblx0cmV0dXJuIGxvY2FsU3RvcmFnZSgpLnNldEl0ZW0oa2V5LCBkYXRhKVxufVxuXG5mdW5jdGlvbiBlYWNoKGZuKSB7XG5cdGZvciAodmFyIGkgPSBsb2NhbFN0b3JhZ2UoKS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdHZhciBrZXkgPSBsb2NhbFN0b3JhZ2UoKS5rZXkoaSlcblx0XHRmbihyZWFkKGtleSksIGtleSlcblx0fVxufVxuXG5mdW5jdGlvbiByZW1vdmUoa2V5KSB7XG5cdHJldHVybiBsb2NhbFN0b3JhZ2UoKS5yZW1vdmVJdGVtKGtleSlcbn1cblxuZnVuY3Rpb24gY2xlYXJBbGwoKSB7XG5cdHJldHVybiBsb2NhbFN0b3JhZ2UoKS5jbGVhcigpXG59XG4iLCIvLyBtZW1vcnlTdG9yYWdlIGlzIGEgdXNlZnVsIGxhc3QgZmFsbGJhY2sgdG8gZW5zdXJlIHRoYXQgdGhlIHN0b3JlXG4vLyBpcyBmdW5jdGlvbnMgKG1lYW5pbmcgc3RvcmUuZ2V0KCksIHN0b3JlLnNldCgpLCBldGMgd2lsbCBhbGwgZnVuY3Rpb24pLlxuLy8gSG93ZXZlciwgc3RvcmVkIHZhbHVlcyB3aWxsIG5vdCBwZXJzaXN0IHdoZW4gdGhlIGJyb3dzZXIgbmF2aWdhdGVzIHRvXG4vLyBhIG5ldyBwYWdlIG9yIHJlbG9hZHMgdGhlIGN1cnJlbnQgcGFnZS5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdG5hbWU6ICdtZW1vcnlTdG9yYWdlJyxcblx0cmVhZDogcmVhZCxcblx0d3JpdGU6IHdyaXRlLFxuXHRlYWNoOiBlYWNoLFxuXHRyZW1vdmU6IHJlbW92ZSxcblx0Y2xlYXJBbGw6IGNsZWFyQWxsLFxufVxuXG52YXIgbWVtb3J5U3RvcmFnZSA9IHt9XG5cbmZ1bmN0aW9uIHJlYWQoa2V5KSB7XG5cdHJldHVybiBtZW1vcnlTdG9yYWdlW2tleV1cbn1cblxuZnVuY3Rpb24gd3JpdGUoa2V5LCBkYXRhKSB7XG5cdG1lbW9yeVN0b3JhZ2Vba2V5XSA9IGRhdGFcbn1cblxuZnVuY3Rpb24gZWFjaChjYWxsYmFjaykge1xuXHRmb3IgKHZhciBrZXkgaW4gbWVtb3J5U3RvcmFnZSkge1xuXHRcdGlmIChtZW1vcnlTdG9yYWdlLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0XHRcdGNhbGxiYWNrKG1lbW9yeVN0b3JhZ2Vba2V5XSwga2V5KVxuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiByZW1vdmUoa2V5KSB7XG5cdGRlbGV0ZSBtZW1vcnlTdG9yYWdlW2tleV1cbn1cblxuZnVuY3Rpb24gY2xlYXJBbGwoa2V5KSB7XG5cdG1lbW9yeVN0b3JhZ2UgPSB7fVxufVxuIiwiLy8gb2xkRkYtZ2xvYmFsU3RvcmFnZSBwcm92aWRlcyBzdG9yYWdlIGZvciBGaXJlZm94XG4vLyB2ZXJzaW9ucyA2IGFuZCA3LCB3aGVyZSBubyBsb2NhbFN0b3JhZ2UsIGV0Y1xuLy8gaXMgYXZhaWxhYmxlLlxuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3NyYy91dGlsJylcbnZhciBHbG9iYWwgPSB1dGlsLkdsb2JhbFxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0bmFtZTogJ29sZEZGLWdsb2JhbFN0b3JhZ2UnLFxuXHRyZWFkOiByZWFkLFxuXHR3cml0ZTogd3JpdGUsXG5cdGVhY2g6IGVhY2gsXG5cdHJlbW92ZTogcmVtb3ZlLFxuXHRjbGVhckFsbDogY2xlYXJBbGwsXG59XG5cbnZhciBnbG9iYWxTdG9yYWdlID0gR2xvYmFsLmdsb2JhbFN0b3JhZ2VcblxuZnVuY3Rpb24gcmVhZChrZXkpIHtcblx0cmV0dXJuIGdsb2JhbFN0b3JhZ2Vba2V5XVxufVxuXG5mdW5jdGlvbiB3cml0ZShrZXksIGRhdGEpIHtcblx0Z2xvYmFsU3RvcmFnZVtrZXldID0gZGF0YVxufVxuXG5mdW5jdGlvbiBlYWNoKGZuKSB7XG5cdGZvciAodmFyIGkgPSBnbG9iYWxTdG9yYWdlLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0dmFyIGtleSA9IGdsb2JhbFN0b3JhZ2Uua2V5KGkpXG5cdFx0Zm4oZ2xvYmFsU3RvcmFnZVtrZXldLCBrZXkpXG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlKGtleSkge1xuXHRyZXR1cm4gZ2xvYmFsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSlcbn1cblxuZnVuY3Rpb24gY2xlYXJBbGwoKSB7XG5cdGVhY2goZnVuY3Rpb24oa2V5LCBfKSB7XG5cdFx0ZGVsZXRlIGdsb2JhbFN0b3JhZ2Vba2V5XVxuXHR9KVxufVxuIiwiLy8gb2xkSUUtdXNlckRhdGFTdG9yYWdlIHByb3ZpZGVzIHN0b3JhZ2UgZm9yIEludGVybmV0IEV4cGxvcmVyXG4vLyB2ZXJzaW9ucyA2IGFuZCA3LCB3aGVyZSBubyBsb2NhbFN0b3JhZ2UsIHNlc3Npb25TdG9yYWdlLCBldGNcbi8vIGlzIGF2YWlsYWJsZS5cblxudmFyIHV0aWwgPSByZXF1aXJlKCcuLi9zcmMvdXRpbCcpXG52YXIgR2xvYmFsID0gdXRpbC5HbG9iYWxcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdG5hbWU6ICdvbGRJRS11c2VyRGF0YVN0b3JhZ2UnLFxuXHR3cml0ZTogd3JpdGUsXG5cdHJlYWQ6IHJlYWQsXG5cdGVhY2g6IGVhY2gsXG5cdHJlbW92ZTogcmVtb3ZlLFxuXHRjbGVhckFsbDogY2xlYXJBbGwsXG59XG5cbnZhciBzdG9yYWdlTmFtZSA9ICdzdG9yZWpzJ1xudmFyIGRvYyA9IEdsb2JhbC5kb2N1bWVudFxudmFyIF93aXRoU3RvcmFnZUVsID0gX21ha2VJRVN0b3JhZ2VFbEZ1bmN0aW9uKClcbnZhciBkaXNhYmxlID0gKEdsb2JhbC5uYXZpZ2F0b3IgPyBHbG9iYWwubmF2aWdhdG9yLnVzZXJBZ2VudCA6ICcnKS5tYXRjaCgvIChNU0lFIDh8TVNJRSA5fE1TSUUgMTApXFwuLykgLy8gTVNJRSA5LngsIE1TSUUgMTAueFxuXG5mdW5jdGlvbiB3cml0ZSh1bmZpeGVkS2V5LCBkYXRhKSB7XG5cdGlmIChkaXNhYmxlKSB7IHJldHVybiB9XG5cdHZhciBmaXhlZEtleSA9IGZpeEtleSh1bmZpeGVkS2V5KVxuXHRfd2l0aFN0b3JhZ2VFbChmdW5jdGlvbihzdG9yYWdlRWwpIHtcblx0XHRzdG9yYWdlRWwuc2V0QXR0cmlidXRlKGZpeGVkS2V5LCBkYXRhKVxuXHRcdHN0b3JhZ2VFbC5zYXZlKHN0b3JhZ2VOYW1lKVxuXHR9KVxufVxuXG5mdW5jdGlvbiByZWFkKHVuZml4ZWRLZXkpIHtcblx0aWYgKGRpc2FibGUpIHsgcmV0dXJuIH1cblx0dmFyIGZpeGVkS2V5ID0gZml4S2V5KHVuZml4ZWRLZXkpXG5cdHZhciByZXMgPSBudWxsXG5cdF93aXRoU3RvcmFnZUVsKGZ1bmN0aW9uKHN0b3JhZ2VFbCkge1xuXHRcdHJlcyA9IHN0b3JhZ2VFbC5nZXRBdHRyaWJ1dGUoZml4ZWRLZXkpXG5cdH0pXG5cdHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gZWFjaChjYWxsYmFjaykge1xuXHRfd2l0aFN0b3JhZ2VFbChmdW5jdGlvbihzdG9yYWdlRWwpIHtcblx0XHR2YXIgYXR0cmlidXRlcyA9IHN0b3JhZ2VFbC5YTUxEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXR0cmlidXRlc1xuXHRcdGZvciAodmFyIGk9YXR0cmlidXRlcy5sZW5ndGgtMTsgaT49MDsgaS0tKSB7XG5cdFx0XHR2YXIgYXR0ciA9IGF0dHJpYnV0ZXNbaV1cblx0XHRcdGNhbGxiYWNrKHN0b3JhZ2VFbC5nZXRBdHRyaWJ1dGUoYXR0ci5uYW1lKSwgYXR0ci5uYW1lKVxuXHRcdH1cblx0fSlcbn1cblxuZnVuY3Rpb24gcmVtb3ZlKHVuZml4ZWRLZXkpIHtcblx0dmFyIGZpeGVkS2V5ID0gZml4S2V5KHVuZml4ZWRLZXkpXG5cdF93aXRoU3RvcmFnZUVsKGZ1bmN0aW9uKHN0b3JhZ2VFbCkge1xuXHRcdHN0b3JhZ2VFbC5yZW1vdmVBdHRyaWJ1dGUoZml4ZWRLZXkpXG5cdFx0c3RvcmFnZUVsLnNhdmUoc3RvcmFnZU5hbWUpXG5cdH0pXG59XG5cbmZ1bmN0aW9uIGNsZWFyQWxsKCkge1xuXHRfd2l0aFN0b3JhZ2VFbChmdW5jdGlvbihzdG9yYWdlRWwpIHtcblx0XHR2YXIgYXR0cmlidXRlcyA9IHN0b3JhZ2VFbC5YTUxEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXR0cmlidXRlc1xuXHRcdHN0b3JhZ2VFbC5sb2FkKHN0b3JhZ2VOYW1lKVxuXHRcdGZvciAodmFyIGk9YXR0cmlidXRlcy5sZW5ndGgtMTsgaT49MDsgaS0tKSB7XG5cdFx0XHRzdG9yYWdlRWwucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZXNbaV0ubmFtZSlcblx0XHR9XG5cdFx0c3RvcmFnZUVsLnNhdmUoc3RvcmFnZU5hbWUpXG5cdH0pXG59XG5cbi8vIEhlbHBlcnNcbi8vLy8vLy8vLy9cblxuLy8gSW4gSUU3LCBrZXlzIGNhbm5vdCBzdGFydCB3aXRoIGEgZGlnaXQgb3IgY29udGFpbiBjZXJ0YWluIGNoYXJzLlxuLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJjdXN3ZXN0aW4vc3RvcmUuanMvaXNzdWVzLzQwXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL21hcmN1c3dlc3Rpbi9zdG9yZS5qcy9pc3N1ZXMvODNcbnZhciBmb3JiaWRkZW5DaGFyc1JlZ2V4ID0gbmV3IFJlZ0V4cChcIlshXFxcIiMkJSYnKCkqKywvXFxcXFxcXFw6Ozw9Pj9AW1xcXFxdXmB7fH1+XVwiLCBcImdcIilcbmZ1bmN0aW9uIGZpeEtleShrZXkpIHtcblx0cmV0dXJuIGtleS5yZXBsYWNlKC9eXFxkLywgJ19fXyQmJykucmVwbGFjZShmb3JiaWRkZW5DaGFyc1JlZ2V4LCAnX19fJylcbn1cblxuZnVuY3Rpb24gX21ha2VJRVN0b3JhZ2VFbEZ1bmN0aW9uKCkge1xuXHRpZiAoIWRvYyB8fCAhZG9jLmRvY3VtZW50RWxlbWVudCB8fCAhZG9jLmRvY3VtZW50RWxlbWVudC5hZGRCZWhhdmlvcikge1xuXHRcdHJldHVybiBudWxsXG5cdH1cblx0dmFyIHNjcmlwdFRhZyA9ICdzY3JpcHQnLFxuXHRcdHN0b3JhZ2VPd25lcixcblx0XHRzdG9yYWdlQ29udGFpbmVyLFxuXHRcdHN0b3JhZ2VFbFxuXG5cdC8vIFNpbmNlICN1c2VyRGF0YSBzdG9yYWdlIGFwcGxpZXMgb25seSB0byBzcGVjaWZpYyBwYXRocywgd2UgbmVlZCB0b1xuXHQvLyBzb21laG93IGxpbmsgb3VyIGRhdGEgdG8gYSBzcGVjaWZpYyBwYXRoLiAgV2UgY2hvb3NlIC9mYXZpY29uLmljb1xuXHQvLyBhcyBhIHByZXR0eSBzYWZlIG9wdGlvbiwgc2luY2UgYWxsIGJyb3dzZXJzIGFscmVhZHkgbWFrZSBhIHJlcXVlc3QgdG9cblx0Ly8gdGhpcyBVUkwgYW55d2F5IGFuZCBiZWluZyBhIDQwNCB3aWxsIG5vdCBodXJ0IHVzIGhlcmUuICBXZSB3cmFwIGFuXG5cdC8vIGlmcmFtZSBwb2ludGluZyB0byB0aGUgZmF2aWNvbiBpbiBhbiBBY3RpdmVYT2JqZWN0KGh0bWxmaWxlKSBvYmplY3Rcblx0Ly8gKHNlZTogaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2FhNzUyNTc0KHY9VlMuODUpLmFzcHgpXG5cdC8vIHNpbmNlIHRoZSBpZnJhbWUgYWNjZXNzIHJ1bGVzIGFwcGVhciB0byBhbGxvdyBkaXJlY3QgYWNjZXNzIGFuZFxuXHQvLyBtYW5pcHVsYXRpb24gb2YgdGhlIGRvY3VtZW50IGVsZW1lbnQsIGV2ZW4gZm9yIGEgNDA0IHBhZ2UuICBUaGlzXG5cdC8vIGRvY3VtZW50IGNhbiBiZSB1c2VkIGluc3RlYWQgb2YgdGhlIGN1cnJlbnQgZG9jdW1lbnQgKHdoaWNoIHdvdWxkXG5cdC8vIGhhdmUgYmVlbiBsaW1pdGVkIHRvIHRoZSBjdXJyZW50IHBhdGgpIHRvIHBlcmZvcm0gI3VzZXJEYXRhIHN0b3JhZ2UuXG5cdHRyeSB7XG5cdFx0LyogZ2xvYmFsIEFjdGl2ZVhPYmplY3QgKi9cblx0XHRzdG9yYWdlQ29udGFpbmVyID0gbmV3IEFjdGl2ZVhPYmplY3QoJ2h0bWxmaWxlJylcblx0XHRzdG9yYWdlQ29udGFpbmVyLm9wZW4oKVxuXHRcdHN0b3JhZ2VDb250YWluZXIud3JpdGUoJzwnK3NjcmlwdFRhZysnPmRvY3VtZW50Lnc9d2luZG93PC8nK3NjcmlwdFRhZysnPjxpZnJhbWUgc3JjPVwiL2Zhdmljb24uaWNvXCI+PC9pZnJhbWU+Jylcblx0XHRzdG9yYWdlQ29udGFpbmVyLmNsb3NlKClcblx0XHRzdG9yYWdlT3duZXIgPSBzdG9yYWdlQ29udGFpbmVyLncuZnJhbWVzWzBdLmRvY3VtZW50XG5cdFx0c3RvcmFnZUVsID0gc3RvcmFnZU93bmVyLmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cdH0gY2F0Y2goZSkge1xuXHRcdC8vIHNvbWVob3cgQWN0aXZlWE9iamVjdCBpbnN0YW50aWF0aW9uIGZhaWxlZCAocGVyaGFwcyBzb21lIHNwZWNpYWxcblx0XHQvLyBzZWN1cml0eSBzZXR0aW5ncyBvciBvdGhlcndzZSksIGZhbGwgYmFjayB0byBwZXItcGF0aCBzdG9yYWdlXG5cdFx0c3RvcmFnZUVsID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cdFx0c3RvcmFnZU93bmVyID0gZG9jLmJvZHlcblx0fVxuXG5cdHJldHVybiBmdW5jdGlvbihzdG9yZUZ1bmN0aW9uKSB7XG5cdFx0dmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMClcblx0XHRhcmdzLnVuc2hpZnQoc3RvcmFnZUVsKVxuXHRcdC8vIFNlZSBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvbXM1MzEwODEodj1WUy44NSkuYXNweFxuXHRcdC8vIGFuZCBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvbXM1MzE0MjQodj1WUy44NSkuYXNweFxuXHRcdHN0b3JhZ2VPd25lci5hcHBlbmRDaGlsZChzdG9yYWdlRWwpXG5cdFx0c3RvcmFnZUVsLmFkZEJlaGF2aW9yKCcjZGVmYXVsdCN1c2VyRGF0YScpXG5cdFx0c3RvcmFnZUVsLmxvYWQoc3RvcmFnZU5hbWUpXG5cdFx0c3RvcmVGdW5jdGlvbi5hcHBseSh0aGlzLCBhcmdzKVxuXHRcdHN0b3JhZ2VPd25lci5yZW1vdmVDaGlsZChzdG9yYWdlRWwpXG5cdFx0cmV0dXJuXG5cdH1cbn1cbiIsInZhciB1dGlsID0gcmVxdWlyZSgnLi4vc3JjL3V0aWwnKVxudmFyIEdsb2JhbCA9IHV0aWwuR2xvYmFsXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRuYW1lOiAnc2Vzc2lvblN0b3JhZ2UnLFxuXHRyZWFkOiByZWFkLFxuXHR3cml0ZTogd3JpdGUsXG5cdGVhY2g6IGVhY2gsXG5cdHJlbW92ZTogcmVtb3ZlLFxuXHRjbGVhckFsbDogY2xlYXJBbGxcbn1cblxuZnVuY3Rpb24gc2Vzc2lvblN0b3JhZ2UoKSB7XG5cdHJldHVybiBHbG9iYWwuc2Vzc2lvblN0b3JhZ2Vcbn1cblxuZnVuY3Rpb24gcmVhZChrZXkpIHtcblx0cmV0dXJuIHNlc3Npb25TdG9yYWdlKCkuZ2V0SXRlbShrZXkpXG59XG5cbmZ1bmN0aW9uIHdyaXRlKGtleSwgZGF0YSkge1xuXHRyZXR1cm4gc2Vzc2lvblN0b3JhZ2UoKS5zZXRJdGVtKGtleSwgZGF0YSlcbn1cblxuZnVuY3Rpb24gZWFjaChmbikge1xuXHRmb3IgKHZhciBpID0gc2Vzc2lvblN0b3JhZ2UoKS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdHZhciBrZXkgPSBzZXNzaW9uU3RvcmFnZSgpLmtleShpKVxuXHRcdGZuKHJlYWQoa2V5KSwga2V5KVxuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZShrZXkpIHtcblx0cmV0dXJuIHNlc3Npb25TdG9yYWdlKCkucmVtb3ZlSXRlbShrZXkpXG59XG5cbmZ1bmN0aW9uIGNsZWFyQWxsKCkge1xuXHRyZXR1cm4gc2Vzc2lvblN0b3JhZ2UoKS5jbGVhcigpXG59XG4iXX0=
