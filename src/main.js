var siteTitle = "Vue Test"
var Vue = require("vue");
var App = require("./App.vue");

App.data = function(){
	return {
		siteTitle: siteTitle
	};
}

new Vue({
	el: "#page-content",
	render: function(h){
		return h(App);
	}
});
