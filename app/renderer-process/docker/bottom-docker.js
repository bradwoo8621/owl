const locale = require('../locale');

const jsface = require('jsface');
const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');

const elements = require('./elements');

const BottomDocker = React.createClass({
	getInitialState: function() {
		return {
			currentDockerElement: null,
			outerContainers: {}
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
	getCurrentDockerElement: function(containerId) {
		if (containerId) {
			return this.state.outerContainers[containerId];
		} else {
			return this.state.currentDockerElement;
		}
	},
	setCurrentDockerElement: function(dockerElement, containerId) {
		if (containerId) {
			this.state.outerContainers[containerId] = dockerElement;
		} else {
			this.state.currentDockerElement = dockerElement;
		}
	},
	onDockerClicked: function(dockerElement, evt) {
		let eventTarget = $(evt.target).closest('.docker-btn');

		// get docker container
		let dockerContainer = this.refs.body;
		if (dockerElement.containerId) {
			dockerContainer = document.getElementById(dockerElement.containerId);
		}
		// get current docker element from given container
		let currentDockerElement = this.getCurrentDockerElement(dockerElement.containerId);
		if (currentDockerElement) {
			// unmount current docker element
			$(dockerContainer).removeClass(currentDockerElement.className);
			ReactDOM.unmountComponentAtNode(dockerContainer);
			if (dockerElement.onCollapsed) {
				dockerElement.onCollapsed.call(this);
			}
		}
		if (dockerElement != currentDockerElement) {
			// switch to another
			this.setCurrentDockerElement(dockerElement, dockerElement.containerId);
			let element = React.createElement(dockerElement.reactClass);
			ReactDOM.render(element, dockerContainer, function() {
				$(dockerContainer).addClass(dockerElement.className);
				eventTarget.addClass('expanded').removeClass('collapsed');
				if (dockerElement.onExpanded) {
					dockerElement.onExpanded.call(this);
				}
			});
		} else {
			// no another, set state only
			this.setCurrentDockerElement(null, dockerElement.containerId);
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