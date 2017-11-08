var $ = require("jquery");
// require other libraries after this line
var _ = require("underscore");
var Backbone = require("backbone");
Backbone.$ = $;

var charModel = require("./model.js");

var collection = Backbone.Collection.extend({

});

module.exports = collection;