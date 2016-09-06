const Config = require('electron-config');
const config = new Config();

const has = function(key) {
	return config.has(key);
};
const get = function(key, defaultValue) {
	if (has(key)) {
		let value = config.get(key);
		if (typeof value === 'undefined' || value == null) {
			return defaultValue;
		} else {
			return value;
		}
	} else {
		return defaultValue;
	}
};
const is = function(key, value) {
	if (has(key)) {
		return get(key) == value;
	} else {
		return false;
	}
};
const set = function(key, value) {
	config.set(key, value);
};
const del = function(key) {
	config.delete(key);
};
module.exports = {
	get: get,
	has: has,
	is: is,
	set: set,
	delete: del,

	SYS_LOCALE: 'system.pref.locale'
};