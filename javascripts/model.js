var $ = require("jquery");
// require other libraries after this line
var _ = require("underscore");
var Backbone = require("backbone");
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