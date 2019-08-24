import VuePlugin from "rollup-plugin-vue";
import less from "rollup-plugin-less";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import css from "rollup-plugin-css-only";

export default {
	input: "src/main.js",
	output: {
		format: "esm",
		file: "dist/javascripts/bundle.js"
	},
	plugins: [
		resolve(),
		commonjs(),
		VuePlugin({css: false}),
		css({output: "dist/stylesheets/bundle.css"}),
		less({output: "dist/stylesheets/bundle.css"})
	]
};