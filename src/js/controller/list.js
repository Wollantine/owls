'use strict';

module.exports = function($scope, $mdDialog) {
	
	var angular = require('angular');

	$scope.actualItems = [
		{name:'Bread', done: false},
		{name:'Salmon', done: true},
		{name:'Salad', done: false},
		{name:'Milk', done: false},
		{name:'Ham', done: false}
	];
	$scope.archivedItems = [
		{name:'Tuna', done: false},
		{name:'Tomato', done: false},
		{name:'Yogurts', done: true},
		{name:'Beer', done: true},
		{name:'Pineapple juice', done: false},
		{name:'Pizza', done: false},
		{name:'Noodles', done: true},
		{name:'Eggs', done: false},
		{name:'Corn', done: true},
		{name:'Chicken', done: true},
		{name:'Pasta', done: false},
		{name:'Cheese', done: false},
		{name:'Fuet', done: false},
		{name:'Kitchen tissue', done: false},
		{name:'Wine', done: false},
		{name:'Hot dogs', done: false},
		{name:'Shower gel', done: false},
		{name:'Shampoo', done: false},
		{name:'Potatoes', done: false},
		{name:'Deodorant', done: false},
		{name:'Nutella', done: false},
		{name:'Biscuits', done: false}
	];

	$scope.addItem = function() {
		var DialogController = require('./new-list-dialog.js');
		var confirm = $mdDialog.show({
			controller: DialogController,
			templateUrl: 'src/views/new-list-dialog.html',
			clickOutsideToClose: true,
			targetEvent: $event,
			ariaLabel: 'Item name',
			parent: angular.element(document.body),
			locals: {
				title: "Name the new item",
				label: "Item name",
				acceptBtn: "Add",
				initialName: "",
				uniques: []
			}
		})
		.then(function(result) {
			$scope.lists.push(result);
			$scope.currentList = result;
			storage.addList(result, angular.noop);
		});
	}
};