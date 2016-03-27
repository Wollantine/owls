'use strict';

module.exports = function($scope) {

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

	$scope.listName = '';
	// $scope.listNameIsUnique = function() {
	// 	return true;
	// }

}