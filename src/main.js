var siteTitle = "Char Admin"
var Vue = require("vue");
var urljoin = require('url-join');
var App = require("./App.vue");

var url = "http://localhost:3001/api";

fetch(generateRequest("schema")).then((res) => {
	return res.json();
}).then((schemas) => {
	var initialRenderPage = "app-dashboard";
	var loggedIn = true;
	if(schemas.errors && schemas.errors.length > 0){
		_.each(schemas.errors, function(error){
			if(error.title !== "Auth Token Invalid"){
				throw new Error(error);
				return false;
			}
			schemas = {};
			initialRenderPage = "login-page";
			loggedIn = false;
			return false;
		});
	}

	App.data = function(){
		return {
			siteTitle: siteTitle,
			serverURL: url,
			schemas: schemas,
			loggedIn: loggedIn,

			currentContentView: initialRenderPage,
			currentCollection: {},

			usersList: {},

			contentViews: {
				dashboard: "app-dashboard",
				schemasList: "schemas-list",
				collectionList: "collection-list"
			},

			utils: {
				generateRequest: generateRequest
			}
		};
	};

	new Vue({
		el: "#page-content",
		render: function(h){
			return h(App);
		}
	});
});

function generateRequest(path, method="GET", payload=null){
	var finalURL = urljoin(url, path);
	var token = store.get("access_token");

	var header = {};
	header["Content-Type"] = "application/json";
	if(path !== "token/generate_new_token"){
		header["Authorization"] = `Bearer ${token}`;
	}

	var body;
	if(payload !== null){
		body = JSON.stringify(payload);
	}

	var request = new Request(finalURL, {
		method: method,
		body: body,
		headers: new Headers(header)
	});

	return request;
}