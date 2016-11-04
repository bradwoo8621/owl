const electron = require('electron');
const {Commander, Commands} = require('../common/commander');

let commander = new Commander();

class Menus {
	getMenuTemplate() {
		return [
			this.getFileMenu(),
			this.getViewMenu(),
			this.getWindowMenu(),
			this.getHelpMenu()
		];
	}
	// file
	getFileMenu() {
		return {
			label: '&File',
			submenu: [
				this.getExitWorkingFolderMenu(),
				this.getSeparatorLine(),
				this.getCloseMenu()
			]
		};
	}
	getExitWorkingFolderMenu() {
		return {
			label: 'Exit Working Folder...',
			accelerator: 'CmdOrCtrl+Alt+W',
			click(item, focusedWindow) {
				commander.sendToWindow(focusedWindow, Commands.Home);
			}
		};
	}
	getCloseMenu() {
		return {role: 'close'};
	}
	// view
	getViewMenu() {
		return {
			label: '&View',
			submenu: [
				this.getReloadMenu(),
				this.getDeveloperToolsMenu(),
				this.getSeparatorLine(),
				this.getResetZoomMenu(),
				this.getZoomInMenu(),
				this.getZoomOutMenu(),
				this.getSeparatorLine(),
				this.getToggleFullScreenMenu()
			]
		};
	}
	getReloadMenu() {
		return {
			label: 'Reload',
			accelerator: 'CmdOrCtrl+R',
			click (item, focusedWindow) {
				commander.reload(focusedWindow);
			}
		};
	}
	getDeveloperToolsMenu() {
		return {
			label: 'Toggle Developer Tools',
			accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
			click (item, focusedWindow) {
				commander.toggleDevTools(focusedWindow);
			}
		};
	}
	getResetZoomMenu() {
		return {role: 'resetzoom'}
	}
	getZoomInMenu() {
		return {role: 'zoomin'};
	}
	getZoomOutMenu() {
		return {role: 'zoomout'};
	}
	getToggleFullScreenMenu()  {
		return {role: 'togglefullscreen'};
	}
	getWindowMenu() {
		return {
			label: '&Window',
			submenu: [
				this.getMinimizeMenu()
			]
		};
	}
	getMinimizeMenu() {
		return {role: 'minimize'};
	}
	getHelpMenu() {
		return {
			label: '&Help',
			submenu: [
				this.getLearnMoreAboutOwlMenu(),
				this.getLearnMoreAboutParrot2Menu(),
				this.getLearnMoreAboutElectronMenu()
			]
		};
	}
	getLearnMoreAboutOwlMenu() {
		return {
			label: 'OWL @ Github',
			click() {
				commander.openExternalURL('https://github.com/bradwoo8621/owl');
			}
		};
	}
	getLearnMoreAboutParrot2Menu() {
		return {
			label: 'Nest-Parrot2 @ Github',
			click() {
				commander.openExternalURL('https://github.com/bradwoo8621/parrot2');
			}
		};
	}
	getLearnMoreAboutElectronMenu() {
		return {
			label: 'Learn More about Electron',
			click() { 
				commander.openExternalURL('http://electron.atom.io');
			}
		};
	}
	getSeparatorLine() {
		return {type: 'separator'};
	}
}

module.exports = {Menus}