'use strict';

var app = require('angular').module('owls');

app.controller('MainCtrl', function(storage) {
	var self = this;

	// This attribute is watched by ListCtrl.
	// Every time the name changes and an item update is needed, ListCtrl
	// will update the item list.
	this.currentList = {name: null, updateItems: false};

	// This operation will get called when appropriate by ToolbarCtrl.
	this.onListChange = function(list, updateItems) {
		self.currentList.name = list;
		self.currentList.updateItems = updateItems;
		console.log(self.currentList.name+"  "+self.currentList.updateItems);
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