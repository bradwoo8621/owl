const path = require('path');

const {BrowserWindow, remote, app} = require('electron');

const getCurrentWindow = function() {
	return BrowserWindow ? BrowserWindow.getFocusedWindow() : remote.getCurrentWindow();
};

const getApp = function() {
	return app ? app : remote.app;
};

const relocate = function(file, absolute) {
	if (absolute) {
		getCurrentWindow().loadURL(path.join('file://', file));
	} else {
		getCurrentWindow().loadURL(path.join('file://', getApp().getAppPath(), file));
	}
};

module.exports = {
	relocate: relocate,
	currentWindow: getCurrentWindow,
	app: getApp
};