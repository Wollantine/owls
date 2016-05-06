'use strict';

var localforage = require('localforage');
var _ = require('underscore');

/**                 LISTS GATEWAY                 **/
module.exports = function(errorManager, listGateway) {

	// Consts: DB's key names and prefixes
	var SELECTED_LIST = "selected-list";
	var LISTS_KEY = 'lists';

	// Starting lists
	var STARTING_LISTS = ['Shopping List'];

	var self = this;


	this._error = function(err, callback) {
		errorManager.error(err, callback);
	};

	/**
	 * Adds an empty list to the stored ones if the list name does not exist.
	 * Otherwise it shows an error.
	 *
	 * @param {func(mixed)} callback The callback to be called. Will receive null on error
	 * @return true
	 */
	this.addList = function(listName, callback) {
		var error = false;
		localforage.getItem(LISTS_KEY).then(function(lists) {
			// If list exists show an error
			if (lists !== null && lists.indexOf(listName) != -1) {
				error = true;
				self._error("List name already exists", callback);
			}
			else {
				if (lists === null) lists = [];
				// Add list to set of lists
				lists.push(listName);
				var addList = localforage.setItem(LISTS_KEY, lists);
				
				// Create and store an empty list
				var createList = listGateway.createList(listName);

				// Wait for both operations to finish
				Promise.all([addList, createList]).then(callback).catch(function(err) {
					error = true;
					self._error(err, callback);
				});
			}
		}).catch(function(err) {
			error = true;
			self._error(err, callback);
		});
		return true;
	};

	/**
	 * Changes the currently selected list to list.
	 *
	 * @param {string} list The new list to select.
	 * @param {func(mixed)} callback The callback to be called. Will receive null on error
	 * @return true
	 */
	this.selectList = function(list, callback) {
		localforage.setItem(SELECTED_LIST, list).then(callback).catch(function(err) {
			self._error(err, callback);
		});
		return true;
	};

	/**
	 * Gets the currently selected list.
	 *
	 * @param {func(mixed)} callback The callback to be called. Will receive null on error
	 * @return true
	 */
	this.getSelectedList = function(callback) {
		localforage.getItem(SELECTED_LIST).then(function(value) {
			callback(value);
		}).catch(function(err) {
			self._error(err, callback);
		});
		return true;
	};

	/**
	 * IMPORTANT NOTE: This should be the first function called.
	 * Gets the array of lists stored in the device. If no lists are present,
	 * it creates a set of starting lists that the user can change later.
	 * The starting list is defined in STARTING_LISTS.
	 *
	 * @param {func(mixed)} callback The callback that will receive the values
	 * @return true
	 */
	this.getLists = function(callback) {
		var error = false;
		localforage.getItem(LISTS_KEY).then(function(values){
			// If this is the first use, initialize starting lists
			if (values === null) {
				for (var i = STARTING_LISTS.length - 1; i >= 0; i--) {
					self.addList(STARTING_LISTS[i], function(result) {
						if (result === null) error = true;
					});
				}
				self.selectList(STARTING_LISTS[0], function(){
					callback(STARTING_LISTS);
				});
			}
			// Otherwise return existing lists
			else {
				callback(values);
			}
		}).catch(function(err) {
			error = true;
			self._error(err, callback);
		});
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
		var error = false;
		localforage.getItem(LISTS_KEY).then(function(lists) {
			// If list exists show an error
			if (lists.indexOf(newName) != -1) {
				error = true;
				self._error("List name already exists", callback);
			}
			else {
				// Change the name in the set of lists
				lists[lists.indexOf(list)] = newName;
				var changeListName = localforage.setItem(LISTS_KEY, lists);

				// Change the key of the list to keep consistency
				listGateway.changeListName(list, newName, function(res) {
					changeListName.then(callback).catch(function(err) {
						self._error(err, callback);
					});
				});
			}
		}).catch(function(err) {
			error = true;
			self._error(err, callback);
		});
		return true;
	};

	/**
	 * Deletes the list and all its items in cascade from the storage.
	 *
	 * @param {array} list The name of the list to delete
	 * @param {func(mixed)} callback The callback to be called. Will receive null on error
	 * @return true
	 */
	this.deleteList = function(list, callback) {
		var error = false;
		localforage.getItem(LISTS_KEY).then(function(lists) {
			var index = lists.indexOf(list);
			// Remove the name from the set of lists
			lists.splice(index, 1);
			var removeListName = localforage.setItem(LISTS_KEY, lists);
			// Remove the list
			listGateway.deleteList(list, function() {
				removeListName.then(callback).catch(function(err) {
					error = true;
					self._error(err, callback);
				});
			});
		}).catch(function(err) {
			error = true;
			self._error(err, callback);
		});
		return true;
	};

	// Get all and only the public functions (Those that don't start with "_")
	var listsGateway = _.omit(this, function(value, key, object) {
		return key.indexOf("_") == 0;
	});
	return listsGateway;

};