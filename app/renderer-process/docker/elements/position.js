const locale = require('../../locale');

const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');

const langs = locale.load('docker/position');

const Position = React.createClass({
	statics: {
	},
	getInitialState: function() {
		return {};
	},
	renderHeader: function() {
		return (<div className='docker-position-header bg-color-primary color-reverse'>
			<div className='docker-position-header-label'>
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
		return (<div className='docker-position-body'>
			<NPanel model={$pt.createModel({})}
					layout={$pt.createCellLayout('page', layout)}
					direction='horizontal' />
		</div>);
	},
	render: function() {
		return (<div className='docker-position'>
			{this.renderHeader()}
			{this.renderBody()}
		</div>);
	},
	getSettingLayout: function() {
		return {
			large: {
				label: langs.large,
				pos: {col: 100}
			},
			middle: {
				label: langs.middle,
				pos: {col: 200}
			},
			small: {
				label: langs.small,
				pos: {col: 300}
			},
			xs: {
				label: langs.extraSmall,
				pos: {col: 400}
			}
		};
	}
});

module.exports = {
	label: langs.title, 
	icon: 'mdi mdi-arrow-compress-all',
	reactClass: Position,
	className: 'docker-position-container',
	containerId: 'bottom-docker'
};
