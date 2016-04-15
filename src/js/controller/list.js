'use strict';

module.exports = function($scope) {
	
	var angular = require('angular');

	$scope.archivedItems = [
		{name:'Tomàquet', done: false},
		{name:'Pa quadrat', done: true},
		{name:'Pa rodó', done: false},
		{name:'Llet', done: false},
		{name:'Iogurts', done: true},
		{name:'Birres', done: true},
		{name:'Sucs', done: false},
		{name:'Xocolata', done: false},
		{name:'Croisanets', done: false},
		{name:'Fuet', done: true},
		{name:'Galetes', done: false}
	];
	$scope.actualItems = [
		{name:'Tonyina', done: false},
		{name:'Pernil dolç', done: true}
	];
};