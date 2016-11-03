import electron from 'electron'

class Commander {
	static HOME = 'cmd-home'
	sendToWindow(window, command) {
		if (window) {
			window.webContents.send(command);
		}
	}
	reload(window) {
		if (window) {
			window.reload();
		}
	}
	toggleDevTools(window) {
		if (window) {
			window.toggleDevTools();
		}
	}
	openExternalURL(url) {
		electron.shell.openExternal(url);
	}
}

export {Commander}

