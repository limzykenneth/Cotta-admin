const gulp = require("gulp"),
	gutil = require("gulp-util"),
	rename = require("gulp-rename"),
	plumber = require("gulp-plumber");

const browserify = require("browserify"),
	vueify = require("vueify"),
	babelify = require("babelify"),
	source = require("vinyl-source-stream"),
	buffer = require("vinyl-buffer"),
	uglify = require("uglify-es"),
	composer = require("gulp-uglify/composer"),
	uglifyjs = composer(uglify, console);

const autoprefixer = require("autoprefixer");

const utils = require("./gulp-tasks/utils.js");
const server = require("./gulp-tasks/server.js");
const handlebars = require("./gulp-tasks/handlebars.js");
const assets = require("./gulp-tasks/assets.js");

vueify.compiler.applyConfig({
	postcss: [autoprefixer()]
});

function build(){
	const uglifyOptions = {};

	return browserify("./src/main.js", {
		debug: true,
	})
		.plugin("vueify/plugins/extract-css", {
			out: "./dist/stylesheets/bundle.css"
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
}

function devENV(done){
	process.env.NODE_ENV = "development";
	done();
}

function prodENV(done){
	process.env.NODE_ENV = "production";
	done();
}

gulp.task("build", gulp.series(devENV, build));
gulp.task("dev-env", devENV);
gulp.task("prod-env", prodENV);
gulp.task("static-assets", gulp.parallel(...assets));
gulp.task("handlebars", handlebars);
gulp.task("default", gulp.parallel("static-assets", "build", "handlebars"));
gulp.task("server", gulp.series("default", server));