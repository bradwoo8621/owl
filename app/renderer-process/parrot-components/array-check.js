module.exports = function(parrot) {
	let $pt = parrot.parrot;
	return {
		id: 'pt-aChk', 
		label: 'Array Check', 
		group: 'plain',

		type: $pt.ComponentConstants.ArrayCheck,
		layoutAdapt: function(layout) {
			if (!layout.comp.data) {
				layout.comp.data = require('./demo-data')(parrot).codetable
			}
			return layout;
		}
	};
};