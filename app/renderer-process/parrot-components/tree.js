module.exports = function(parrot) {
	let $pt = parrot.parrot;
	return {
		id: 'pt-tre', 
		label: 'Tree', 
		group: 'plain',

		type: $pt.ComponentConstants.Tree,
		layoutAdapt: function(layout) {
			if (!layout.comp.data) {
				layout.comp.data = require('./demo-data')(parrot).codetable
			}
			return layout;
		}
	};
};