'use strict';

var localforage = require('localforage');
var _ = require('underscore');

module.exports = function(errorManager) {

	// Consts: DB's key names and prefixes
	var ITEM_PREF = 'item-';



	

	// Get all and only the public functions (Those that don't start with "_")
	var itemGateway = _.omit(this, function(value, key, object) {
		return key.indexOf("_") == 0;
	});
	return itemGateway;

};