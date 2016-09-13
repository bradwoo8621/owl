const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const extfs = require('extfs');
const jsonfile = require('jsonfile');
const q = require("q");

const config = require('../../config');

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

const getIndexFileContent = function() {
	let indexFile = path.join(config.get(config.CURRENT_PROJECT), envs.indexFileName);
	try {
		return jsonfile.readFileSync(indexFile);
	} catch (e) {
		return envs.indexFileContent;
	}
};

const getPageDirectory = function() {
	let pageRelativePath = getIndexFileContent().pages;
	pageRelativePath = pageRelativePath ? pageRelativePath : 'pages';
	return path.join(config.get(config.CURRENT_PROJECT), pageRelativePath);
}

const fileState = function(file) {
	let pageRoot = getPageDirectory();
	let state = fs.statSync(file);
	return {
		pageRoot: file === pageRoot,
		pageDir: file.startsWith(pageRoot + path.sep),
		page: file.startsWith(pageRoot + path.sep),
		dir: state.isDirectory(),
		file: state.isFile(),
		// no matter the file is directory or file
		// if directory, no sub directory/file
		// if file, content length is 0
		empty: extfs.isEmptySync(file),

		file: file
	};
}

module.exports = {
	envs: envs,
	initProjectStructure: initProjectStructure,
	fileState: fileState
};