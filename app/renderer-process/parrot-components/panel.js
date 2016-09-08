module.exports = function(parrot) {
	let $pt = parrot.parrot;
	return {
		id: 'pt-pnl', 
		label: 'Panel', 
		group: 'container',

		type: $pt.ComponentConstants.Panel,
		defaultWidth: 12,
		layoutAdapt: function(layout, DesignPanel) {
			let originalEditLayout = layout.comp.editLayout;
			let proxyEditLayout = {
				designPanel: {
					comp: {
						type: $pt.ComponentConstants.DesignPanel,
						editLayout: originalEditLayout
					},
					pos: {width: 12}
				}
			};
			layout.comp.editLayout = proxyEditLayout;
			return layout;
		}
	};
};