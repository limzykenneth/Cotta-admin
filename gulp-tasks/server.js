var gulp = require("gulp"),
	browserSync = require("browser-sync").create(),
	historyApiFallback = require("connect-history-api-fallback");

gulp.task("server", ["default"], function(){
	browserSync.init({
		server: "./dist",
		middleware: [ historyApiFallback() ]
	});

	gulp.watch("./partials/**/*", ["hbs-watch"]);
	gulp.watch("./src/**/*", ["vue-watch"]);
});

gulp.task("vue-watch", ["build"], function(done){
	browserSync.reload();
	done();
});

gulp.task("hbs-watch", ["handlebars"], function(done){
	browserSync.reload();
	done();
});