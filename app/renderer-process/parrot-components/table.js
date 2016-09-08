const $pt = require('../parrot').parrot;

module.exports = {
	id: 'pt-tbl', 
	label: 'Table', 
	group: 'plain',

	type: $pt.ComponentConstants.Table,
	defaultWidth: 12,
	layoutAdapt: function(layout) {
		if (!layout.comp.columns) {
			layout.comp.columns = [
				{title: 'Column A', data: 'column1', width: '50%'},
				{title: 'Column A', data: 'column2', width: '50%'}
			];
		}
		return layout;
	}
};