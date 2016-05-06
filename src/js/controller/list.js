'use strict';

module.exports = function($scope, $mdDialog, $mdToast, storage) {
	
	var angular = require('angular');
	var _ = require('underscore');

	var self = this;

	$scope.items = [
		// {name:'Bread', done: false},
		// {name:'Salmon', done: true},
		// {name:'Salad', done: false},
		// {name:'Milk', done: false},
		// {name:'Ham', done: false}
	];
	$scope.archivedItems = [
		// {name:'Tuna', done: false},
		// {name:'Tomato', done: false},
		// {name:'Yogurts', done: true},
		// {name:'Beer', done: true},
		// {name:'Pineapple juice', done: false},
		// {name:'Pizza', done: false},
		// {name:'Noodles', done: true},
		// {name:'Eggs', done: false},
		// {name:'Corn', done: true},
		// {name:'Chicken', done: true},
		// {name:'Pasta', done: false},
		// {name:'Cheese', done: false},
		// {name:'Fuet', done: false},
		// {name:'Kitchen tissue', done: false},
		// {name:'Wine', done: false},
		// {name:'Hot dogs', done: false},
		// {name:'Shower gel', done: false},
		// {name:'Shampoo', done: false},
		// {name:'Potatoes', done: false},
		// {name:'Deodorant', done: false},
		// {name:'Nutella', done: false},
		// {name:'Biscuits', done: false}
	];

	// Watch the list, and update the products every time it changes and it is needed
	$scope.$watch(function() {
		return self.list.name;
	}, function() {
		if (self.list.updateItems) {
			console.log(self.list.name + "  " + self.list.updateItems)
			storage.getAllItems(self.list.name, function(list) {
				$scope.items = list.items;
				$scope.archivedItems = list.archive;
			});
		}
	});


	$scope.addItem = function($event) {
		var DialogController = require('./new-list-dialog.js');
		var confirm = $mdDialog.show({
			controller: DialogController,
			controllerAs: "ctrl",
			templateUrl: './views/new-list-dialog.html',
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
					storage.addItem($scope.list.name, newItem, angular.noop);
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

	/**
	 *	Archives an item from the main list and shows a toast with an UNDO action.
	 *
	 * @param {int} $index The index of the item that must be retrieved
	 */
	$scope.archiveItem = function($index) {
		// Archive item
		var item = $scope.items.splice($index, 1)[0];
		$scope.archivedItems.unshift(item);
		// Show toast with undo
		var toast = $mdToast.simple()
			.textContent('Archived '+item.name)
			.position('top right')
			.hideDelay(5000)
			.action('UNDO')
			.highlightAction(true)
			.highlightClass('md-warn');
		$mdToast.show(toast).then(function(result) {
			if (result == 'ok') {
				$scope.archivedItems.shift();
				$scope.items.splice($index, 0, item);
			}
			else {
				// TODO storage
				console.log('Archived item '+item.name);
			}
		});
	};

	/**
	 *	Retrieves an item from the archive back to the main list and shows a toast 
	 *	with an UNDO action. Also marks the item as undone.
	 *
	 * @param {int} $index The index of the item that must be retrieved
	 */
	$scope.retrieveItem = function($index) {
		// Retrieve item and mark it as undone
		var item = $scope.archivedItems.splice($index, 1)[0];
		var done = item.done;
		item.done = false;
		$scope.items.push(item);
		// Show toast with undo
		var toast = $mdToast.simple()
			.textContent('Retrieved '+item.name)
			.position('top right')
			.hideDelay(5000)
			.action('UNDO')
			.highlightAction(true)
			.highlightClass('md-warn');
		$mdToast.show(toast).then(function(result) {
			if (result == 'ok') {
				$scope.items.pop();
				item.done = done;
				$scope.archivedItems.splice($index, 0, item);
			}
			else {
				// TODO storage
				console.log('Retrieved item '+item.name);
			}
		});
	};

	/**
	 *	Deletes an item from the specified list and shows a toast with an UNDO action.
	 *
	 * @param {int} $index The index of the item that must be deleted
	 * @param {string} listName Either 'archive' or 'items' depending on which list 
	 *	the item must be deleted from. Defaults to 'items'.
	 */
	$scope.deleteItem = function($index, listName) {
		// Delete item
		var list = $scope.items;
		if (listName == 'archive') list = $scope.archivedItems;
		var item = list.splice($index, 1)[0];
		// Show toast with undo
		var toast = $mdToast.simple()
			.textContent('Deleted '+item.name)
			.position('top right')
			.hideDelay(5000)
			.action('UNDO')
			.highlightAction(true)
			.highlightClass('md-warn');
		$mdToast.show(toast).then(function(result) {
			if (result == 'ok') {
				list.splice($index, 0, item);
			}
			else {
				console.log('Deleted item '+item.name);
			}
		});
	};
};