const {ipcRenderer} = require('electron');

const parrot = require('../parrot-components');
const ComponentReceiverMixin = parrot.ComponentReceiverMixin;
const React = parrot.parrot.react;
const ReactDOM = parrot.parrot.reactDOM;

ipcRenderer.on('file-open', function() {
	console.log(arguments);
});
ipcRenderer.on('file-deleted', function() {
	console.log(arguments);
});
ipcRenderer.on('folder-deleted', function() {
	console.log(arguments);
});

const FileTab = React.createClass({
	mixins: [ComponentReceiverMixin],
	render: function() {
		return (<div className='main-content component-receiver'
					 onDrop={this.onDrop}
					 onDragOver={this.onDragOver}
					 onDragEnter={this.onDragEnter}
					 onDragLeave={this.onDragLeave}>
			{this.renderComponents()}
		</div>);
	},
});

module.exports = {
	render: function(dockerId, callback) {
		return ReactDOM.render(<FileTab />, 
				window.document.getElementById(dockerId),
				callback);
	}
}