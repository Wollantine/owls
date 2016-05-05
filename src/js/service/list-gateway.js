'use strict';

var localforage = require('localforage');
var _ = require('underscore');

/**                 LIST GATEWAY                 **/
module.exports = function(errorManager, itemGateway) {

	// Consts: DB's key names and prefixes
	var LIST_PREF = 'list-';
	var ACTUAL_KEY = 'actual';
	var ARCHIVE_KEY = 'archive';
	var NEW_LIST = { actual: [], archive: [] };

	var self = this;


	this._error = function(err, callback) {
		errorManager.error(err, callback);
	};


	/**
	 * Adds an empty list to the storage with this name. It can return a promise.
	 *
	 * @param {string} name The name for the new list
	 * @param {func(mixed)} callback The callback to be called. Will receive null on error
	 * @return {Promise} If callback not specified. True otherwise.
	 */
	this.createList = function(name, callback) {
		var promise = localforage.setItem(LIST_PREF+name, NEW_LIST);
		if (typeof callback != 'function') return promise;
		else {
			promise.then(callback).catch(function(err) {
				self._error(err, callback);
			});
		}

		return true;
	};



	// Get all and only the public functions (Those that don't start with "_")
	var listGateway = _.omit(this, function(value, key, object) {
		return key.indexOf("_") == 0;
	});
	return listGateway;
};