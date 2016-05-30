'use strict';

var Item = function(name, done) {

	/**
	 * @attr {string} name The name of the item
	 */
	this.name = name;

	/**
	 * @attr {boolean} done Whether the item is marked as done or not. 
	 *	Not in use with archived items
	 */
	this.done = done;
};

module.exports = Item;