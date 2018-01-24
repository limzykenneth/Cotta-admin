// For copying static assets
var gulp = require("gulp");

gulp.task("copy-libraries-js", function(){
	return gulp.src("./assets/javascripts/**/*")
		.pipe(gulp.dest("./dist/javascripts/vendor"));
});

gulp.task("copy-css", function(){
	return gulp.src("./assets/stylesheets/**/*")
		.pipe(gulp.dest("./dist/stylesheets"));
});

gulp.task("copy-images", function(){
	return gulp.src("./assets/images/**/*")
		.pipe(gulp.dest("./dist/images"));
});

gulp.task("static-assets", ["copy-libraries-js", "copy-css", "copy-images"]);