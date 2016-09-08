const fs = require('fs');
const path = require('path');
const extfs = require('extfs');

const locale = require('../../locale');
const config = require('../../../config');

const classnames = require('classnames');
const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');

const langs = locale.load('docker/outline');

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
		return (<li className={classnames(className)}>
			<i className={classnames(icon)} 
			   onClick={this.onNodeClicked} />
			<span title={file}
				  onClick={this.onNodeClicked}>
				{path.basename(file)}
			</span>
			{this.renderChildren()}
		</li>);
	},
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
	renderBody: function() {
		return (<div className='docker-outline-body'>
			<div className='outline-navigator'>
				<ul className='outline-navigator-root'>
					<li className='node-root node-open node-directory'>
						<i className='mdi mdi-newspaper' />
						<span title={this.state.root}>{this.state.root}</span>
						<Folders parent={this.state.root} />
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
