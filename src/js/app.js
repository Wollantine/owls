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
});

require('./service');

require('./controller');