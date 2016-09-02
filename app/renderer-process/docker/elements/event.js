const locale = require('../../locale');

const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');

const langs = locale.load('docker/event');

const Event = React.createClass({
	statics: {
	},
	getInitialState: function() {
		return {};
	},
	renderHeader: function() {
		return (<div className='docker-event-header bg-color-primary color-reverse'>
			<div className='docker-event-header-label'>
				<span>{langs.title}</span>
			</div>
		</div>);
	},
	renderBody: function() {
		return (<div className='docker-event-body'>
		</div>);
	},
	render: function() {
		return (<div className='docker-event'>
			{this.renderHeader()}
			{this.renderBody()}
		</div>);
	}
});

module.exports = {
	label: langs.title, 
	icon: 'mdi mdi-phone-hangup',
	reactClass: Event,
	className: 'docker-event-container',
	containerId: 'bottom-docker'
};