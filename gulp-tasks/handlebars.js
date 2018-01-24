var gulp = require("gulp"),
	handlebars = require("gulp-compile-handlebars"),
	rename = require("gulp-rename"),
	plumber = require("gulp-plumber"),
	changeCase = require("change-case");

var utils = require("./utils.js");
var pjson = require("../package.json");

gulp.task("handlebars", function(){
	var options = {
		ignorePartials: true,
		batch: ["./partials", "./partials/head"],
		helpers: {
			capitals : function(str){
				return str.fn(this).toUpperCase();
			},
			titleCase: function(str){
				return str.fn(this).replace(/\w\S*/g, function(txt){
					return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
				});
			},
			ifEquals: function(a, b, opts){
				if(a == b){
					return opts.fn(this);
				}else{
					return opts.inverse(this);
				}
			}
		}
	};

	return gulp.src("./index.hbs")
		.pipe(plumber({
			errorHandler: utils.onError
		}))
		.pipe(handlebars({
			title: changeCase.titleCase(pjson.name),
			description: pjson.description
		}, options))
		.pipe(rename("index.html"))
		.pipe(gulp.dest("dist"));
});