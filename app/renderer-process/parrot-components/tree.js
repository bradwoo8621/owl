const $pt = require('../parrot').parrot;

module.exports = {
	id: 'pt-tre', 
	label: 'Tree', 
	group: 'plain',

	type: $pt.ComponentConstants.Tree,
	layoutAdapt: function(layout) {
		if (!layout.comp.data) {
			layout.comp.data = require('./demo-data').codetable
		}
		return layout;
	}
};