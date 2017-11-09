var $ = require("jquery");
// require other libraries after this line
var _ = require("underscore");
var Backbone = require("backbone");
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