'use strict';

var localforage = require('localforage');

module.exports = function() {

	// Consts: DB's key names and prefixes
	var LISTS_KEY = 'lists';
	var LIST_PREF = 'list-';
	var PROD_PREF = 'prod-';
	var ACTUAL_KEY = 'actual';
	var ARCHIVE_KEY = 'archive';

	// Starting lists
	var STARTING_LISTS = ['Shopping List'];

	// Configure the local storage driver
	localforage.config({
		name: 'OWLS storage'
	});


	var _error = function(err, callback) {
		console.log(err);
		callback(null);
	};

	/**
	 * Adds an empty list to the stored ones if the list name does not exist.
	 * Otherwise it shows an error.
	 *
	 * @param {func(mixed)} callback The callback to be called on success
	 * @return true
	 */
	var addList = function(listName, callback) {
		var error = false;
		localforage.getItem(LISTS_KEY).then(function(lists) {
			// If list exists show an error
			if (lists !== null && lists.indexOf(listName) != -1) {
				error = true;
				_error("List name already exists", callback);
			}
			else {
				if (lists === null) lists = [];
				// Add list to set of lists
				lists.push(listName);
				var addList = localforage.setItem(LISTS_KEY, lists);
				
				// Create and store an empty list
				var newList = {};
				newList[ACTUAL_KEY] = [];
				newList[ARCHIVE_KEY] = [];
				var createList = localforage.setItem(LIST_PREF+listName, newList);

				// Wait for both operations to finish
				Promise.all([addList, createList]).then(callback).catch(function(err) {
					error = true;
					_error(err, callback);
				});
			}
		}).catch(function(err) {
			error = true;
			_error(err, callback);
		});
		return true;
	};

	/**
	 * Gets the array of lists stored in the device. If no lists are present,
	 * it creates a set of starting lists that the user can change later.
	 * The starting list is defined in STARTING_LISTS.
	 *
	 * @param {func(mixed)} callback The callback that will receive the values
	 * @return true
	 */
	var getLists = function(callback) {
		var error = false;
		localforage.getItem(LISTS_KEY).then(function(values){
			// If this is the first use, initialize starting lists
			if (values === null) {
				for (var i = STARTING_LISTS.length - 1; i >= 0; i--) {
					addList(STARTING_LISTS[i], function(result) {
						if (result === null) error = true;
					});
				}
				callback(STARTING_LISTS);
			}
			// Otherwise return existing lists
			else {
				callback(values);
			}
		}).catch(function(err) {
			error = true;
			_error(err, callback);
		});
		return true;
	};

	/**
	 * Changes the name of the list if the new name does not exist
	 * Otherwise it shows an error.
	 *
	 * @param {func(mixed)} callback The callback to be called on success
	 * @return true
	 */
	var changeListName = function(list, newName, callback) {
		var error = false;
		localforage.getItem(LISTS_KEY).then(function(lists) {
			// If list exists show an error
			if (lists.indexOf(newName) != -1) {
				error = true;
				_error("List name already exists", callback);
			}
			else {
				// Change the name in the set of lists
				lists[lists.indexOf(list)] = newName;
				var changeListName = localforage.setItem(LISTS_KEY, lists);

				// Change the key of the list to keep consistency
				localforage.getItem(LIST_PREF+list).then(function(listContents) {
					var removeList = localforage.removeItem(LIST_PREF+list);
					var addList = localforage.setItem(LIST_PREF+newName, listContents);

					// Finally wait for all three operations to finish
					Promise.all([changeListName, removeList, addList]).then(callback).catch(function(err) {
						error = true;
						_error(err, callback);
					});
				}).catch(function(err) {
					error = true;
					_error(err, callback);
				});
			}
		}).catch(function(err) {
			error = true;
			_error(err, callback);
		});
		return true;
	};

	/**
	 * Deletes the list and all its products in cascade from the storage.
	 *
	 * @param {array} list The name of the list to delete
	 * @param {func(mixed)} callback The callback to be called on success
	 * @return true
	 */
	var deleteList = function(list, callback) {
		var error = false;
		localforage.getItem(LISTS_KEY).then(function(lists) {
			var index = lists.indexOf(list);
			// Remove the name from the set of lists
			var removeListName = localforage.setItem(LISTS_KEY, lists.splice(index, 1));
			// Remove the list
			var removeList = localforage.removeItem(LIST_PREF+list);

			// TODO Remove the products

			// Wait for the operations to finish
			Promise.all([removeListName, removeList]).then(callback).catch(function(err) {
				error = true;
				_error(err, callback);
			});
		}).catch(function(err) {
			error = true;
			_error(err, callback);
		});
		return true;
	};

	return {
		addList: addList,
		getLists: getLists,
		changeListName: changeListName,
		deleteList: deleteList
	};
};