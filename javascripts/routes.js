var $ = require("jquery");
// require other libraries after this line
var _ = require("underscore");
var Backbone = require("backbone");
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