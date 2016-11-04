const path = require('path');
const {Commands} = require('../../common/commander');

const {BrowserWindow, remote, app, ipcRenderer} = require('electron');

class Router {
	getCurrentWindow() {
		return BrowserWindow ? BrowserWindow.getFocusedWindow() : remote.getCurrentWindow();
	}
	getApp() {
		return app ? app : remote.app;
	}
	relocate(file, absolute) {
		if (absolute) {
			this.getCurrentWindow().loadURL(path.join('file://', file));
		} else {
			this.getCurrentWindow().loadURL(path.join('file://', this.getApp().getAppPath(), file));
		}
		return this;
	}
	initialize() {
		ipcRenderer.on(Commands.Home, () => {
			this.relocate('/app/renderer-process/home.html');
		});
		return this;
	}
}

module.exports = new Router().initialize();