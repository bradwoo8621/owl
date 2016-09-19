const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const {remote} = require('electron');
const {Menu, MenuItem, dialog} = remote;

const locale = require('../../locale');
const config = require('../../../config');
const envs = require('../../envs/project-env');

const classnames = require('classnames');
const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');

const langs = locale.load('docker/outline');

const FileNameInput = React.createClass({
	statics: {
		DIR: 'dir',
		FILE: 'file',
		show: function(options) {
			let div = $('#outline-folder-name-input-div');
			if (div.length == 0) {
				div = $('<div id="outline-folder-name-input-div">').appendTo($('body'));
			}
			let offset = $(ReactDOM.findDOMNode(options.node)).offset();
			let props = {
				parent: options.parent,
				type: options.type,
				top: 'calc(' + offset.top + 'px + 2em)',
				left: 40,
				callback: options.callback
			};
			ReactDOM.render(<FileNameInput {...props} />, div[0]);
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
		$(document).on('click', this.onDocumentClicked);
	},
	componentWillUnmount: function() {
		$(document).off('click', this.onDocumentClicked);
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
				  {this.isDirectory() ? langs.folderName : langs.pageName}
			</span>
			<input type='text' 
				   ref='text'
				   onKeyUp={this.onKeyUp} />
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
		let newFileName = $(ReactDOM.findDOMNode(this.refs.text)).val();

		let fileType = this.getFileType();
		if (fileType === FileNameInput.DIR) {
			newFileName = newFileName.replace(/\./g, '-');
			this.state.path = path.join(this.props.parent, newFileName);
			fsExtra.mkdirs(this.state.path, this.onFileCreated);
		} else if (fileType === FileNameInput.FILE) {
			let extName = path.extname(newFileName);
			if (extName === '.js') {
				newFileName = newFileName.substr(0, newFileName.length - 3).replace(/\./g, '-') + '.js';
			} else {
				newFileName = newFileName.replace(/\./g, '-') + '.js';
			}
			this.state.path = path.join(this.props.parent, newFileName);
			fsExtra.mkdirs(path.dirname(this.state.path));
			fs.open(this.state.path, 'wx', this.onFileCreated);
		} else {
			console.error('Unsupported file type [' + fileType + ']');
		}
	},
	onDocumentClicked: function(evt) {
		let container = ReactDOM.findDOMNode(this.refs.container);
		if (container == evt.target || $.contains(container, evt.target)) {
			return;
		}
		FileNameInput.hide();
	},
	onFileCreated: function() {
		if (arguments.length > 0 && arguments[0]) {
			this.setState({error: arguments[0].message});
		} else {
			if (this.getFileType() === FileNameInput.FILE) {
				fs.close(arguments[1], function() {
					this.onFileCreatedCallback();
				}.bind(this));
			} else {
				this.onFileCreatedCallback();
			}
		}
	},
	onFileCreatedCallback: function() {
		this.getCallback().call(this, this.state.path, this.getFileType());
		FileNameInput.hide();
	},
	onEscapeKeyUp: function(evt) {
		FileNameInput.hide();
	},
	getParentFolder: function() {
		return this.props.parent;
	},
	getErrorMessage: function() {
		return this.state.error;
	},
	getCallback: function() {
		return this.props.callback;
	},
	getFileType: function() {
		return this.props.type;
	},
	isDirectory: function() {
		return this.getFileType() === FileNameInput.DIR;
	}
});

const ContextMenuMixin = {
	onNodeClicked: function() {
		let file = this.getFile();
		let fileState = envs.fileState(file);
		if (fileState.dir) {
			this.onDirectoryClicked(fileState);
		} else if (fileState.file) {
			this.onFileClicked(fileState);
		}
	},
	onDirectoryClicked: function(state) {
		if (!state.empty) {
			this.setState({expanded: !this.isExpanded()});
		}
	},
	onFileClicked: function(state) {
		if (state.page) {
			this.activeFile(state.file);
		}
	},
	onNodeDoubleClicked: function() {
		let file = this.getFile();
		let fileState = envs.fileState(file);
		if (fileState.file) {
			this.onFileDoubleClicked(fileState);
		}
	},
	onFileDoubleClicked: function(state) {
		if (state.page) {
			this.openFile(state.file);
		}
	},
	isExpanded: function() {
		return this.state.expanded;
	},
	onContextMenuClicked: function(evt) {
		evt.preventDefault();
		let file = this.getFile();
		let fileState = envs.fileState(file);
		if (fileState.dir) {
			this.onDirectoryContextMenuClicked(fileState);
		} else if (fileState.file) {
			this.onFileContextMenuClicked(fileState);
		}
	},
	onDirectoryContextMenuClicked: function(state) {
		if (state.pageRoot || state.pageDir) {
			// page folder or page root
			this.getDirectoryContextMenu(state).popup(remote.getCurrentWindow());
		}
	},
	onFileContextMenuClicked: function(state) {
		if (state.page) {
			this.getFileContextMenu(state).popup(remote.getCurrentWindow());
		}
	},
	getDirectoryContextMenu: function(state) {
		const menu = new Menu();
		menu.append(new MenuItem({
			label: langs.menu.newPage, 
			click: this.onNewFileClicked
		}));
		menu.append(new MenuItem({
			label: langs.menu.newFolder, 
			click: this.onNewDirectoryClicked
		}));
		if (!state.pageRoot) {
			menu.append(new MenuItem({type: 'separator'}));
			menu.append(new MenuItem({
				label: langs.menu.deleteFolder, 
				click: this.onDeleteDirectoryClicked
			}));
		}
		return menu;
	},
	onNewDirectoryClicked: function() {
		FileNameInput.show({
			parent: this.getFile(),
			node: this.refs.node,
			type: FileNameInput.DIR,
			callback: this.onSubDirectoryCreated
		});
	},
	onSubDirectoryCreated: function() {
		this.setState({expanded: true});
	},
	onNewFileClicked: function() {
		FileNameInput.show({
			parent: this.getFile(),
			node: this.refs.node,
			type: FileNameInput.FILE,
			callback: this.onFileCreated
		});
	},
	onFileCreated: function(path) {
		this.setState({expanded: true}, this.openFile.bind(this, path));
	},
	onDeleteDirectoryClicked: function() {
		dialog.showMessageBox(remote.getCurrentWindow(), {
			type: 'warning',
			buttons: [langs.ok, langs.cancel],
			title: langs.deleteFolder,
			message: langs.deleteFolderMsg,
			detail: this.getFile() + '\n' + langs.deleteFolderDetail
		}, this.onDeleteDirectoryConfirmed);
	},
	onDeleteDirectoryConfirmed: function(button) {
		if (button === 0) {
			fsExtra.remove(this.getFile(), this.onFolderDeleted);
		}
	},
	onFolderDeleted: function() {
		remote.getCurrentWebContents().send('folder-deleted', this.getFile());
		this.props.parent.getParentNode().forceUpdate();
	},
	activeFile: function(path) {
		remote.getCurrentWebContents().send('file-active', path);
	},
	openFile: function(path) {
		remote.getCurrentWebContents().send('file-open', path);
	},
	getFileContextMenu: function() {
		const menu = new Menu();
		menu.append(new MenuItem({
			label: langs.menu.openPage, 
			click: this.onOpenFileClicked
		}));
		menu.append(new MenuItem({type: 'separator'}));
		menu.append(new MenuItem({
			label: langs.menu.deletePage, 
			click: this.onDeleteFileClicked
		}));
		return menu;
	},
	onOpenFileClicked: function() {
		this.openFile(this.getFile());
	},
	onDeleteFileClicked: function() {
		dialog.showMessageBox(remote.getCurrentWindow(), {
			type: 'warning',
			buttons: [langs.ok, langs.cancel],
			title: langs.deletePage,
			message: langs.deletePageMsg,
			detail: this.getFile() + '\n' + langs.deletePageDetail
		}, this.onDeleteFileConfirmed);
	},
	onDeleteFileConfirmed: function(button) {
		if (button === 0) {
			fsExtra.remove(this.getFile(), this.onFileDeleted);
		}
	},
	onFileDeleted: function() {
		remote.getCurrentWebContents().send('file-deleted', this.getFile());
		this.props.parent.getParentNode().forceUpdate();
	},
	getFileBaseName: function() {
		return path.win32.basename(this.getFile());
	}
};

const Folders = React.createClass({
	renderFile: function(file, folderIndex) {
		return <Node file={file} 
					 parent={this}
					 key={folderIndex}/>;
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
		return this.props.parent.getFile();
	},
	getParentNode: function() {
		return this.props.parent;
	}
});
const Node = React.createClass({
	mixins: [ContextMenuMixin],
	getInitialState: function() {
		return {};
	},
	renderChildren: function(fileState) {
		if (fileState.dir && this.state.expanded) {
			return <Folders parent={this} />;
		} else {
			return null;
		}
	},
	render: function() {
		let file = this.getFile();
		let fileState = envs.fileState(file);
		let icon = {
			'fa fa-fw': true,
			'fa-folder-o': fileState.dir && fileState.empty,
			'fa-folder': fileState.dir && !fileState.empty && !this.isExpanded(),
			'fa-folder-open': fileState.dir && !fileState.empty && this.isExpanded(),
			'fa-file-o': fileState.file
		};
		let className = {
			'node-dir': fileState.dir,
			'node-file': fileState.file,
			'node-open': this.isExpanded(),
			'node-page-root': fileState.pageRoot,
			'node-page-dir': fileState.pageDir,
			'node-page-file': fileState.page
		};
		return (<li className={classnames(className)}
					ref='node'>
			<div className='node-text'>
				<i className={classnames(icon)} 
				   onClick={this.onNodeClicked}
				   onDoubleClick={this.onNodeDoubleClicked}
				   onContextMenu={this.onContextMenuClicked} />
				<span title={file}
					  onClick={this.onNodeClicked}
					  onDoubleClick={this.onNodeDoubleClicked}
					  onContextMenu={this.onContextMenuClicked}>
					{this.getFileBaseName()}
				</span>
			</div>
			{this.renderChildren(fileState)}
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
			return <Folders parent={this} />;
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
	open: true,
	
	onExpanded: function() {
		$('body').addClass('left-docker-expanded');
	},
	onCollapsed: function() {
		$('body').removeClass('left-docker-expanded');
	}
};
