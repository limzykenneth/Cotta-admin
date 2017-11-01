var $ = require('jquery');
// require other libraries after this line
var _ = require("underscore");
var Backbone = require("backbone");
Backbone.$ = $;

var host = "http://localhost:3001";
var authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE1MDk1NjA3MzEsImV4cCI6MTUxMDE2NTUzMX0.Ez_eeRy3eJRY9E2duE_M75XxcTZWZ1ltcisSjkZ1cc0";

var getSchema = fetch(`${host}/api/schema`, {
	method: "get",
	headers: new Headers({
		"Authorization": "Bearer " + authToken
	})
}).then(function(response){
	return response.json();
});

$(document).ready(function() {
	getSchema.then(function(schema){

	});
});
