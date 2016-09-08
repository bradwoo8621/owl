const $pt = require('../parrot').parrot;

module.exports = {
	id: 'pt-csh', 
	label: 'Code Search', 
	group: 'plain',

	type: $pt.ComponentConstants.Search,
	layoutAdapt: function(layout) {
		if (layout.comp.searchTriggerDigits == null) {
			layout.comp.searchTriggerDigits = 1;
		}
		return layout;
	}
};