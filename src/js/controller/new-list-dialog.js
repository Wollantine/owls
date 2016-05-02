'use strict';

/**
 *	DialogController
 *
 *	Controls a dialog for adding or editing names of objects in lists.
 *	title, label and acceptBtn configure the dialog's labels.
 *	uniques is the list of names the object can not have and therefore
 *	the dialog will complain about the name not being unique. Caps are
 *	ignored for uniqueness.
 *	In case autocompleteItems contains one or more elements, an autocompleter
 *	for those values will be shown instead of an input.
 */
module.exports = function($scope, $mdDialog, title, label, acceptBtn, initialName, uniques, autocompleteItems) {

	$scope.title = title;
	$scope.label = label;
	$scope.acceptBtn = acceptBtn;

	this.objName = initialName;
	var self = this;

	// Autocompleter conf
	$scope.autocomplete = autocompleteItems.length > 0;
	if ($scope.autocomplete) {
		$scope.autocompleteItems = autocompleteItems.map(function(item) {
			return {
				value: item.toLowerCase(),
				display: item
			};
		});
	}

	// var app = require('angular').module('owls').directive('uniqueList', function() {
	// 	return {
	// 		require: 'ngModel',
	// 		link: function(scope, element, attr, mCtrl) {
	// 			function validateUniqueList(value) {
	// 				console.log(value);
	// 				console.log("hola");
	// 				if (value.indexOf('e') > -1) {
	// 					mCtrl.$setValidity('unique-list', true);
	// 				} 
	// 				else {
	// 					mCtrl.$setValidity('unique-list', false);
	// 				}
	// 				return value;
	// 			}
	// 			mCtrl.$parsers.push(validateUniqueList);
	// 		}
	// 	};
	// });

	$scope.hide = function() {
	    $mdDialog.hide();
	};
	$scope.cancel = function() {
	    $mdDialog.cancel();
	};
	$scope.answer = function() {
	    $mdDialog.hide(self.objName);
	};

	// $scope.listNameIsUnique = function() {
	// 	return true;
	// }

	$scope.querySearch = function(query) {
		var results = $scope.autocompleteItems;
		if (query) {
			var lowerCaseQuery = query.toLowerCase();
			results = $scope.autocompleteItems.filter(function(item) {
				// Filter that checks if the item begins with the query text
				return item.value.indexOf(lowerCaseQuery) === 0;
			});
		}
		return results;
	};

}