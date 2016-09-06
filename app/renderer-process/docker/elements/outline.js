const locale = require('../../locale');

const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');

const langs = locale.load('docker/outline');

const Outline = React.createClass({
	statics: {
		PLAIN: 'plain',
		CONTAINER: 'container',
		CUSTOMIZED: 'custom'
	},
	getInitialState: function() {
		return {};
	},
	renderHeader: function() {
		return (<div className='docker-outline-header bg-color-primary color-reverse'>
			<div className='docker-outline-header-label'>
				<span>{langs.title}</span>
			</div>
		</div>);
	},
	renderBody: function() {
		return (<div className='docker-outline-body'>
		</div>);
	},
	render: function() {
		return (<div className='docker-outline'>
			{this.renderHeader()}
			{this.renderBody()}
		</div>);
	}
});

module.exports = {
	label: langs.title,
	icon: 'mdi mdi-format-line-weight',
	reactClass: Outline,
	className: 'docker-outline-container',
	containerId: 'left-docker',
	onExpanded: function() {
		$('body').addClass('left-docker-expanded');
	},
	onCollapsed: function() {
		$('body').removeClass('left-docker-expanded');
	}
};
