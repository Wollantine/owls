'use strict';

var angular = require('angular');
require('angular-material');
require('angular-messages');

require('../css/index.css');

var app = angular.module('owls', ['ngMaterial', 'ngMessages'])
	.config(function($mdThemingProvider) {
		$mdThemingProvider.theme('default')
			.primaryPalette('purple')
			.accentPalette('light-green');
});;

app.service('storage', require('./service/storage'));

require('./controller');


	// .controller('ToolbarCtrl', require('./toolbar'));
	// 	this.currentList = 0;
	// 	this.lists = ['Shopping List', 'Another List'];

	// 	var originatorEv;
	// 	this.openMenu = function($mdOpenMenu, ev) {
	// 		originatorEv = ev;
	// 		$mdOpenMenu(ev);
	// 	};

	// 	this.setList = function(list) {
	// 		this.currentList = list;
	// 	};

	// 	this.listsFilter = function(actual, expected) {
	// 		console.log(actual+" "+expected);
	// 		return actual != expected;
	// 	};

	// 	originatorEv = null;
	// });