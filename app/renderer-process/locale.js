const electron = require('electron');
const remote = electron.remote;

let locale = remote.getGlobal('envs').locale
module.exports = {
	locale: locale ? locale : 'en-US',
	load: function(relative) {
		return require('../assets/i18n/' + relative + '-' + locale);
	}
};