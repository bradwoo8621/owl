const {ipcRenderer, remote} = require('electron');
const {Menu, MenuItem} = remote;

const path = require('path');
const classnames = require('classnames');

const parrot = require('../parrot-components');
const ComponentReceiverMixin = parrot.ComponentReceiverMixin;
const $ = parrot.parrot.jquery;
const React = parrot.parrot.react;
const ReactDOM = parrot.parrot.reactDOM;

const locale = require('../locale');
const langs = locale.load('content/file-tab');

ipcRenderer.on('file-active', function(evt, file) {
	if (fileTab) {
		fileTab.activeFile(file);
	}
});
ipcRenderer.on('file-open', function(evt, file) {
	if (fileTab) {
		fileTab.openFile(file);
	}
});
ipcRenderer.on('file-deleted', function(evt, file) {
	if (fileTab) {
		fileTab.removeFile(file)
	}
});
ipcRenderer.on('folder-deleted', function(evt, folder) {
	if (fileTab) {
		fileTab.removeFileInFolder(folder)
	}
});

const FileTab = React.createClass({
	mixins: [ComponentReceiverMixin],
	componentDidMount: function() {
		this.paintTabsTitle();
	},
	componentDidUpdate: function() {
		this.paintTabsTitle();
	},
	paintTabShoulder: function(canvasIndex, canvas) {
		let ctx = canvas.getContext('2d');
		let color;
		let borderColor;
		if ($(canvas).hasClass('active')) {
			color = '#00ACC1';
			borderColor = '#00838F';
		} else {
			color = '#80CBC4';
			borderColor = '#26A69A';
		}

		ctx.fillStyle = color;
		ctx.lineWidth = 2;
		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.moveTo(0, 30);
		ctx.bezierCurveTo(9.2, 17, 10.8, 0, 20, 0);
		ctx.lineTo(20, 30);
		ctx.fill();

		ctx.strokeStyle = borderColor;
		ctx.beginPath();
		ctx.moveTo(0, 30);
		ctx.bezierCurveTo(9.2, 17, 10.8, 0, 20, 1);
		ctx.stroke();
	},
	paintTabsTitle: function() {
		let tabs = $(ReactDOM.findDOMNode(this.refs.tabs));
		tabs.find('canvas').each(this.paintTabShoulder);
	},
	renderSingleTabTitle: function(file, fileIndex) {
		let active = file === this.getActiveFile();
		let styles = {
			zIndex: active ? '' : (999 - fileIndex)
		};
		return (<li className={classnames('main-content-tab-title', {active: active})}
					style={styles}
					key={fileIndex}>
			<canvas className={classnames('left', {active: active})}
					height='30'
					width='20'
					onMouseMove={this.onTabShoulderMouseMove}
					onClick={this.onTabTitleLabelClicked.bind(this, file)}
					onContextMenu={this.onContextMenuClicked.bind(this, file)} />
			<div className='main-content-tab-title-content'>
				<span className='main-content-tab-label'
					  title={file}
					  onClick={this.onTabTitleLabelClicked.bind(this, file)}
					  onContextMenu={this.onContextMenuClicked.bind(this, file)}>
					{this.getFileBaseName(file)}
				</span>
				<i className='fa fa-fw fa-close'
				   title={file}
				   onClick={this.onTabCloseClicked.bind(this, file)}
				   onContextMenu={this.onContextMenuClicked.bind(this, file)} />
			</div>
			<canvas className={classnames('right', {active: active})}
					height='30' 
					width='20' 
					onMouseMove={this.onTabShoulderMouseMove} 
					onClick={this.onTabTitleLabelClicked.bind(this, file)}
					onContextMenu={this.onContextMenuClicked.bind(this, file)} />
		</li>);
	},
	render: function() {
		let files = this.getFiles();
		if (!this.getActiveFile() && files.length > 0) {
			this.setActiveFile(files[0]);
		}

		return (<div className='main-content'>
			<ul className='main-content-tabs'
				ref='tabs'>
				<li className='main-content-tabs-nav'>
					<i className='fa fa-fw fa-caret-left' />
					<i className='fa fa-fw fa-caret-right' />
				</li>
				{files.map(this.renderSingleTabTitle)}
			</ul>
			<div className='component-receiver'
				 onDrop={this.onDrop}
				 onDragOver={this.onDragOver}
				 onDragEnter={this.onDragEnter}
				 onDragLeave={this.onDragLeave}>
				{this.renderComponents()}
			</div>
		</div>);
	},
	onContextMenuClicked: function(file, evt) {
		evt.preventDefault();
		const menu = new Menu();
		menu.append(new MenuItem({
			label: langs.menu.close,
			click: this.removeFile.bind(this, file)
		}));
		menu.append(new MenuItem({type: 'separator'}));
		menu.append(new MenuItem({
			label: langs.menu.closeOther,
			click: this.removeFileButCurrent.bind(this, file)
		}));
		menu.append(new MenuItem({
			label: langs.menu.closeAll,
			click: this.removeAllFiles
		}));
		menu.popup(remote.getCurrentWindow());
	},
	onTabTitleLabelClicked: function(file, evt) {
		let target = $(evt.target);
		if (target[0].tagName === 'canvas') {
			if (target.hasClass('left') && !this.isInTabLeftShoulder(pos)) {
				return;
			} else if (target.hasClass('right') && !this.isInTabRightShoulder(pos)) {
				return;
			}
		}
		this.activeTab(file);
	},
	onTabCloseClicked: function(file, evt) {
		this.removeFile(file);
	},
	onTabShoulderMouseMove: function(evt) {
		let canvas = $(evt.target);
		let checker = canvas.hasClass('left') ? this.isInTabLeftShoulder : this.isInTabRightShoulder;
		let pos = this.convertToRelativePosition(evt);
		if (checker.call(this, pos)) {
			canvas.addClass('cursor-pointer');
		} else {
			canvas.removeClass('cursor-pointer');
		}
	},
	isInTabLeftShoulder: function(pos) {
		return Math.atan((30 - pos.y) / pos.x) <= Math.atan(35 / 20);
	},
	isInTabRightShoulder: function(pos) {
		return Math.atan((30 - pos.y) / (pos.x - 20)) >= Math.atan(35 / -20);
	},
	convertToRelativePosition: function(evt) {
		let target = $(evt.target);
		let targetOffset = target.offset();
		return {
			x: evt.clientX - targetOffset.left + 1,
			y: evt.clientY - targetOffset.top + 1
		};
	},
	activeTab: function(file) {
		this.setActiveFile(file, true);
	},
	getActiveFile: function() {
		return this.state.activeFile;
	},
	setActiveFile: function(file, forceUpdate) {
		if (forceUpdate) {
			this.setState({activeFile: file});
		} else {
			this.state.activeFile = file;	
		}
	},
	getFiles: function() {
		return this.state.files ? this.state.files : [];
	},
	setFiles: function(files) {
		this.setState({files: files});
	},
	openFile: function(file) {
		let files = this.getFiles();
		if (files.indexOf(file) == -1) {
			files.push(file);
			files.sort(this.sortFile);
			this.state.files = files;
		}
		this.setActiveFile(file, true);
	},
	sortFile: function(f1, f2) {
		let p1 = this.getFileBaseName(f1);
		let p2 = this.getFileBaseName(f2);
		return p1.localeCompare(p2);
	},
	getFileBaseName: function(file) {
		return path.win32.basename(file);
	},
	activeFile: function(file) {
		let files = this.getFiles();
		if (files.indexOf(file) != -1) {
			this.setActiveFile(file, true);
		}
	},
	removeFile: function(file) {
		let files = this.getFiles();
		let index = files.indexOf(file);
		if (index != -1) {
			// find the file, and remove it
			files.splice(index, 1);
			if (this.getActiveFile() === file) {
				if (index === files.length) {
					// the removed file is the last one
					this.setState({
						activeFile: files.length === 0 ? null : files[files.length - 1],
						files: files
					});
				} else {
					// the removed file is not the last one
					this.setState({
						activeFile: files[index],
						files: files
					});
				}
			} else {
				this.setFiles(files);
			}
		}
	},
	removeFileInFolder: function(folder) {
		let files = this.getFiles().filter(function(file) {
			return !this.isFileInFolder(folder, file);
		}.bind(this));
		this.setFiles(files);
	},
	isFileInFolder: function(folder, file) {
		let dir = path.dirname(file);
		if (dir === folder) {
			// compare
			return true;
		} else if (dir === file) {
			// meet root
			return false;
		} else {
			// recursive
			return this.isFileInFolder(folder, dir);
		}
	},
	removeFileButCurrent: function(file) {
		this.setFiles([file]);
	},
	removeAllFiles: function(file) {
		this.setFiles(null);
	}
});

let fileTab;

module.exports = {
	render: function(dockerId, callback) {
		fileTab = ReactDOM.render(<FileTab />, 
				window.document.getElementById(dockerId),
				callback);
		return fileTab;
	}
}