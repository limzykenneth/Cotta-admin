var gulp = require("gulp"),
	surge = require("gulp-surge");

gulp.task("deploy:dev", ["default"], function(){
	return surge({
		project: "./dist",         // Path to your static build directory
		domain: ""  // Your domain or Surge subdomain
	});
});

gulp.task("deploy:prod", ["default"], function(){
	return surge({
		project: "./dist",         // Path to your static build directory
		domain: ""  // Your domain or Surge subdomain
	});
});

gulp.task("deploy", ["deploy:dev"]);