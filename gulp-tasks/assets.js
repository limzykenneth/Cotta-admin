// For copying static assets
const gulp = require("gulp");

function copyLibrariesJS(){
	return gulp.src("./assets/javascripts/**/*")
		.pipe(gulp.dest("./dist/javascripts/vendor"));
}

function copyCSS(){
	return gulp.src("./assets/stylesheets/**/*")
		.pipe(gulp.dest("./dist/stylesheets"));
}

function copyImages(){
	return gulp.src("./assets/images/**/*")
		.pipe(gulp.dest("./dist/images"));
}

module.exports = [
	copyLibrariesJS,
	copyCSS,
	copyImages
];