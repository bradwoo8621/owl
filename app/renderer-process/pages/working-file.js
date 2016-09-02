require("babel-register")({
	"presets": ["react"],
	"plugins": ["transform-react-jsx"]
});

// const electron = require('electron');
// const ipcRenderer = electron.ipcRenderer;

const bottomDockerRenderer = require('../docker/bottom-docker');
// const remote = require('electron').remote;

let bottomDocker = bottomDockerRenderer.render('bottom-docker');

// handle render event
// ipcRenderer.on('switch-language', function(event, message) {
// });
