'use strict';

module.exports = function($scope, $mdDialog, $mdToast) {
	
	var angular = require('angular');
	var _ = require('underscore');

	$scope.items = [
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

	$scope.addItem = function($event) {
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
				uniques: [],
				autocompleteItems: _.pluck($scope.archivedItems, 'name')
			}
		})
		.then(function(result) {
			var newItem = result.trim();
			// Find if the item exists
			var findInLowerCase = function(item) {
				return item.name.toLowerCase() == newItem.toLowerCase();
			};
			var archivePos = _.findIndex($scope.archivedItems, findInLowerCase);
			var toastText = "Item added";
			
			// If item exists and is archived
			if (archivePos != -1) {
				// Move the item to pending
				var item = $scope.archivedItems.splice(archivePos, 1)[0];
				item.done = false;
				$scope.items.push(item);
				toastText = "Item moved from archive";
			}
			else {
				// If it is in the current list
				var itemPos = _.findIndex($scope.items, findInLowerCase);
				if (itemPos != -1) {
					// Tag the item as pending
					$scope.items[itemPos].done = false;
					toastText = "Item marked as undone";
				}
				// Otherwise add it to pending items
				else {
					var item = {name: newItem, done: false};
					$scope.items.push(item);
				}
			}
			// Show toast
			var toast = $mdToast.simple()
				.textContent(toastText)
				.position('top right')
				.hideDelay(5000);
			$mdToast.show(toast);
		});
	};
};