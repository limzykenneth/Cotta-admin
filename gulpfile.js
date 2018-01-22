var gulp = require("gulp"),
	gutil = require("gulp-util"),
    rename = require("gulp-rename"),
    less = require("gulp-less"),
    cleanCSS = require("gulp-clean-css"),
    autoprefixer = require("gulp-autoprefixer"),
    browserify = require("browserify"),
    source = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer"),
    plumber = require("gulp-plumber"),
    uglify = require("uglify-es"),
    composer = require("gulp-uglify/composer"),
    uglifyjs = composer(uglify, console),
    browserSync = require("browser-sync").create();

require("./gulp-tasks/deploy.js");
require("./gulp-tasks/assets.js");
require("./gulp-tasks/server.js");

// Compilation tasks
gulp.task("stylesheets", function(){
	var lessOptions = {
		paths: ["./stylesheets"]
	};

	var cleanCSSOptions = {};

	return gulp.src("./stylesheets/style.less")
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(less(lessOptions))
		.pipe(autoprefixer())
		.pipe(gulp.dest("./dist/stylesheets"))
		.pipe(cleanCSS(cleanCSSOptions))
		.pipe(rename("style.min.css"))
		.pipe(gulp.dest("./dist/stylesheets"))
		.pipe(browserSync.stream());
});

gulp.task("javascripts", function(){
	var uglifyOptions = {};

	return browserify("./javascripts/custom.js", {
		debug: true,
		// standalone: "app"
	})
        .bundle()
        .on("error", onError)
        .pipe(plumber({
			errorHandler: onError
		}))
        .pipe(source("main.js"))
        .pipe(gulp.dest("./dist/javascripts/"))
        .pipe(buffer())
        .pipe(uglifyjs(uglifyOptions))
        .pipe(rename("main.min.js"))
        .pipe(gulp.dest("./dist/javascripts/"));
});


gulp.task("default", ["stylesheets", "javascripts", "static-assets"]);


function onError(err){
	gutil.log(gutil.colors.red('Error (' + err.plugin + '): ' + err.message));
	gutil.log(err.toString());
	this.emit("end");
}