const gulp = require("gulp");
const fs = require("fs");
const archiver = require("archiver");
const pjson = require("./package.json");
const path = require("path");

const rollup = require("rollup").rollup,
	vue = require("rollup-plugin-vue"),
	resolve = require("rollup-plugin-node-resolve"),
	commonjs = require("rollup-plugin-commonjs"),
	css = require("rollup-plugin-css-only"),
	autoprefixer = require("autoprefixer"),
	replace = require("rollup-plugin-replace"),
	terser = require("rollup-plugin-terser").terser;

const utils = require("./gulp-tasks/utils.js");
const server = require("./gulp-tasks/server.js");
const handlebars = require("./gulp-tasks/handlebars.js");
const assets = require("./gulp-tasks/assets.js");

function build(env){
	let replacePlugin = null;
	let terserPlugin = null;
	if(env === "production"){
		replacePlugin = replace({
			"development": "'production'",
			delimiters: ["\"", "\""]
		});

		terserPlugin = terser();
	}

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
			replacePlugin,
			terserPlugin,
			css({
				output: "dist/stylesheets/bundle.css"
			})
		]
	}).then((bundle) => {
		return bundle.write({
			format: "umd",
			file: "dist/javascripts/bundle.js",
			sourcemap: true
		});
	});
}

function developmentBuild(){
	return build("development");
}

function productionBuild(){
	return build("production");
}

function compress(done){
	const output = fs.createWriteStream(path.join("./releases", `cotta-admin-${pjson.version}.zip`));
	const archive = archiver("zip", {
		zlib: { level: 9 }
	});

	output.on("close", function() {
		done();
	});

	output.on("data", (data) => {
		console.log(data);
	});

	archive.on("warning", (err) => {
		if (err.code === "ENOENT") {
			console.log(err);
		} else {
			throw err;
		}
	});

	archive.on("error", function(err) {
		throw err;
	});

	archive.pipe(output);
	archive.directory("dist/", false);
	archive.finalize();
}

gulp.task("build", developmentBuild);
gulp.task("build-prod", productionBuild);
gulp.task("static-assets", gulp.parallel(...assets));
gulp.task("handlebars", handlebars);
gulp.task("default", gulp.parallel("build", "static-assets", "handlebars"));
gulp.task("production", gulp.parallel("build-prod", "static-assets", "handlebars"));
gulp.task("compress", compress);
gulp.task("release", gulp.series("production", "compress"));
gulp.task("server", gulp.series("default", server));