'use strict';

var app = require('angular').module('owls');

app.controller('MainCtrl', function(storage) {
	var self = this;

	this.currentList = '';
	this.list = ["hola", "adeu"];
	this.updateProducts = true;

	this.onListChange = function(list, updateProducts) {
		self.currentList = list;
		self.list.push(list);
		console.log(self.currentList+"  "+self.updateProducts);
	}

});

app.controller('ToolbarCtrl', require('./toolbar'));
app.controller('ListCtrl', require('./list'));

app.component('toolbar', {
	controller: 'ToolbarCtrl',
	templateUrl: './views/toolbar.html',
	bindings: {
		onListChange: '&'
	}
});

app.component('itemList', {
	controller: 'ListCtrl',
	templateUrl: './views/list.html',
	bindings: {
		list: '<'
	}
})