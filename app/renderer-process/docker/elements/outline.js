const fs = require('fs');
const path = require('path');
const extfs = require('extfs');
const {remote} = require('electron');
const {Menu, MenuItem} = remote;

const locale = require('../../locale');
const config = require('../../../config');

const classnames = require('classnames');
const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');

const langs = locale.load('docker/outline');

const FolderNameInput = React.createClass({
	statics: {
		show: function(options) {
			let div = $('#outline-folder-name-input-div');
			if (div.length == 0) {
				div = $('<div id="outline-folder-name-input-div">').appendTo($('body'));
			}
			let offset = $(ReactDOM.findDOMNode(options.node)).offset();
			console.log(offset);
			let props = {
				parent: options.parent,
				top: 'calc(' + offset.top + 'px + 2em)',
				left: 40,
				callback: options.callback
			};
			ReactDOM.render(<FolderNameInput {...props} />, div[0]);
		},
		hide: function() {
			ReactDOM.unmountComponentAtNode(document.getElementById('outline-folder-name-input-div'));
		}
	},
	getInitialState: function() {
		return {}
	},
	componentDidMount: function() {
		$(ReactDOM.findDOMNode(this.refs.text)).focus();
	},
	componentDidUpdate: function() {
		$(ReactDOM.findDOMNode(this.refs.text)).focus();
	},
	calculatePosition: function() {
		return {
			top: this.props.top,
			left: this.props.left
		};
	},
	renderError: function() {
		let error = this.getErrorMessage();
		if (error) {
			return (<span className='outline-folder-name-input-error'>
				{error}
			</span>);
		}
	},
	render: function() {
		return <div className='outline-folder-name-input-container'
					ref='container'
					style={this.calculatePosition()}>
			<span className='outline-folder-name-input-label'>
				  {langs.folderName}
			</span>
			<input type='text' 
				   ref='text'
				   onKeyUp={this.onKeyUp}
				   onBlur={this.onBlur} />
			{this.renderError()}
		</div>;
	},
	onKeyUp: function(evt) {
		if (evt.keyCode === 13) {
			// enter
			this.onEnterKeyUp(evt);
		} else if (evt.keyCode === 27) {
			// escape
			this.onEscapeKeyUp(evt);
		}
	},
	onEnterKeyUp: function(evt) {
		let newFolderName = $(ReactDOM.findDOMNode(this.refs.text)).val();
		fs.mkdir(path.join(this.props.parent, newFolderName), this.onFolderCreated);
	},
	onFolderCreated: function() {
		if (arguments.length > 0 && arguments[0]) {
			this.setState({error: arguments[0].message});
		} else {
			this.getCallback().call(this);
			FolderNameInput.hide();
		}
	},
	onEscapeKeyUp: function(evt) {
		FolderNameInput.hide();
	},
	onBlur: function() {
		FolderNameInput.hide();
	},
	getParentFolder: function() {
		return this.props.parent;
	},
	getErrorMessage: function() {
		return this.state.error;
	},
	getCallback: function() {
		return this.props.callback;
	}
});

const ContextMenuMixin = {
	onNodeClicked: function() {
		let file = this.getFile();
		let fileState = fs.statSync(file);
		if (fileState.isDirectory()) {
			this.onDirectoryClicked(fileState);
		} else {
			this.onFileClicked(fileState);
		}
	},
	onDirectoryClicked: function(state) {
		if (extfs.isEmptySync(this.getFile())) {
			// do nothing
		} else {
			this.setState({expanded: !this.isExpanded()});
		}
	},
	onFileClicked: function(state) {

	},
	isExpanded: function() {
		return this.state.expanded;
	},
	onContextMenuClicked: function(evt) {
		evt.preventDefault();
		let file = this.getFile();
		let fileState = fs.statSync(file);
		if (fileState.isDirectory()) {
			this.onDirectoryContextMenuClicked(fileState);
		} else if (fileState.isFile()) {
			this.onFileContextMenuClicked(fileState);
		}
	},
	onDirectoryContextMenuClicked: function(state) {
		this.getDirectoryContextMenu().popup(remote.getCurrentWindow());
	},
	onFileContextMenuClicked: function(state) {

	},
	getDirectoryContextMenu: function() {
		const menu = new Menu();
		menu.append(new MenuItem({
			label: langs.menu.newPage, 
			click: function() { 
			}
		}));
		menu.append(new MenuItem({type: 'separator'}));
		menu.append(new MenuItem({
			label: langs.menu.newFolder, 
			click: this.onNewDirectoryClicked
		}));
		return menu;
	},
	onNewDirectoryClicked: function() {
		FolderNameInput.show({
			parent: this.getFile(),
			node: this.refs.node,
			callback: this.onSubDirectoryCreated
		});
	},
	onSubDirectoryCreated: function() {
		this.setState({expanded: true});
	}
};

const Folders = React.createClass({
	renderFile: function(file, folderIndex) {
		return <Node file={file} key={folderIndex}/>;
	},
	render: function() {
		let parentFolder = this.getParentFolder();
		let files = fs.readdirSync(parentFolder);
		if (files) {
			return (<ul className='folders'>
				{files.map(function(file) {
					return path.join(parentFolder, file);
				}).map(this.renderFile)}
			</ul>);
		} else {
			return null;
		}
	},
	getParentFolder: function() {
		return this.props.parent;
	}
});
const Node = React.createClass({
	mixins: [ContextMenuMixin],
	getInitialState: function() {
		return {};
	},
	renderChildren: function() {
		if (this.state.expanded) {
			return <Folders parent={this.getFile()} />;
		} else {
			return null;
		}
	},
	render: function() {
		let file = this.getFile();
		let fileState = fs.statSync(file);
		let isDir = fileState.isDirectory();
		let isEmpty = extfs.isEmptySync(file);
		let isFile = fileState.isFile();
		let icon = {
			'fa fa-fw': true,
			'fa-folder-o': isDir && isEmpty,
			'fa-folder': isDir && !isEmpty && !this.isExpanded(),
			'fa-folder-open': isDir && !isEmpty && this.isExpanded(),
			'fa-file-o': isFile
		};
		let className = {
			'node-directory': isDir,
			'node-file': isFile,
			'node-open': this.isExpanded()
		};
		return (<li className={classnames(className)}
					ref='node'>
			<i className={classnames(icon)} 
			   onClick={this.onNodeClicked}
			   onContextMenu={this.onContextMenuClicked} />
			<span title={file}
				  onClick={this.onNodeClicked}
				  onContextMenu={this.onContextMenuClicked}>
				{path.basename(file)}
			</span>
			{this.renderChildren()}
		</li>);
	},
	getFile: function() {
		return this.props.file;
	}
});
const Outline = React.createClass({
	statics: {
		PLAIN: 'plain',
		CONTAINER: 'container',
		CUSTOMIZED: 'custom'
	},
	mixins: [ContextMenuMixin],
	getInitialState: function() {
		return {
			root: config.get(config.CURRENT_PROJECT)
		};
	},
	renderHeader: function() {
		return (<div className='docker-outline-header bg-color-primary color-reverse'>
			<div className='docker-outline-header-label'>
				<span>{langs.title}</span>
			</div>
		</div>);
	},
	renderChildren: function() {
		if (this.state.expanded) {
			return <Folders parent={this.getFile()} />;
		} else {
			return null;
		}
	},
	renderBody: function() {
		return (<div className='docker-outline-body'>
			<div className='outline-navigator'>
				<ul className='outline-navigator-root'>
					<li className='node-root node-open node-directory'
						ref='node'>
						<i className='mdi mdi-newspaper'
						   onClick={this.onNodeClicked}
						   onContextMenu={this.onContextMenuClicked} />
						<span title={this.state.root}
							  onClick={this.onNodeClicked}
							  onContextMenu={this.onContextMenuClicked}>
							{this.state.root}
						</span>
						{this.renderChildren()}
					</li>
				</ul>
			</div>
		</div>);
	},
	render: function() {
		return (<div className='docker-outline'>
			{this.renderHeader()}
			{this.renderBody()}
		</div>);
	},
	getFile: function() {
		return this.state.root;
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
