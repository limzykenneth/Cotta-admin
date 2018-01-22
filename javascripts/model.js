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