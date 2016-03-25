'use strict';

module.exports = function($scope, $mdMenu){
	this.currentList = 'Shopping List';
	this.lists = ['Shopping List', 'Another List'];

	var originatorEv;
	this.openMenu = function($mdOpenMenu, ev) {
		originatorEv = ev;
		$mdOpenMenu(ev);
	};

	this.switchList = function($event, list) {
		var self = this;
		$mdMenu.hide().then(function() {
			self.currentList = list;
		});
	};

	this.listsFilter = function(actual, expected) {
		return actual != expected;
	};

	originatorEv = null;
};