const dialog = require('electron').remote.dialog;

const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');

const locale = require('../locale');
const config = require('../../config');
const route = require('../../route');
const langs = locale.load('index');

const envs = require('../envs/project-env');

const Projects = React.createClass({
	getInitialState: function() {
		return {};
	},
	renderRecentProject: function(projectFolder, projectIndex) {
		return (<div className='recent-project'
					 ref='recents'
					 key={projectIndex}>
			<i className='mdi mdi-folder-star folder-icon' />
			<span onClick={this.onRecentProjectClicked.bind(this, projectFolder)}>{projectFolder}</span>
			<i className='mdi mdi-close-circle remove-folder-btn'
			   onClick={this.onFolderRemoveClicked.bind(this, projectFolder)} />
		</div>);
	},
	renderNoRecent: function() {
		return (<div className='recent-project no-recent-project'
					 ref='recents'>
			<span>{langs.noRecent}</span>
		</div>);
	},
	renderRecentProjects: function() {
		let recents = this.getRecentProjects().reverse();
		return (<div className='recent-projects'>
			<div className='recent-projects-title'>
				<span>{langs.recentProjects}</span>
			</div>
			{recents.map(this.renderRecentProject)}
			{recents.length == 0 ? this.renderNoRecent() : null}
		</div>);
	},
	renderNewProject: function() {
		return (<div className='new-project'
					 ref='new'>
			<span onClick={this.onNewProjectClicked}>{langs.newProject}</span>
		</div>);
	},
	renderProjectLoading: function() {
		return (<div className='project-progress hidden'
					 ref='progress'>
			<div className='progress-bar progress-bar-striped'
				 role='progressbar'>
				<span className='percentage' />
			</div>
		</div>);
	},
	render: function() {
		return (<div className='projects-section'>
			{this.renderRecentProjects()}
			{this.renderNewProject()}
			{this.renderProjectLoading()}
		</div>);
	},
	onNewProjectClicked: function() {
		dialog.showOpenDialog({
			properties: ['openDirectory']
		}, this.onNewProjectSelected);
	},
	onNewProjectSelected: function(folders) {
		if (typeof folders === 'undefined') {
			// do nothing
			return;
		}

		this.setCurrentProject(folders[0]);
	},
	onRecentProjectClicked: function(folder) {
		this.setCurrentProject(folder);
	},
	onFolderRemoveClicked: function(folder) {
		let recentProjects = this.getRecentProjects();
		let inRecentIndex = recentProjects.indexOf(folder);
		if (inRecentIndex != -1) {
			recentProjects.splice(inRecentIndex, 1);
		}
		config.set(config.RECENT_PROJECTS, recentProjects);
		this.forceUpdate();
	},
	setCurrentProject: function(folder) {
		$(ReactDOM.findDOMNode(this.refs.progress)).removeClass('hidden');
		this.state.projectInitialized = false;
		this.state.percentage = 1;
		this.state.progressTimer = setInterval(this.runProgress.bind(this, folder), 10);
		this.checkProjectIndexJSONFile(folder);
	},
	runProgress: function(folder) {
		let progress = $(ReactDOM.findDOMNode(this.refs.progress));
		let bar = progress.find('.progress-bar');
		let progressPercentLabel = progress.find('span.percentage');

		if ((!this.state.projectInitialized && this.state.percentage < 95)
			|| this.state.projectInitialized) {
			this.state.percentage++;
		}
		progressPercentLabel.text(this.state.percentage + '%');
		bar.width(this.state.percentage + '%');
		if (this.state.percentage === 100) {
			this.openProjectFolder(folder);
			clearInterval(this.state.progressTimer);
		}
	},
	getRecentProjects: function() {
		return config.get(config.RECENT_PROJECTS, []);
	},
	checkProjectIndexJSONFile: function(folder) {
		envs.initProjectStructure(folder, this.projectIndexInitialized);
	},
	projectIndexInitialized: function() {
		this.state.projectInitialized = true;
	},
	openProjectFolder: function(folder) {
		// set current project
		config.set(config.CURRENT_PROJECT, folder);

		let recentProjects = this.getRecentProjects();
		let inRecentIndex = recentProjects.indexOf(folder);
		if (inRecentIndex != -1) {
			recentProjects.splice(inRecentIndex, 1);
		}
		recentProjects.push(folder);
		if (recentProjects.length > 10) {
			recentProjects.shift();
		}
		config.set(config.RECENT_PROJECTS, recentProjects);

		route.relocate('/app/working-file.html');
	}
});

module.exports = {
	render: function(dockerId, callback) {
		return ReactDOM.render(<Projects />, 
				window.document.getElementById(dockerId),
				callback);
	}
}