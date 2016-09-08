const $pt = require('../parrot').parrot;

module.exports = {
	id: 'pt-selTre', 
	label: 'Select Tree', 
	group: 'plain',

	type: $pt.ComponentConstants.SelectTree,
	layoutAdapt: function(layout) {
		if (!layout.comp.data) {
			layout.comp.data = require('./demo-data').codetable
		}
		return layout;
	}
};