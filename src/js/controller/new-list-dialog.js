'use strict';

module.exports = function($scope, $mdDialog) {

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
	$scope.answer = function(answer) {
	    $mdDialog.hide(answer);
	};

	$scope.listName = '';
	// $scope.listNameIsUnique = function() {
	// 	return true;
	// }

}