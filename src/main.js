var siteTitle = "Char Admin"
var Vue = require("vue");
var urljoin = require('url-join');
var App = require("./App.vue");

var url = "http://localhost:3001/api";
var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE1MTc1NjUyMDIsImV4cCI6MTUxODE3MDAwMn0.sarbO9x6h_iuTe4pibkbem67Rjk4lc4XuP5N8851WMI";

fetch(generateRequest("schema")).then((res) => res.json()).then((schemas) => {
	App.data = function(){
		return {
			siteTitle: siteTitle,
			serverURL: url,
			serverToken: token,
			schemas: schemas,

			currentContentView: "app-dashboard",
			currentCollection: {},

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

function generateRequest(path, method="GET"){
	var finalURL = urljoin(url, path);
	var request = new Request(finalURL, {
		method: method,
		headers: new Headers({
			"Authorization": `Bearer ${token}`
		})
	});

	return request;
}