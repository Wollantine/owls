'use strict';

module.exports = function() {
	
	this.error = function(err, callback) {
		if (err.stack == undefined) console.log(err);
		else console.log(err.stack);
		if (typeof callback == 'function') callback(null);
	};

	return this;
	
};