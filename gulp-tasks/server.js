var gulp = require("gulp"),
	browserSync = require("browser-sync").create(),
	historyApiFallback = require("connect-history-api-fallback");

// Server
gulp.task("server", ["default"], function(){
	browserSync.init({
		server: "./dist",
		middleware: [ historyApiFallback() ]
	});

	gulp.watch("./stylesheets/**/*.less", ["stylesheets"]);
	gulp.watch("./stylesheets/(normalize.min.css|fonts/*|img/*)", ["copy-css"]);

	gulp.watch("./javascripts/**/*.js", ["javascripts"]);
	gulp.watch("./javascripts/vendor/*", ["copy-libraries-js"]);

	gulp.watch("./images/**/*", ["copy-images"]);

	gulp.watch("./dist/*.html").on("change", browserSync.reload);
	gulp.watch("./dist/javascripts/**/*").on("change", browserSync.reload);
	gulp.watch("./dist/stylesheets/(normalize.min.css|fonts/*|img/*)").on("change", browserSync.reload);
});