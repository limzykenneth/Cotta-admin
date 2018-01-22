// For copying static assets
var gulp = require("gulp");

gulp.task("copy-libraries-js", function(){
	return gulp.src("./javascripts/vendor/*")
		.pipe(gulp.dest("./dist/javascripts/vendor"));
});

gulp.task("copy-css", function(){
	gulp.src("./stylesheets/fonts/*")
		.pipe(gulp.dest("./dist/stylesheets/fonts"));

	gulp.src("./stylesheets/img/*")
		.pipe(gulp.dest("./dist/stylesheets/img"));

	return gulp.src("./stylesheets/normalize.min.css")
		.pipe(gulp.dest("./dist/stylesheets"));
});

gulp.task("copy-images", function(){
	return gulp.src("./images/**/*")
		.pipe(gulp.dest("./dist/images"));
});

gulp.task("static-assets", ["copy-libraries-js", "copy-css", "copy-images"]);