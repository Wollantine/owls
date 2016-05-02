'use strict';

var app = require('angular').module('owls');

app.controller('MainCtrl', function() {
	this.currentList = 0;
	// this.onListChange

});

app.controller('ToolbarCtrl', require('./toolbar'));
app.controller('ListCtrl', require('./list'));

app.component('toolbar', {
	controller: 'ToolbarCtrl',
	templateUrl: './views/toolbar.html'//,
	// bindings: {
	// 	onListChange: '&'
	// }
});

app.component('itemList', {
	controller: 'ListCtrl',
	templateUrl: './views/list.html'
})