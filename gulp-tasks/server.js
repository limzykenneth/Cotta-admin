const gulp = require("gulp"),
	browserSync = require("browser-sync").create(),
	historyApiFallback = require("connect-history-api-fallback");

function server(){
	browserSync.init({
		server: "./dist",
		middleware: [ historyApiFallback() ]
	});

	gulp.watch("./partials/**/*", gulp.series("handlebars", handlebarsWatch));
	gulp.watch("./src/**/*", gulp.series(vueWatch));
}

function vueWatch(done){
	browserSync.reload();
	done();
}

function handlebarsWatch(done){
	browserSync.reload();
	done();
}

module.exports = server;