const locale = require('../locale');

const jsface = require('jsface');
const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');

const elements = require('./elements');

const BottomDocker = React.createClass({
	getInitialState: function() {
		return {
			currentDockerElement: null
		};
	},
	renderDockerBody: function() {
		return 	(<div className='docker-body'
					  ref='body'>
		</div>);
	},
	renderDockerElement: function(dockerElement, dockerElementIndex) {
		return (<div className='docker left'
					 key={dockerElementIndex}>
			<div className='docker-btn'
				 onClick={this.onDockerClicked.bind(this, dockerElement)}>
				<i className={dockerElement.icon} />
				<span>{dockerElement.label}</span>
			</div>
		</div>);
	},
	render: function() {
		return (<div className='bottom-docker'>
			{this.renderDockerBody()}
			<div className='bottom-docker-bar'>
				{this.getDockerElements().map(this.renderDockerElement)}
			</div>
		</div>);
	},
	getDockerElements: function() {
		return elements;
	},
	getCurrentDockerElement: function() {
		return this.state.currentDockerElement;
	},
	onDockerClicked: function(dockerElement, evt) {
		var eventTarget = $(evt.target).closest('.docker-btn');

		let currentDockerElement = this.getCurrentDockerElement();
		let dockerBody = this.refs.body;
		if (currentDockerElement) {
			// close current
			$(dockerBody).removeClass(currentDockerElement.className);
			ReactDOM.unmountComponentAtNode(dockerBody);
		}
		if (dockerElement != currentDockerElement) {
			// switch to another
			this.state.currentDockerElement = dockerElement;
			let element = React.createElement(dockerElement.reactClass);
			ReactDOM.render(element, dockerBody, function() {
				$(dockerBody).addClass(dockerElement.className);
				eventTarget.addClass('expanded').removeClass('collapsed');
			});
		} else {
			// no another, set state only
			this.state.currentDockerElement = null;
			eventTarget.removeClass('expanded').addClass('collapsed');
		}
	}
});

module.exports = {
	render: function(dockerId, callback) {
		return ReactDOM.render(<BottomDocker />, 
				window.document.getElementById(dockerId),
				callback);
	}
}