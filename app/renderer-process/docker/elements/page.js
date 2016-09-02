const locale = require('../../locale');

const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const $pt = require('../../parrot');

const langs = locale.load('docker/page');

const Page = React.createClass({
	statics: {
	},
	getInitialState: function() {
		return {};
	},
	renderHeader: function() {
		return (<div className='docker-page-header bg-color-primary color-reverse'>
			<div className='docker-page-header-label'>
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
		return (<div className='docker-page-body'>
			<NPanel model={$pt.createModel({})}
					layout={$pt.createCellLayout('page', layout)}
					direction='horizontal' />
		</div>);
	},
	render: function() {
		return (<div className='docker-page'>
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
			},
			authority: {
				label: langs.authorityCheck,
				comp: {type: $pt.ComponentConstants.Toggle},
				pos: {col: 400}
			},
			menu: {
				label: langs.menuCheck,
				comp: {type: $pt.ComponentConstants.Toggle},
				pos: {col: 500}
			}
		};
	}
});

module.exports = {
	label: langs.title, 
	icon: 'mdi mdi-television-guide', 
	reactClass: Page,
	className: 'docker-page-container',
	containerId: 'bottom-docker',
	pos: 'right'
};