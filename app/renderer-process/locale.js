const electron = require('electron');
const config = require('../config');

let locale = config.get(config.SYS_LOCALE, 'en-US');

module.exports = {
	locale: locale,
	load: function(relative) {
		return require('../assets/i18n/' + relative + '-' + locale);
	}
};