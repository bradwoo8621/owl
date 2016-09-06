const dialog = require('electron').remote.dialog;

const React = require('react');
const ReactDOM = require('react-dom');

const locale = require('../locale');
const config = require('../../config');
const route = require('../../route');
const langs = locale.load('index');

const Projects = React.createClass({
	renderRecentProject: function(projectFolder, projectIndex) {
		return (<div className='recent-project'
					 key={projectIndex}>
			<i className='mdi mdi-folder-star' />
			<span onClick={this.onRecentProjectClicked.bind(this, projectFolder)}>{projectFolder}</span>
		</div>);
	},
	renderNoRecent: function() {
		return (<div className='recent-project'>
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
		return (<div className='new-project'>
			<span onClick={this.onNewProjectClicked}>{langs.newProject}</span>
		</div>);
	},
	render: function() {
		return (<div className='projects-section'>
			{this.renderRecentProjects()}
			{this.renderNewProject()}
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
	setCurrentProject: function(folder) {
		// set current project
		config.set(config.CURRENT_PROJECT, folder);

		let recentProjects = this.getRecentProjects();
		let inRecentIndex = recentProjects.indexOf(folder);
		if (inRecentIndex != -1) {
			recentProjects.splice(inRecentIndex, 1);
		}
		recentProjects.push(folder);
		config.set(config.RECENT_PROJECTS, recentProjects);

		route.relocate('/app/working-file.html');
	},
	getRecentProjects: function() {
		return config.get(config.RECENT_PROJECTS, []);
	}
});

ReactDOM.render(<Projects />, document.getElementById('work-area'));