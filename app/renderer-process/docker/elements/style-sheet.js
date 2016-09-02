const locale = require('../../locale');

const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');

const langs = locale.load('docker/stylesheet');

const StyleSheet = React.createClass({
	statics: {
	},
	getInitialState: function() {
		return {};
	},
	renderHeader: function() {
		return (<div className='docker-stylesheet-header bg-color-primary color-reverse'>
			<div className='docker-stylesheet-header-label'>
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
		return (<div className='docker-stylesheet-body'>
			<NPanel model={$pt.createModel({})}
					layout={$pt.createCellLayout('page', layout)}
					direction='horizontal' />
		</div>);
	},
	render: function() {
		return (<div className='docker-stylesheet'>
			{this.renderHeader()}
			{this.renderBody()}
		</div>);
	},
	getSettingLayout: function() {
		return {
			cell: {
				label: langs.cell,
				pos: {col: 100}
			},
			comp: {
				label: langs.component,
				pos: {col: 200}
			}
		};
	}
});

module.exports = {
	label: langs.title, 
	icon: 'mdi mdi-broom',
	reactClass: StyleSheet,
	className: 'docker-stylesheet-container',
	containerId: 'bottom-docker'
};
