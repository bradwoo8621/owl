const path = require('path');
const glob = require('glob');
const electron = require('electron');
const {Menu} = electron;
const menus = require('./main-process/menus/window-menus');

const config = require('./config');

const BrowserWindow = electron.BrowserWindow;
const app = electron.app;

const debug = /--debug/.test(process.argv[2]);

app.setName('Owl - Designer for Parrot');

let mainWindow = null;

function initialize () {
	let shouldQuit = makeSingleInstance();
	if (shouldQuit) {
		return app.quit();
	}

	// loadDemos();

	function createWindow () {
		let windowOptions = {
			// width: 1080,
			minWidth: 1024,
			minHeight: 700,
			// height: 840,
			title: app.getName(),
			show: false,
			webPreferences: {
				webSecurity: false
			}
		};

		if (!config.has(config.SYS_LOCALE)) {
			config.set(config.SYS_LOCALE, app.getLocale());
		}

		if (process.platform === 'linux') {
			windowOptions.icon = path.join(__dirname, './assets/app-icon/png/256.png');
		} else if (process.platform === 'win32') {
			windowOptions.icon = path.join(__dirname, './assets/app-icon/win/app.ico');
		}

		mainWindow = new BrowserWindow(windowOptions);
		mainWindow.loadURL(path.join('file://', __dirname, './index.html'));

		// Launch fullscreen with DevTools open, usage: npm run debug
		if (debug) {
			mainWindow.webContents.openDevTools();
		}
		// always maximize window
		mainWindow.maximize();

		const menu = Menu.buildFromTemplate(menus());
		Menu.setApplicationMenu(menu);

		mainWindow.on('closed', function () {
			mainWindow = null;
		});
		mainWindow.once('ready-to-show', (evt) => {
			mainWindow.show();
		});
	}

	app.on('ready', function () {
		createWindow();
	})

	app.on('window-all-closed', function () {
		if (process.platform !== 'darwin') {
			app.quit();
		}
	})

	app.on('activate', function () {
		if (mainWindow === null) {
			createWindow();
		}
	})
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance () {
	if (process.mas) {
		return false;
	}

	return app.makeSingleInstance(function () {
		if (mainWindow) {
			if (mainWindow.isMinimized()) {
				mainWindow.restore();
			}
			mainWindow.focus();
		}
	})
}

// Require each JS file in the main-process dir
// function loadDemos () {
// 	let files = glob.sync(path.join(__dirname, 'main-process/**/*.js'))
// 	files.forEach(function (file) {
// 		require(file)
// 	})
// }

// Handle Squirrel on Windows startup events
switch (process.argv[1]) {
	case '--squirrel-obsolete':
	case '--squirrel-updated':
		app.quit();
		break;
	default:
		initialize();
}
