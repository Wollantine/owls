'use strict';
	
var app = require('angular').module('owls');

app.service('errorManager', require('./error-manager'));
app.service('itemGateway', ['errorManager', require('./item-gateway')]);
app.service('listGateway', ['errorManager', 'itemGateway', require('./list-gateway')]);
app.service('storage', ['listGateway', 'itemGateway', require('./storage')]);