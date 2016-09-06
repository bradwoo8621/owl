const {dialog} = require('electron');

const afterDirOpen = function() {
	console.log(arguments);
}

module.exports = function() {
	dialog.showOpenDialog({
		properties: ['openDirectory', 'createDirectory']
	}, afterDirOpen);
};