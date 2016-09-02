const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;

const template = function() {
	const langMenu = function() {
		const menuSwitchTo = function(locale) {
			global.envs.locale = locale;
			BrowserWindow.getAllWindows().forEach(function(window) {
				window.reload();
				// window.webContents.send('switch-language', locale);
			});
		};
		return {label: 'Languages',
			submenu: [
				{label: 'English', locale: 'en-US'},
				{label: 'Simplified Chinese', locale: 'zh-CN'},
				{label: 'Traditional Chinese', locale: 'zh-TW'}
			].map(function(menu) {
				return {
					label: menu.label,
					type: 'radio',
					checked: global.envs.locale === menu.locale,
					click: function() {
						menuSwitchTo(menu.locale);
					}
				};
			})
		}
	};
	const menuTemplate = [{
		label: '&File',
		submenu: [{
			label: 'Open Working Folder...',
			accelerator: 'CmdOrCtrl+O',
			click (item, focusedWindow) {
				// TODO open folder as working folder
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
