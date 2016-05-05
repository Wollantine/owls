'use strict';

var localforage = require('localforage');

/**************************************************/
/*************      STORAGE FACADE      ***********/
/**************************************************/
/*
	This service implements a facade for the 
	different gateways for each table in the
	storage database (lists, list and item):
 _______               ______                ______
|       |      -lists |      |       -items |      |
| Lists |<>---------->| List |<>----------->| Item |
|_______| 1         * |______| 1          * |______|
                          V                    ^ -archive
                          |1                  *|
                          ----------------------

*/

module.exports = function(listsGateway, listGateway, itemGateway) {

	// getLists MUST be the first function called, as it makes sure
	// the storage has been set up in this device with the initial items.
	this.init = false;
	var self = this;

	// Configure the local storage driver
	localforage.config({
		name: 'OWLS storage'
	});

	/**
	 * Adds an empty list to the stored ones if the list name does not exist.
	 * Otherwise it shows an error.
	 *
	 * @param {func(mixed)} callback The callback to be called. Will receive null on error
	 * @return true
	 */
	this.addList = function(listName, callback) {
		if (!this.init) {
			this.getLists(function() {
				self.init = listsGateway.addList(listName, callback);
			});
		}
		else listsGateway.addList(listName, callback);
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
		if (!this.init) {
			this.getLists(function() {
				self.init = listsGateway.selectList(list, callback);
			});
		}
		else listsGateway.selectList(list, callback);
		return true;
	};

	/**
	 * Gets the currently selected list.
	 *
	 * @param {func(mixed)} callback The callback to be called. Will receive null on error
	 * @return true
	 */
	this.getSelectedList = function(callback) {
		if (!this.init) {
			this.getLists(function() {
				self.init = listsGateway.getSelectedList(callback);
			});
		}
		else listsGateway.getSelectedList(callback);
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
	this.getLists = function(callback) {
		return listsGateway.getLists(callback);
	};


	/**
	 * Changes the name of the list if the new name does not exist
	 * Otherwise it shows an error.
	 *
	 * @param {func(mixed)} callback The callback to be called on success
	 * @return true
	 */
	this.changeListName = function(list, newName, callback) {
		if (!this.init) {
			this.getLists(function() {
				self.init = listsGateway.changeListName(list, newName, callback);
			});
		}
		else listsGateway.changeListName(list, newName, callback);
		return true;
	};

	/**
	 * Deletes the list and all its items in cascade from the storage.
	 *
	 * @param {array} list The name of the list to delete
	 * @param {func(mixed)} callback The callback to be called on success
	 * @return true
	 */
	this.deleteList = function(list, callback) {
		if (!this.init) {
			this.getLists(function() {
				self.init = listsGateway.deleteList(list, callback);
			});
		}
		else listsGateway.deleteList(list, callback);
		return true;
	};


	return this;
};