const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const jsonfile = require('jsonfile');
const q = require("q");

const envs = {
	indexFileName: 'owl.json',
	indexFileContent: {
		main: 'index.html',
		pages: '/pages',
		components: '/components',
		common: '/common',
		styles: '/styles'
	}
};

const createIndexFile = function(folder) {
	let d = q.defer();

	let absolutePath = path.join(folder, envs.indexFileName);
	let exists = false;
	try {
		exists = fs.statSync(absolutePath).isFile();
	} catch (e) {
		if (e.code != 'ENOENT') {
			// other exception, treated as exists
			exists = true;
		}
	}
	if (!exists) {
		jsonfile.writeFile(absolutePath, envs.indexFileContent, {spaces: '\t'}, function() {
			d.resolve();
		}.bind(this));
	} else {
		d.resolve();
	}
	return d.promise;
};

const createFolders = function(folder) {
	return Object.keys(envs.indexFileContent).filter(function(key) {
		return key !== 'main';
	}).map(function(key) {
		let d = q.defer();

		let absolutePath = path.join(folder, envs.indexFileContent[key]);
		console.log(absolutePath);
		let exists = false;
		try {
			exists = fs.statSync(absolutePath).isDirectory();
		} catch (e) {
			if (e.code != 'ENOENT') {
				// other exception, treated as exists
				exists = true;
			}
		}
		if (!exists) {
			fsExtra.mkdirs(absolutePath, function() {
				d.resolve();
			});
		} else {
			d.resolve();
		}
		return d.promise;
	});
}

const initProjectStructure = function(folder, callback) {
	q.all([createIndexFile(folder)].concat(createFolders(folder)))
		.then(callback);
}

module.exports = {
	envs: envs,
	initProjectStructure: initProjectStructure
};