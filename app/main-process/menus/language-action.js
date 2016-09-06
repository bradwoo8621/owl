const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;

const config = require('../../config');

const menuSwitchTo = function(locale) {
	config.set(config.SYS_LOCALE, locale);
	BrowserWindow.getAllWindows().forEach(function(window) {
		window.reload();
		// window.webContents.send('switch-language', locale);
	});
};

module.exports = function(locale) {
	return function() {
		menuSwitchTo(locale);
	};
};