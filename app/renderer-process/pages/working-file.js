require("babel-register")({
	"presets": ["react"],
	"plugins": ["transform-react-jsx"]
});

const $ = require('jquery');
const q = require('q');

$(window).load(function() {
	const bottomDockerRenderer = require('../docker/bottom-docker');
	const mainContentRenderer = require('../content/main');

	let dockerPromise = q.defer();
	let contentPromise = q.defer();

	let bottomDocker = bottomDockerRenderer.render('bottom-docker-bar', function() {
		dockerPromise.resolve();
	});
	let mainContent = mainContentRenderer.render('main-content', function() {
		contentPromise.resolve();
	});

	q.all([dockerPromise.promise, contentPromise.promise])
		.then(function() {
			$('#page-loading .loader').one('transitionend', function() {
				$('#page-loading').hide();
			}).addClass('loaded');
		});
});
