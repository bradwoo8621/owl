const $pt = require('../parrot').parrot;

module.exports = {
	id: 'pt-rad', 
	label: 'Radio', 
	group: 'plain',

	type: $pt.ComponentConstants.Radio,
	layoutAdapt: function(layout) {
		if (!layout.comp.data) {
			layout.comp.data = require('./demo-data').codetable
		}
		return layout;
	}
};