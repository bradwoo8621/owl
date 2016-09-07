const React = require('react');
// const ReactDOM = require('react-dom');
const $pt = require('../parrot').parrot;
const model = $pt.createModel({});
module.exports = {
	id: 'pt-txt', 
	label: 'Text', 
	group: 'plain',

	hasLabel: true,
	renderDemo: function() {
		let layout = $pt.createCellLayout('', {
			comp: {
				type: {label: false, type: $pt.ComponentConstants.Text},
				enabled: false
			},
			css: {
				comp: 'demo-text'
			}
		});
		return <$pt.Components.NText model={model}
									 layout={layout} />;
	}
};