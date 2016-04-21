'use strict';


/**
 *	DialogController
 *
 *	Controls a dialog for adding or editing names of objects in lists.
 *	title, label and acceptBtn configure the dialog's labels.
 *	uniques is the list of names the object can not have and therefore
 *	the dialog will complain about the name not being unique.
 */
module.exports = function($scope, $mdDialog, title, label, acceptBtn, initialName, uniques) {

	$scope.title = title;
	$scope.label = label;
	$scope.acceptBtn = acceptBtn;
	$scope.objName = initialName;

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

	$scope.lobjName = '';
	// $scope.listNameIsUnique = function() {
	// 	return true;
	// }

}