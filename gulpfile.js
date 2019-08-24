const gulp = require("gulp");

const rollup = require("rollup").rollup,
	vue = require("rollup-plugin-vue"),
	less = require("rollup-plugin-less"),
	resolve = require("rollup-plugin-node-resolve"),
	commonjs = require("rollup-plugin-commonjs"),
	css = require("rollup-plugin-css-only"),
	autoprefixer = require("autoprefixer");

const utils = require("./gulp-tasks/utils.js");
const server = require("./gulp-tasks/server.js");
const handlebars = require("./gulp-tasks/handlebars.js");
const assets = require("./gulp-tasks/assets.js");

function build(){
	return rollup({
		input: "src/main.js",
		plugins: [
			resolve(),
			commonjs(),
			vue({
				css: false,
				style: {
					postcssPlugins: [autoprefixer]
				}
			}),
			css({output: "dist/stylesheets/bundle.css"}),
			less({output: "dist/stylesheets/bundle.css"})
		]
	}).then((bundle) => {
		return bundle.write({
			format: "umd",
			file: "dist/javascripts/bundle.js",
			sourcemap: true
		});
	});
}

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
gulp.task("build", build);
gulp.task("static-assets", gulp.parallel(...assets));
gulp.task("handlebars", handlebars);
gulp.task("default", gulp.parallel("build", "static-assets", "handlebars"));
gulp.task("server", gulp.series("default", server));