'use strict';

var List = function(name, items, archive) {

	/**
	 * @attr {string} name The name of the list
	 */
	this.name = name;

	/**
	 * @attr {array(Item)} items The list of current doable items
	 */
	this.items = items;

	/**
	 * @attr {array(Item)} archive The list of archived items
	 */
	this.archive = archive;
};

module.exports = List;