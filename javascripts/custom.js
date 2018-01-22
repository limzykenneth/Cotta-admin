var $ = require("jquery");
// require other libraries after this line
var _ = require("underscore");
var Backbone = require("backbone");
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
