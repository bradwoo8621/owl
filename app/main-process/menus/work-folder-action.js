const route = require('../../route');

const exit = function() {
	route.relocate('/app/index.html');
};

module.exports = {
	exit: exit
};