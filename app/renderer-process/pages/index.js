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
			<i className='mdi mdi-folder-star folder-icon' />
			<span onClick={this.onRecentProjectClicked.bind(this, projectFolder)}>{projectFolder}</span>
			<i className='mdi mdi-close-circle remove-folder-btn'
			   onClick={this.onFolderRemoveClicked.bind(this, projectFolder)} />
		</div>);
	},
	renderNoRecent: function() {
		return (<div className='recent-project no-recent-project'>
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
	},
	getRecentProjects: function() {
		return config.get(config.RECENT_PROJECTS, []);
	}
});

ReactDOM.render(<Projects />, document.getElementById('work-area'));

let ctx = document.getElementById('about-logo').getContext('2d');
let canvas = {width: 640, height: 272};
let pic = {width: 256, height: 256};
let offset = {x: (canvas.width - pic.width) / 2, y: (canvas.height - pic.height) / 2};
let image = new Image();
let pixels = null;
let duration = 100;
let timerId = null;

require('jquery')('#about-logo').prop(canvas);

const ease = function(time, start, offset, duration) {
	time /= duration / 2;
	if (time < 1) {
		return offset / 2 * Math.pow(2, 10 * (time  - 1)) + start;
	}
	time--;
	return offset / 2  * (-Math.pow(2, -10 * time) + 2) + start;
};
const animate = function() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	let pixelLength = pixels.length;
	for (let index = 0; index < pixelLength; index++) {
		let pixel = pixels[index];
		ctx.fillStyle = pixel.color;
		if (pixel.currentTime < duration) {
			let currentX = ease(pixel.currentTime, pixel.startX, offset.x + pixel.x - pixel.startX, duration);
			let currentY = ease(pixel.currentTime, pixel.startY, offset.y + pixel.y - pixel.startY, duration);
			// console.log(currentX, currentY);
			ctx.fillRect(currentX, currentY, 1, 1);
			pixel.currentX = currentX;
			pixel.currentY = currentY;
			pixel.currentTime++;
		} else {
			// pixel reach end already, paint at end anyway
			ctx.fillRect(offset.x + pixel.x, offset.y + pixel.y, 1, 1);
		}
	}
	if (pixels[pixels.length - 1].currentTime >= duration) {
		clearInterval(timeId);
	}
};
const gatherPixels = function(image) {
	let pixels = [];
	let imageLength = image.data.length;

	let rows = pic.height / 2,
		cols = pic.width / 2,
		widthStep = parseInt(image.width / cols),
		heightStep = parseInt(image.height / rows);
	let imageData = image.data;	// pixels

	let parseColor = function(value) {
		return parseInt(255 * Math.random());
	};
	for (let colIndex = 0; colIndex < cols; colIndex++) {
		for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
			// calc the position of pixel's R
			let pos = ((heightStep * rowIndex) * image.width + (widthStep * colIndex)) * 4;
			let r = imageData[pos],
				g = imageData[pos + 1],
				b = imageData[pos + 2],
				a = imageData[pos + 3];
			// console.log(pos, r, g, b, a);
			if (a !== 0) {
				let pixel = {
					x: image.x + colIndex * widthStep + (Math.random() - 0.5) * 5,
					y: image.y + rowIndex * heightStep + (Math.random() - 0.5) * 5,
					color: 'rgba(' + parseColor(r) + ',' + parseColor(g) + ',' + parseColor(b) + ',' + 1 + ')'
				};
				pixels.push(pixel);
			}
		}
	}
	return pixels;
};
const calcPixelStartPositions = function(pixels) {
	// let xStep = canvas.width / pic.width;
	// let yStep = canvas.height / pic.height;
	// pixels.forEach(function(pixel, pixelIndex) {
	// 	pixel.startX = pixel.x * xStep;
	// 	pixel.startY = pixel.y * yStep;
	// });
	// return pixels;
	let step = (canvas.width * canvas.height) / pixels.length;
	// console.log(step);
	return pixels.map(function(pixel, pixelIndex) {
		let newIndex = parseInt(pixelIndex * step);
		pixel.startX = newIndex % canvas.width + (Math.random() - 0.5) * 10;
		pixel.startY = parseInt(newIndex / canvas.width) + (Math.random() - 0.5) * 10;
		return pixel;
	});
};

image.onload = function() {
	ctx.drawImage(image, offset.x, offset.y);

	pixels = gatherPixels({
		data: ctx.getImageData(offset.x, offset.y, pic.width, pic.height).data,
		x: 0, 
		y: 0,
		width: pic.width,
		height: pic.height	
	});
	// console.log(pixels.length, pixels);
	ctx.clearRect(offset.x, offset.y, pic.width, pic.height);
	calcPixelStartPositions(pixels).map(function(pixel) {
		pixel.currentTime = 0;
		return pixel;
	}).forEach(function(pixel) {
		ctx.fillStyle = pixel.color;
		ctx.fillRect(pixel.startX, pixel.startY, 1, 1);
	});
	setTimeout(function() {
		timeId = setInterval(animate, 20);	
	}, 2000);
	
};
image.src = 'assets/app-icon/png/256-colorful.png';