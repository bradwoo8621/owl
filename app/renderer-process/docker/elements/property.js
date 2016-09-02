const locale = require('../../locale');

const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');

const langs = locale.load('docker/property');

const Property = React.createClass({
	statics: {
	},
	getInitialState: function() {
		return {};
	},
	renderHeader: function() {
		return (<div className='docker-property-header bg-color-primary color-reverse'>
			<div className='docker-property-header-label'>
				<span>{langs.title}</span>
			</div>
		</div>);
	},
	renderBody: function() {
		return (<div className='docker-property-body'>
		</div>);
	},
	render: function() {
		return (<div className='docker-property'>
			{this.renderHeader()}
			{this.renderBody()}
		</div>);
	}
});

module.exports = {
	label: langs.title, 
	icon: 'mdi mdi-cube-send',
	reactClass: Property,
	className: 'docker-property-container',
	containerId: 'bottom-docker'
};
