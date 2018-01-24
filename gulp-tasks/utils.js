var gutil = require("gulp-util");

var utils = {
	onError: function(err){
		gutil.log(gutil.colors.red("Error (" + err.plugin + "): " + err.message));
		gutil.log(err.toString());
		this.emit("end");
	}
};

module.exports = utils;