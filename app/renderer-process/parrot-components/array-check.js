const $pt = require('../parrot').parrot;

module.exports = {
	id: 'pt-aChk', 
	label: 'Array Check', 
	group: 'plain',

	type: $pt.ComponentConstants.ArrayCheck,
	layoutAdapt: function(layout) {
		if (!layout.comp.data) {
			layout.comp.data = require('./demo-data').codetable
		}
		return layout;
	}
};