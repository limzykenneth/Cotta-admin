var gulp = require("gulp"),
	gutil = require("gulp-util"),
	rename = require("gulp-rename"),
	plumber = require("gulp-plumber");

var browserify = require("browserify"),
	vueify = require("vueify"),
	babelify = require("babelify"),
	source = require("vinyl-source-stream"),
	buffer = require("vinyl-buffer"),
	uglify = require("uglify-es"),
	composer = require("gulp-uglify/composer"),
	uglifyjs = composer(uglify, console);

var autoprefixer = require("autoprefixer");

var utils = require("./gulp-tasks/utils.js");
require("./gulp-tasks/server.js");
require("./gulp-tasks/handlebars.js");
require("./gulp-tasks/assets.js");

vueify.compiler.applyConfig({
	postcss: [autoprefixer()]
})

gulp.task("build", ["dev-env"], function(){
	var uglifyOptions = {};

	return browserify("./src/main.js", {
		debug: true,
	})
	.plugin('vueify/plugins/extract-css', {
		out: './dist/stylesheets/bundle.css'
	})
	.bundle()
	.on("error", utils.onError)
	.pipe(plumber({
		errorHandler: utils.onError
	}))
	.pipe(source("bundle.js"))
	.pipe(gulp.dest("./dist/javascripts"))
	.pipe(buffer())
	.pipe(uglifyjs(uglifyOptions))
	.pipe(rename("bundle.min.js"))
	.pipe(gulp.dest("./dist/javascripts"));
});

gulp.task("default", ["static-assets", "build", "handlebars"]);

// Utils Tasks
gulp.task("dev-env", function() {
    return process.env.NODE_ENV = 'development';
});

gulp.task("prod-env", function() {
    return process.env.NODE_ENV = 'production';
});