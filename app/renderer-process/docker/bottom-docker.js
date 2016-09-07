const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const classnames = require('classnames');

const elements = require('./elements');

const BottomDocker = React.createClass({
	getInitialState: function() {
		return {
			currentDockerElement: null,
			outerContainers: {}
		};
	},
	renderDockerElement: function(dockerElement, dockerElementIndex) {
		return (<div className={classnames('docker', this.getDockerElementPosition(dockerElement))}
					 data-container-id={dockerElement.containerId}
					 key={dockerElementIndex}>
			<div className='docker-btn'
				 onClick={this.onDockerClicked.bind(this, dockerElement)}>
				<i className={dockerElement.icon} />
				<span>{dockerElement.label}</span>
			</div>
		</div>);
	},
	render: function() {
		return (<div className='bottom-docker-bar-container'>
			<div className='bottom-docker-bar'>
				{this.getDockerElements().map(this.renderDockerElement)}
			</div>
		</div>);
	},
	getDockerElements: function() {
		return elements;
	},
	getDockerElementPosition: function(dockerElement) {
		return dockerElement.pos ? dockerElement.pos : 'left';
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

		// remove other button's expanded class
		let buttonBar = eventTarget.closest('.bottom-docker-bar');
		if (dockerElement.containerId) {
			buttonBar.find('.docker[data-container-id=' + dockerElement.containerId + '] .docker-btn')
				.not(eventTarget)
				.removeClass('expanded');
		} else {
			buttonBar.find('.docker:not([data-container-id]) .docker-btn')
				.not(eventTarget)
				.removeClass('expanded');
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