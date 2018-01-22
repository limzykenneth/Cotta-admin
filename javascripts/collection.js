var $ = require("jquery");
// require other libraries after this line
var _ = require("underscore");
var Backbone = require("backbone");
Backbone.$ = $;

var charModel = require("./model.js");

var collection = Backbone.Collection.extend({
	initialize: function(model, options){

	},

	model: charModel,

	render: function(){
		console.log(this.schema);
		var tpl = _.template($("#models-list-template").html());
		$("#page-content .main-content").html(tpl({
			data: this.toJSON(),
			schema: this.schema
		})).attr("class", "main-content").addClass("models-container");
	},

	renderForm: function(){
		var tpl = _.template($("#model-creation-template").html());
		$("#page-content .main-content").html(tpl(this.schema)).attr("class", "main-content").addClass("edit-model");
		bindFormEvent($("#page-content .main-content.edit-model .model-form"), this.schema);
	}
});

function bindFormEvent($form, schema){
	$form.submit(function(e) {
		e.preventDefault();

		var formContent = parseFormData($(this).serializeArray(), schema);

		fetch($(this).attr("action"), {
			method: "post",
			headers: window.fetchHeaders,
			body: JSON.stringify(formContent)
		}).then(function(response){
			return response.json();
		}).then(function(data){
			console.log(data);
		});
	});
}

function parseFormData(formData, schema){
	var result = {};
	_.each(formData, function(el, i){
		if(result[el.name]){
			if(typeof result[el.name] == "string"){
				result[el.name] = [result[el.name]];
			}
			result[el.name].push(el.value);
		}else{
			result[el.name] = el.value;
		}
	});

	_.each(schema.fields, function(el){
		if(el.type == "checkbox" && typeof result[el.slug] == "string"){
			result[el.slug] = [result[el.slug]];
		}
	});
	return result;
}

module.exports = collection;