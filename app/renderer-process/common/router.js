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
			this.getCurrentWindow().loadURL(this.pathAbsolute(file));
		} else {
			this.getCurrentWindow().loadURL(this.pathRelativeToApp(file));
		}
		return this;
	}
	pathAbsolute(file) {
		return path.join('file://', file);
	}
	pathRelativeToApp(file) {
		return path.join('file://', this.getApp().getAppPath(), 'app', file);
	}
	initialize() {
		ipcRenderer.on(Commands.HOME, () => {
			this.relocate('/app/renderer-process/home.html');
		});
		return this;
	}
	createBrowserWindow(windowOptions) {
		return BrowserWindow ? new BrowserWindow(windowOptions) : new remote.BrowserWindow(windowOptions);
	}
	openParrtoHelp(hash) {
		let windowOptions = {
			width: 1200,
			minWidth: 1200,
			minHeight: 600,
			title: 'Nest-Parrot2',
			show: false,
			center: true,
			webPreferences: {
				webSecurity: false,
				experimentalFeatures: true
			}
		};
		let html = this.pathRelativeToApp('./renderer-process/parrot-help.html');
		if (!this.parrotHelpWindow) {
			this.parrotHelpWindow = this.createBrowserWindow(windowOptions);
			this.parrotHelpWindow.setMenu(null);
			this.parrotHelpWindow.loadURL(html);
			this.parrotHelpWindow.on('closed', () => {
				this.parrotHelpWindow = null;
			});
			this.parrotHelpWindow.once('ready-to-show', (evt) => {
				this.parrotHelpWindow.show();
			});
			this.parrotHelpWindow.webContents.once('did-finish-load', () => {
				this.parrotHelpWindow.webContents.send(Commands.SCROLL_TO, hash);
			})
		} else {
			this.parrotHelpWindow.webContents.send(Commands.SCROLL_TO, hash);
			this.parrotHelpWindow.show();
		}
		return this.parrotHelpWindow;
	}
}

module.exports = new Router().initialize();