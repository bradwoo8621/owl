const locale = require('../../locale');

const parrot = require('../../parrot');
const $ = parrot.jquery;
const React = parrot.react;
const ReactDOM = parrot.reactDOM;
const $pt = parrot.parrot;

const langs = locale.load('docker/global');

const Global = React.createClass({
	statics: {
	},
	getInitialState: function() {
		return {};
	},
	renderHeader: function() {
		return (<div className='docker-global-header bg-color-primary color-reverse'>
			<div className='docker-global-header-label'>
				<span>{langs.title}</span>
			</div>
		</div>);
	},
	renderBody: function() {
		let layout = {
			comp: {
				type: $pt.ComponentConstants.Panel,
				editLayout: this.getSettingLayout()
			}
		};
		return (<div className='docker-global-body'>
			<NPanel model={$pt.createModel({})}
					layout={$pt.createCellLayout('global', layout)}
					direction='horizontal' />
		</div>);
	},
	render: function() {
		return (<div className='docker-global'>
			{this.renderHeader()}
			{this.renderBody()}
		</div>);
	},
	getSettingLayout: function() {
		return {
			header: {
				label: langs.header,
				pos: {row: 100, col: 100}
			},
			footer: {
				label: langs.footer,
				pos: {row: 100, col: 200}
			},
			className: {
				label: langs.className,
				pos: {row: 100, col: 300}
			},
			labelDirection: {
				label: langs.labelDirection,
				comp: {
					type: $pt.ComponentConstants.Select,
					data: parrot.codes.labelDirection,
					allowClear: false,
					minimumResultsForSearch: Infinity
				},
				pos: {row: 300, col: 100}
			},
			cellWidth: {
				label: langs.cellWidth,
				pos: {row: 300, col: 200}
			},
			labelWidth: {
				label: langs.labelWidth,
				pos: {row: 300, col: 300}
			}
		};
	}
});

module.exports = {
	label: langs.title, 
	icon: 'mdi mdi-settings', 
	reactClass: Global,
	className: 'docker-global-container',
	containerId: 'bottom-docker-section'
};