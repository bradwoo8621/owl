const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const classnames = require('classnames');

const MainContent = React.createClass({
	getInitialState: function() {
		return {
			components: []
		};
	},
	render: function() {
		return (<div className='main-content'
					 onDrop={this.onDrop}
					 onDragOver={this.onDragOver}
					 onDragEnter={this.onDragEnter}
					 onDragLeave={this.onDragLeave}>
		</div>);
	},
	onDrop: function(evt) {
		console.log(evt.dataTransfer.getData('componentId'));
	},
	onDragEnter: function(evt) {
		evt.preventDefault();
		console.log('drag enter');
	},
	onDragOver: function(evt) {
		evt.preventDefault();
		console.log('drag over');
	},
	onDragLeave: function(evt) {
		evt.preventDefault();
		console.log('drag leave');
	}
});

module.exports = {
	render: function(dockerId, callback) {
		return ReactDOM.render(<MainContent />, 
				window.document.getElementById(dockerId),
				callback);
	}
}