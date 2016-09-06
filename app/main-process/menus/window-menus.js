const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;

const config = require('../../config');

const langAction = require('./language-action');
const workFolderAction = require('./work-folder-action');

const template = function() {
	const langMenu = function() {
		return {label: 'Languages',
			submenu: [
				{label: 'English', locale: 'en-US'},
				{label: 'Simplified Chinese', locale: 'zh-CN'},
				{label: 'Traditional Chinese', locale: 'zh-TW'}
			].map(function(menu) {
				return {
					label: menu.label,
					type: 'radio',
					checked: config.is(config.SYS_LOCALE, menu.locale),
					click: langAction(menu.locale)
				};
			})
		}
	};
	const menuTemplate = [{
		label: '&File',
		submenu: [{
			label: 'Exit Working Folder...',
			accelerator: 'CmdOrCtrl+X',
			click (item, focusedWindow) {
				workFolderAction.exit();
			}
		}, {
			type: 'separator'
		}, {
			role: 'close'
		}]
	}, {
		label: 'View',
		submenu: [{
			label: 'Reload',
			accelerator: 'CmdOrCtrl+R',
			click (item, focusedWindow) {
				if (focusedWindow) {
					focusedWindow.reload();
				}
			}
		}, {
			label: 'Toggle Developer Tools',
			accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
			click (item, focusedWindow) {
				if (focusedWindow) {
					focusedWindow.webContents.toggleDevTools();
				}
			}
		}, {
			type: 'separator'
		}, {
			role: 'resetzoom'
		}, {
			role: 'zoomin'
		}, {
			role: 'zoomout'
		}, {
			type: 'separator'
		}, {
			role: 'togglefullscreen'
		}]
	}, {
		role: 'window',
		submenu: [{
			role: 'minimize'
		}, langMenu()]
	}, {
		label: '&Help',
		submenu: [{
			label: 'Learn More',
			click() { 
				require('electron').shell.openExternal('http://electron.atom.io');
			}
		}]
	}];

	return menuTemplate;
}

module.exports = template;
