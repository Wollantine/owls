'use strict';

var localforage = require('localforage');
var _ = require('underscore');

/** STORAGE FACADE **/
module.exports = function(listGateway, itemGateway) {

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
		return listGateway.addList(listName, callback);
	};

	/**
	 * Changes the currently selected list to list.
	 *
	 * @param {string} list The new list to select.
	 * @param {func(mixed)} callback The callback to be called. Will receive null on error
	 * @return true
	 */
	this.selectList = function(list, callback) {
		return listGateway.selectList(list, callback);
	};

	/**
	 * Gets the currently selected list.
	 *
	 * @param {func(mixed)} callback The callback to be called. Will receive null on error
	 * @return true
	 */
	this.getSelectedList = function(callback) {
		return listGateway.getSelectedList(callback);
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
		return listGateway.getLists(callback);
	};


	/**
	 * Changes the name of the list if the new name does not exist
	 * Otherwise it shows an error.
	 *
	 * @param {func(mixed)} callback The callback to be called on success
	 * @return true
	 */
	this.changeListName = function(list, newName, callback) {
		return listGateway.changeListName(list, newName, callback);
	};

	/**
	 * Deletes the list and all its items in cascade from the storage.
	 *
	 * @param {array} list The name of the list to delete
	 * @param {func(mixed)} callback The callback to be called on success
	 * @return true
	 */
	this.deleteList = function(list, callback) {
		return listGateway.deleteList(list, callback);
	};


	return this;
};