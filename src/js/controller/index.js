'use strict';

require('angular-material');
require('angular-messages');

var app = require('angular').module('owls', ['ngMaterial', 'ngMessages'])
	.config(function($mdThemingProvider) {
		$mdThemingProvider.theme('default')
			.primaryPalette('purple')
			.accentPalette('light-green');
});

app.controller('MainCtrl', function() {
	this.currentList = 0;
	// this.onListChange

})

app.controller('ToolbarCtrl', require('./toolbar'));

app.component('toolbar', {
	controller: 'ToolbarCtrl',
	templateUrl: 'src/views/toolbar.html'//,
	// bindings: {
	// 	onListChange: '&'
	// }
});