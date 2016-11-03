require("babel-register")({
	"presets": [
		"react", 
		"es2015"
	],
	"plugins": [
		"transform-react-jsx",
		"transform-class-properties"
	]
});

const path = require('path');
const electron = require('electron');
const {app, BrowserWindow, Menu, globalShortcut} = electron;
const {Menus} = require('./main-process/window-menus');

// const config = require('./config');

const debug = /--debug/.test(process.argv[2]);

app.setName('Owl - Designer for Parrot2');

let mainWindow = null;

function initialize () {
	let shouldQuit = makeSingleInstance();
	if (shouldQuit) {
		return app.quit();
	}

	function createWindow () {
		let windowOptions = {
			minWidth: 1024,
			minHeight: 700,
			title: app.getName(),
			show: false,
			webPreferences: {
				webSecurity: false,
				experimentalFeatures: true
			}
		};

		// if (!config.has(config.SYS_LOCALE)) {
		// 	config.set(config.SYS_LOCALE, app.getLocale());
		// }

		if (process.platform === 'linux') {
			windowOptions.icon = path.join(__dirname, './assets/app-icon/png/256.png');
		} else if (process.platform === 'win32') {
			windowOptions.icon = path.join(__dirname, './assets/app-icon/win/app.ico');
		}

		mainWindow = new BrowserWindow(windowOptions);
		mainWindow.loadURL(path.join('file://', __dirname, './renderer-process/home.html'));

		// Launch fullscreen with DevTools open, usage: npm run debug
		if (debug) {
			mainWindow.webContents.openDevTools();
		}
		// always maximize window
		mainWindow.maximize();

		const menu = Menu.buildFromTemplate(new Menus().getMenuTemplate());
		Menu.setApplicationMenu(menu);
		// globalShortcut.register('CmdOrCtrl+Alt+Z', function() {
		// 	mainWindow.webContents.send('toggle-docker');
		// });
		// globalShortcut.register('CmdOrCtrl+Alt+W', function() {
		// 	mainWindow.webContents.send('to-index');
		// });

		mainWindow.on('closed', function () {
			mainWindow = null;
		});
		mainWindow.once('ready-to-show', (evt) => {
			mainWindow.show();
		});
	};

	app.on('ready', function () {
		createWindow();
	});
	app.on('will-quit', function() {
		globalShortcut.unregisterAll();
	});

	app.on('window-all-closed', function () {
		if (process.platform !== 'darwin') {
			app.quit();
		}
	});

	app.on('activate', function () {
		if (mainWindow === null) {
			createWindow();
		}
	});
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

// Handle Squirrel on Windows startup events
switch (process.argv[1]) {
	case '--squirrel-obsolete':
	case '--squirrel-updated':
		app.quit();
		break;
	default:
		initialize();
}
