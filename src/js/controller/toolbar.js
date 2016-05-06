'use strict';

module.exports = function($scope, $mdMenu, $mdDialog, $mdToast, storage){
	var _ = require('underscore');
	var angular = require('angular');
	$scope.lists = [];

	var self = this;

	// Initialize the app looking for the list of lists and the currently selected list
	storage.getLists(function(lists) {
		storage.getSelectedList(function(currentList) {
			$scope.$apply(function() {
				$scope.lists = lists;
				$scope.currentList = currentList;
				// The parent controller will propagate this change in order to show the list's products
				self.onListChange({list: currentList, updateProducts: true});
			});
		});
	});

	$scope.openMenu = function($mdOpenMenu, ev) {
		$mdOpenMenu(ev);
	};

	// Switches current list from the select menu on top
	$scope.switchList = function($event, list) {
		// Wait for the menu to close before switching current list
		$mdMenu.hide().then(function() {
			$scope.currentList = list;
			self.onListChange({list: list, updateProducts: true});
			storage.selectList(list, angular.noop);
		});
	};

	// Shows a dialog asking to insert the name for the new list
	$scope.showPrompt = function($event) {
		var DialogController = require('./new-list-dialog');
		var confirm = $mdDialog.show({
			controller: DialogController,
			controllerAs: "ctrl",
			templateUrl: './views/new-list-dialog.html',
			clickOutsideToClose: true,
			targetEvent: $event,
			ariaLabel: 'List name',
			parent: angular.element(document.body),
			locals: {
				title: "Name the new list",
				label: "List name",
				acceptBtn: "Add",
				initialName: "",
				uniques: $scope.lists,
				autocompleteItems: []
			}
		})
		.then(function(result) {
			$scope.lists.push(result);
			$scope.currentList = result;
			// Make sure the list of items is updated AFTER the list has been created
			storage.addList(result, function() {
				$scope.$apply(function() {
					self.onListChange({list: result, updateProducts: true});
				});
			});
			storage.selectList(result, angular.noop);
		});
	};

	$scope.editList = function($event, list) {
		var DialogController = require('./new-list-dialog');
		var confirm = $mdDialog.show({
			controller: DialogController,
			controllerAs: "ctrl",
			templateUrl: './views/new-list-dialog.html',
			clickOutsideToClose: true,
			targetEvent: $event,
			ariaLabel: 'List name',
			parent: angular.element(document.body),
			locals: {
				title: "Rename the list",
				label: "List name",
				acceptBtn: "Rename",
				initialName: list,
				uniques: $scope.lists,
				autocompleteItems: []
			}
		})
		.then(function(result) {
			var index = $scope.lists.indexOf(list);
			$scope.lists[index] = result;
			$scope.currentList = result;
			self.onListChange({list: result, updateProducts: false});
			storage.changeListName(list, result, angular.noop);
			storage.selectList(result, angular.noop);
		})
	}

	$scope.deleteList = function(ev, list) {
		var listToDelete = $scope.currentList;
		// Delete the list from the app
		$scope.lists.splice($scope.lists.indexOf(listToDelete), 1);
		$scope.currentList = $scope.lists[0];
		self.onListChange({list: $scope.lists[0], updateProducts: true});
		// Show toast with UNDO action
		var toast =	$mdToast.simple()
			.textContent('List deleted')
			.position('top right')
			.hideDelay(5000)
			.action('UNDO')
			.highlightAction(true)
			.highlightClass('md-warn');
		$mdToast.show(toast).then(function(result) {
			if (result == 'ok') {
				// Restore the list in the app
				$scope.lists.push(listToDelete);
				$scope.currentList = listToDelete;
				self.onListChange({list: listToDelete, updateProducts: true});
			}
			else {
				// Remove definitely the list from storage
				storage.deleteList(listToDelete, angular.noop);
				storage.selectList($scope.currentList, angular.noop);
			}
		});
	};

	// Custom filter to select all array elements that do NOT match the pattern
	// Used to show all the lists except the current one
	$scope.listsFilter = function(actual, expected) {
		return actual != expected;
	};

};