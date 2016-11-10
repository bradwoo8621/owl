const electron = require('electron');

class Commander {
	sendToWindow(window, command) {
		if (window) {
			window.webContents.send(command);
		}
		return this;
	}
	reload(window) {
		if (window) {
			window.reload();
		}
		return this;
	}
	toggleDevTools(window) {
		if (window) {
			window.toggleDevTools();
		}
		return this;
	}
	toggleFullScreen(window) {
		if (window) {
			window.setFullScreen(!window.isFullScreen());
		}
		return this;
	}
	toggleMenuBar(window) {
		if (window) {
			window.setMenuBarVisibility(!window.isMenuBarVisible());
		}
		return this;
	}
	openExternalURL(url) {
		electron.shell.openExternal(url);
		return this;
	}
}

const Commands = {
	HOME: 'cmd-home',

	TOGGLE_SIDE_BAR: 'cmd-toggle-side-bar',
	TOGGLE_BOTTOM_BAR: 'cmd-toggle-bottom-bar',

	SCROLL_TO: 'cmd-scroll-to'
};

module.exports = {
	Commander,
	Commands
};

