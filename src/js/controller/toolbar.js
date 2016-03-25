'use strict';

module.exports = function($scope){
	this.currentList = 0;
	this.lists = ['Shopping List', 'Another List'];

	var originatorEv;
	this.openMenu = function($mdOpenMenu, ev) {
		originatorEv = ev;
		$mdOpenMenu(ev);
	};

	this.setList = function(list) {
		this.currentList = list;
	};

	this.listsFilter = function(actual, expected) {
		return actual != expected;
	};

	originatorEv = null;
};