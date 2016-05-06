'use strict';

var localforage = require('localforage');
var _ = require('underscore');

/**                 ITEM GATEWAY                 **/
module.exports = function(errorManager) {

	// Consts: DB's key names and prefixes
	var ITEM_PREF = 'item-';
	var DONE_KEY = 'done';
	var NEW_ITEM = {done: false}; // These keys should match the other consts

	var self = this;


	this._error = function(err, callback) {
		errorManager.error(err, callback);
	};

	/**
	 * Adds an item to the storage with this name and status not done. It can return a promise.
	 *
	 * @param {string} name The name for the new item
	 * @param {func(mixed)} callback The callback to be called. Will receive null on error
	 * @return {Promise} If callback not specified. True otherwise.
	 */
	this.createItem = function(name, callback) {
		var promise = localforage.setItem(ITEM_PREF+name, NEW_ITEM)
		if (typeof callback != 'function') return promise;
		else {
			promise.then(callback).catch(function(err) {
				self._error(err, callback);
			});
		}

		return true;
	};

	/**
	 * Gets an item's contents. It can return a promise.
	 *
	 * @param {string} item The name of the item to get
	 * @param {func(mixed)} callback Optional. If specified, the callback that will be called
	 *	 on completion. Will receive null on error
	 * @return {Promise} If callback not specified. True otherwise.
	 */
	this.getItem = function(name, callback) {
		var promise = localforage.getItem(ITEM_PREF+name);
		if (typeof callback != 'function') return promise;
		else {
			promise.then(function(result) {
				var item = {name: name, done: result[DONE_KEY]};
				callback(item);
			}).catch(function(err) {
				self._error(err, callback);
			});
		}

		return true;
	}

	/**
	 * Changes the status of an item between done and not done.
	 *
	 * @param {string} name The name of the item to remove
	 * @param {bool} done The new status for the item
	 * @param {func(mixed)} callback The callback to be called. Will receive null on error
	 * @return true
	 */
	this.changeItemStatus = function(name, done, callback) {
		localforage.getItem(ITEM_PREF+name).then(function(item) {
			item[DONE_KEY] = done;
			localforage.setItem(ITEM_PREF+name, item).then(callback).catch(function(err) {
				self._error(err, callback);
			});
		});

		return true;
	};

	/**
	 * Deletes this item from the storage. It can return a promise.
	 *
	 * @param {string} item The name of the item to remove
	 * @param {func(mixed)} callback Optional. If specified, the callback that will be called
	 *	 on completion. Will receive null on error
	 * @return {Promise} If callback not specified. True otherwise.
	 */
	this.deleteItem = function(item, callback) {
		var promise = localforage.removeItem(ITEM_PREF+item);
		if (typeof callback != 'function') return promise;
		else {
			promise.then(callback).catch(function(err) {
				self._error(err, callback);
			});
		}
		return true;
	};



	// Get all and only the public functions (Those that don't start with "_")
	var itemGateway = _.omit(this, function(value, key, object) {
		return key.indexOf("_") == 0;
	});
	return itemGateway;

};