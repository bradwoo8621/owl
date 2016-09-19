const {ipcRenderer} = require('electron');

const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const classnames = require('classnames');

const elements = require('./elements').map(function(element) {
	element.pos = element.pos ? element.pos : 'left';
	return element;
});

ipcRenderer.on('toggle-docker', function() {
	let elements = docker.getAllCurrentDockerElements();
	if (elements.length > 0) {
		closedDockerElements = [];
		elements.forEach(function(element) {
			docker.hideDocker(element);
			closedDockerElements.push(element);
		});
	} else {
		closedDockerElements.forEach(function(element) {
			docker.showDocker(element);
		})
	}
});

const BottomDocker = React.createClass({
	getInitialState: function() {
		return {
			outerContainers: {}
		};
	},
	componentDidMount: function() {
		// open docker
		$(ReactDOM.findDOMNode(this.refs.container))
			.find('[data-open=true]')
			.click();
	},
	renderDockerElement: function(dockerElement, dockerElementIndex) {
		return (<div className='docker'
					 data-container-id={dockerElement.containerId}
					 data-title={dockerElement.label}
					 key={dockerElementIndex}>
			<div className='docker-btn'
				 onClick={this.onDockerClicked.bind(this, dockerElement)}
				 data-open={dockerElement.open}>
				<i className={dockerElement.icon} />
			</div>
		</div>);
	},
	render: function() {
		return (<div className='bottom-docker-bar-container'
					 ref='container'>
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
		return this.state.outerContainers[containerId];
	},
	setCurrentDockerElement: function(dockerElement, containerId) {
		if (dockerElement == null) {
			delete this.state.outerContainers[containerId];
		} else {
			this.state.outerContainers[containerId] = dockerElement;
		}
	},
	getAllCurrentDockerElements: function() {
		return Object.keys(this.state.outerContainers).map(function(key) {
			return this.state.outerContainers[key];
		}.bind(this));
	},
	onDockerButtonClicked: function(evt) {
		let btn = $(evt.target).closest('.bottom-docker-bar-btn');
		let left = btn.next();
		let right = left.next();
		left.animate({height: 'toggle'}, 500, 'linear');
		right.animate({width: 'toggle'}, 500, 'linear', function() {
			btn.toggleClass('expanded');
			btn.children('i').toggleClass('mdi-arrow-expand-all mdi-arrow-compress-all');
		}.bind(this));
	},
	getDockerContainer: function(dockerElement) {
		// get docker container
		let dockerContainer = this.refs.body;
		if (dockerElement.containerId) {
			dockerContainer = document.getElementById(dockerElement.containerId);
		}
		return dockerContainer;
	},
	onDockerClicked: function(dockerElement, evt) {
		// get docker container
		let dockerContainer = this.getDockerContainer(dockerElement);
		// get current docker element from given container
		let currentDockerElement = this.getCurrentDockerElement(dockerElement.containerId);
		if (currentDockerElement) {
			this.hideDocker(currentDockerElement);
		}
		if (dockerElement != currentDockerElement) {
			this.showDocker(dockerElement);
		}
	},
	hideDocker: function(dockerElement) {
		let dockerContainer = this.getDockerContainer(dockerElement);
		// unmount current docker element
		$(dockerContainer).removeClass(dockerElement.className);
		ReactDOM.unmountComponentAtNode(dockerContainer);
		if (dockerElement.onCollapsed) {
			dockerElement.onCollapsed.call(this);
		}
		this.setCurrentDockerElement(null, dockerElement.containerId);
	},
	showDocker: function(dockerElement) {
		let dockerContainer = this.getDockerContainer(dockerElement);

		this.setCurrentDockerElement(dockerElement, dockerElement.containerId);
		let element = React.createElement(dockerElement.reactClass);
		ReactDOM.render(element, dockerContainer, function() {
			$(dockerContainer).addClass(dockerElement.className);
			let buttonBar = $(ReactDOM.findDOMNode(this.refs.container));
			if (dockerElement.onExpanded) {
				dockerElement.onExpanded.call(this);
			}

			closedDockerElements = this.getAllCurrentDockerElements();
		}.bind(this));
	}
});

let docker;
let closedDockerElements = [];

module.exports = {
	render: function(dockerId, callback) {
		docker = ReactDOM.render(<BottomDocker />, 
				window.document.getElementById(dockerId),
				callback);
		return docker;
	}
}