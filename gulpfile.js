const gulp = require("gulp"),
	gutil = require("gulp-util"),
	rename = require("gulp-rename"),
	plumber = require("gulp-plumber");

const autoprefixer = require("autoprefixer");

const utils = require("./gulp-tasks/utils.js");
const server = require("./gulp-tasks/server.js");
const handlebars = require("./gulp-tasks/handlebars.js");
const assets = require("./gulp-tasks/assets.js");

function devENV(done){
	process.env.NODE_ENV = "development";
	done();
}

function prodENV(done){
	process.env.NODE_ENV = "production";
	done();
}

gulp.task("dev-env", devENV);
gulp.task("prod-env", prodENV);
gulp.task("static-assets", gulp.parallel(...assets));
gulp.task("handlebars", handlebars);
gulp.task("default", gulp.parallel("static-assets", "handlebars"));
gulp.task("server", gulp.series("default", server));