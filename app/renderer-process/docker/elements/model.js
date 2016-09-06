const locale = require('../../locale');

const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');

const langs = locale.load('docker/model');

const Model = React.createClass({
	statics: {
	},
	getInitialState: function() {
		return {};
	},
	renderHeader: function() {
		return (<div className='docker-model-header bg-color-primary color-reverse'>
			<div className='docker-model-header-label'>
				<span>{langs.title}</span>
			</div>
		</div>);
	},
	renderBody: function() {
		return (<div className='docker-model-body'>
		</div>);
	},
	render: function() {
		return (<div className='docker-model'>
			{this.renderHeader()}
			{this.renderBody()}
		</div>);
	}
});

module.exports = {
	label: langs.title, 
	icon: 'mdi mdi-blur-linear',
	reactClass: Model,
	className: 'docker-model-container',
	containerId: 'bottom-docker',
	pos: 'right'
};