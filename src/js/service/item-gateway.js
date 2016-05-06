'use strict';

var localforage = require('localforage');
var _ = require('underscore');
var Item = require('../dto/Item');

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
	this.createItem = function(list, name, callback) {
		// Item is stored with its list's name to allow items in different lists to have the same name
		var prefix = ITEM_PREF+list+"-";
		var promise = localforage.setItem(prefix+name, NEW_ITEM)
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
	 * @param {func(Item)} callback Optional. If specified, the callback that will be called
	 *	 on completion. Will receive null on error
	 * @return {Promise} If callback not specified. True otherwise.
	 */
	this.getItem = function(list, name, callback) {
		var prefix = ITEM_PREF+list+"-";
		var promise = localforage.getItem(prefix+name).then(function(result) {
			var item = new Item(name, result[DONE_KEY]);
			return item;
		});
		if (typeof callback != 'function') return promise;
		else {
			promise.then(function(result) {
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
	this.changeItemStatus = function(list, name, done, callback) {
		var prefix = ITEM_PREF+list+"-";
		localforage.getItem(prefix+name).then(function(item) {
			item[DONE_KEY] = done;
			localforage.setItem(prefix+name, item).then(callback).catch(function(err) {
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
	this.deleteItem = function(list, item, callback) {
		var prefix = ITEM_PREF+list+"-";
		var promise = localforage.removeItem(prefix+item);
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