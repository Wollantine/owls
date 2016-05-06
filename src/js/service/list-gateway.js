'use strict';

var localforage = require('localforage');
var _ = require('underscore');
var List = require('../dto/List');
var Item = require('../dto/Item');

/**                 LIST GATEWAY                 **/
module.exports = function(errorManager, itemGateway) {

	// Consts: DB's key names and prefixes
	var LIST_PREF = 'list-';
	var ACTUAL_KEY = 'actual';
	var ARCHIVE_KEY = 'archive';
	var NEW_LIST = { actual: [], archive: [] }; // These keys should match the other consts

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

	/**
	 * Changes the name of the list if the new name does not exist
	 * Otherwise it shows an error.
	 *
	 * @param {func(mixed)} callback The callback to be called. Will receive null on error
	 * @return true
	 */
	this.changeListName = function(list, newName, callback) {
		localforage.getItem(LIST_PREF+list).then(function(listContents) {
			var removeList = localforage.removeItem(LIST_PREF+list);
			var addList = localforage.setItem(LIST_PREF+newName, listContents);

			// Wait for both operations to finish
			var promise = Promise.all([removeList, addList]).then(callback).catch(function(err) {
				self._error(err, callback);
			});
		}).catch(function(err) {
			self._error(err, callback);
		});

		return true;
	};

	/**
	 * Adds an undone item to the list at the last position of the actual items sublist.
	 *
	 * @param {string} list The name of the list in which the item must be added
	 * @param {string} itemName The name for the new item
	 * @param {func(mixed)} callback The callback to be called. Will receive null on error
	 * @return true
	 */
	this.addItem = function(list, itemName, callback) {
		localforage.getItem(LIST_PREF+list).then(function(listContents) {
			listContents[ACTUAL_KEY].push(itemName);
			var addItemToList = localforage.setItem(LIST_PREF+list, listContents);
			var addItemToStorage = itemGateway.createItem(list, itemName);

			// Wait for both operations to finish
			Promise.all([addItemToList, addItemToStorage]).then(callback).catch(function(err) {
				self._error(err, callback);
			});
		}).catch(function(err) {
			self._error(err, callback);
		});
	};

	/**
	 * Moves an item to the beginning of the archive list, assuming it existed in the
	 * actual list.
	 *
	 * @param {string} list The name of the list that contains the item
	 * @param {string} item The name of the item to move
	 * @param {func(mixed)} callback The callback to be called. Will receive null on error
	 * @return true
	 */
	this.archiveItem = function(list, item, callback) {
		localforage.getItem(LIST_PREF+list).then(function(listContents) {
			// Delete the item from the actual list
			var index = listContents[ACTUAL_KEY].indexOf(item);
			if (index != -1) {
				listContents[ACTUAL_KEY].splice(index, 1);
				// Add it to the beginning of the archive list
				listContents[ARCHIVE_KEY].unshift(item);
				// Save the list again
				localforage.setItem(LIST_PREF+list, listContents).then(callback).catch(function(err) {
					self._error(err, callback);
				});
			}
			else self._error("List "+list+" doesn't contain any item "+item+".", callback);
		}).catch(function(err) {
			self._error(err, callback);
		});
	};

	/**
	 * Moves an item to the end of the actual list, assuming it existed in the
	 * archive list, and marks it as undone.
	 *
	 * @param {string} list The name of the list that contains the item
	 * @param {string} item The name of the item to move
	 * @param {func(mixed)} callback The callback to be called. Will receive null on error
	 * @return true
	 */
	this.retrieveItem = function(list, item, callback) {
		localforage.getItem(LIST_PREF+list).then(function(listContents) {
			// Delete the item from the archive list
			var index = listContents[ARCHIVE_KEY].indexOf(item);
			if (index != -1) {
				listContents[ARCHIVE_KEY].splice(index, 1);
				// Add it to the end of the actual list
				listContents[ACTUAL_KEY].push(item);
				// Mark the item as not done
				itemGateway.changeItemStatus(list, item, false, function() {
					// Save the list again
					localforage.setItem(LIST_PREF+list, listContents)
							.then(callback).catch(function(err) {
						self._error(err, callback);
					});
				});
			}
			else self._error("List "+list+" doesn't contain any item "+item+".", callback);
		}).catch(function(err) {
			self._error(err, callback);
		});
	};

	/**
	 * Gets all items that this list contains. The callback will receive a List object
	 * as a first parameter.
	 *
	 * @param {string} list The name of the list to retrieve
	 * @param {func(List)} callback The callback to be called. Will receive null on error
	 * @return true
	 */
	this.getAllItems = function(listName, callback) {
		localforage.getItem(LIST_PREF+listName).then(function(listContents) {
			// Retrieve the items in the archive
			var archive = [];
			for (var i = 0; i < listContents[ARCHIVE_KEY].length; i++) {
				// We forge new items with done=false, as it is irrellevant for the items
				// in the archive (they are always retrieved from the archive as not done).
				var newItem = new Item(listContents[ARCHIVE_KEY][i], false);
				archive.push(newItem);
			}

			// Retrieve the rest of items
			var promises = [];
			for (var i = 0; i < listContents[ACTUAL_KEY].length; i++) {
				promises.push(itemGateway.getItem(listName, listContents[ACTUAL_KEY][i]));
			}
			// Wait for all of them
			Promise.all(promises).then(function(results) {
				var actual = [];
				// The array of values in results maintains the order of the original
				// iterable object promises as per the Promise.all specifications.
				for (var i = 0; i < results.length; i++) {
					actual.push(results[i]);
				}
				
				var list = new List(listName, actual, archive);
				callback(list);
			}).catch(function(err) {
				self._error(err, callback);
			});
		}).catch(function(err) {
			self._error(err, callback);
		});
	};

	/**
	 * Deletes an item from a list.
	 *
	 * @param {string} list The name of the list that contains the item
	 * @param {string} item The name of the item to remove
	 * @param {bool} isArchive Whether the list has the item in its archive sublist or not
	 * @param {func(mixed)} callback The callback to be called. Will receive null on error
	 * @return true
	 */
	this.deleteItem = function(listName, item, isArchive, callback) {
		localforage.getItem(LIST_PREF+listName).then(function(listContents) {
			// Choose sublist
			var key = ACTUAL_KEY;
			if (isArchive) key = ARCHIVE_KEY;

			// Delete the item
			var index = listContents[key].indexOf(item);
			listContents[key].splice(index, 1);
			var listUpdate = localforage.setItem(LIST_PREF+listName, listContents);
			var itemDeletion = itemGateway.deleteItem(listName, item);

			// Wait for both operations
			Promise.all([listUpdate, itemDeletion]).then(callback).catch(function(err) {
				self._error(err, callback);
			});
		});
	}

	/**
	 * Deletes the list and all its items in cascade from the storage.
	 *
	 * @param {string} listName The name of the list to delete
	 * @param {func(mixed)} callback The callback to be called. Will receive null on error
	 * @return true
	 */
	this.deleteList = function(listName, callback) {
		localforage.getItem(LIST_PREF+listName).then(function(list) {
			var items = _.union(list[ACTUAL_KEY], list[ARCHIVE_KEY]);
			var promises = [];

			// Remove the list
			promises.push(localforage.removeItem(LIST_PREF+listName));

			// Delete all the items in the list
			for (var i = 0; i < items.length; i++) {
				promises.push(itemGateway.deleteItem(listName, items[i]));
			}

			// Wait for all the operations to finish
			Promise.all(promises).then(callback).catch(function(err) {
				self._error(err, callback);
			});
		});
		return true;
	};



	// Get all and only the public functions (Those that don't start with "_")
	var listGateway = _.omit(this, function(value, key, object) {
		return key.indexOf("_") == 0;
	});
	return listGateway;
};