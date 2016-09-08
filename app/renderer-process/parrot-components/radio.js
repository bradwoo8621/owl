module.exports = function(parrot) {
	let $pt = parrot.parrot;
	return {
		id: 'pt-rad', 
		label: 'Radio', 
		group: 'plain',

		type: $pt.ComponentConstants.Radio,
		layoutAdapt: function(layout) {
			if (!layout.comp.data) {
				layout.comp.data = require('./demo-data')(parrot).codetable
			}
			return layout;
		}
	};
};