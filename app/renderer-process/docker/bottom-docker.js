const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const classnames = require('classnames');

const elements = require('./elements').map(function(element) {
	element.pos = element.pos ? element.pos : 'left';
	return element;
});

const BottomDocker = React.createClass({
	getInitialState: function() {
		return {
			currentDockerElement: null,
			outerContainers: {}
		};
	},
	renderDockerElement: function(dockerElement, dockerElementIndex) {
		return (<div className='docker'
					 data-container-id={dockerElement.containerId}
					 data-title={dockerElement.label}
					 key={dockerElementIndex}>
			<div className='docker-btn'
				 onClick={this.onDockerClicked.bind(this, dockerElement)}>
				<i className={dockerElement.icon} />
			</div>
		</div>);
	},
	render: function() {
		return (<div className='bottom-docker-bar-container'>
			<div className='bottom-docker-bar-btn'
				 onClick={this.onDockerButtonClicked}>
				<i className='mdi mdi-arrow-expand-all' />
			</div>
			<div className='bottom-docker-bar left'>
				{this.getDockerElements('left').map(this.renderDockerElement)}
			</div>
			<div className='bottom-docker-bar right'>
				{this.getDockerElements('right').map(this.renderDockerElement)}
			</div>
		</div>);
	},
	getDockerElements: function(pos) {
		if (pos) {
			return elements.filter(function(element) {
				return element.pos === pos;
			});
		}
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
	onDockerButtonClicked: function(evt) {
		let btn = $(evt.target).closest('.bottom-docker-bar-btn');
		let left = btn.next();
		let right = left.next();
		left.animate({height: 'toggle'}, 500, 'linear');
		right.animate({width: 'toggle'}, 500, 'linear', function() {
			btn.toggleClass('expanded');
			btn.children('i').toggleClass('mdi-arrow-expand-all mdi-arrow-compress-all');
		});
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