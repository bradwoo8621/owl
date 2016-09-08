module.exports = function(parrot) {
	let $pt = parrot.parrot;
	return {
		id: 'pt-selTre', 
		label: 'Select Tree', 
		group: 'plain',

		type: $pt.ComponentConstants.SelectTree,
		layoutAdapt: function(layout) {
			if (!layout.comp.data) {
				layout.comp.data = require('./demo-data')(parrot).codetable
			}
			return layout;
		}
	};
};