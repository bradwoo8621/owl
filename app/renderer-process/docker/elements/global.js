const locale = require('../../locale');

const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const $pt = require('../../parrot');

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
				pos: {col: 100}
			},
			footer: {
				label: langs.footer,
				pos: {col: 200}
			},
			className: {
				label: langs.className,
				pos: {col: 300}
			}
		};
	}
});

module.exports = {
	label: langs.title, 
	icon: 'mdi mdi-settings', 
	reactClass: Global,
	className: 'docker-global-container',
	containerId: 'bottom-docker'
};