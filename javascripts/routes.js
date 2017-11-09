var $ = require("jquery");
// require other libraries after this line
var _ = require("underscore");
var Backbone = require("backbone");
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