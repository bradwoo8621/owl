const $ = require('jquery');
const {Commander, Commands} = require('../../../common/commander');
const router = require('../../common/router');

let commander = new Commander();

class Trailer {
	initialize() {
		$('.introduce-btn').click((evt) => {
			this.onIntroduceButtonClicked(evt);
		});
	}
	onIntroduceButtonClicked(evt) {
		let currentWindow = router.getCurrentWindow();
		commander.toggleFullScreen(currentWindow).toggleMenuBar(currentWindow);
		let button = $(evt.target);
		button.parent().one('transitionend', (evt) => {
			this.onIntroduceHide(evt);
		}).addClass('fadeout');
		return this;
	}
	onIntroduceHide(evt) {
		$(evt.target).addClass('hide');
		let mainDIV = $('#main');
		mainDIV.addClass('show');
		this.paintCanvas().enableInterval();
		this.startFirstEpisode();
	}
	paintCanvas() {
		let block = this.paintCanvasBlock();
		
		let canvas = $('#canvas');
		let canvasDOM = canvas[0];
		let context = canvasDOM.getContext('2d');

		let width = canvas.outerWidth(), 
			height = canvas.outerHeight();
		// set absolute size
		canvasDOM.width = width;
		canvasDOM.height = height;
		let blockWidth = block.width, 
			blockHeight = block.height;
		
		let tileNumH = Math.ceil(width / blockWidth),
			tileNumV = Math.ceil(height / blockHeight);

		for(let x = 0; x < tileNumH; x++) {
			for(let y = 0; y < tileNumV; y++) {
				context.drawImage(
					block.canvas,
					0, 0, blockWidth, blockHeight,                                                        
					x * blockWidth, y * blockHeight, blockWidth, blockHeight
				);
			}
		}
		return this;
	}
	paintCanvasBlock() {
		let canvas = document.createElement('canvas');
		let context= canvas.getContext('2d');
		// size
		let blockWidth = 300,
			blockHeight = 150,
			pixelWidth = 2,
			pixelHeight = 2;

		for (let y = 0; y < blockHeight; y += pixelHeight) {
			for (let x = 0; x < blockWidth; x += pixelWidth) {
				let color = Math.floor(Math.random() * 150);
				context.fillStyle = `rgba(${color}, ${color}, ${color}, 1)`;
				context.fillRect(x, y, pixelWidth, pixelHeight);
			}
		}
		return {
			canvas: canvas,
			height: blockHeight,
			width: blockWidth,
			pixelHeight: pixelHeight,
			pixelWidth: pixelWidth
		};
	}
	enableInterval() {
		this.interval = setInterval(this.paintCanvas.bind(this), 66);
		return this;
	}
	stopInterval() {
		if (this.interval != null) {
			clearInterval(this.interval);
			delete this.interval;
		}
		return this;
	}
	startFirstEpisode() {
		setTimeout(() => {
			let first = $('.first-episode');
			first.addClass('show');
			setTimeout(() => {
				let watch = first.find('.watch');
				watch.addClass('show');
				setTimeout(() => {
					this.startPartOfOne();
				}, 3000);
			}, 1000);
		}, 2000);
	}
	startPartOfOne() {
		$('.first-episode .part').one('transitionend', () => {
			this.closeFirstEpisode();
		}).addClass('show');
	}
	closeFirstEpisode() {
		let first = $('.first-episode');
		first.find('.watch').one('transitionend', () => {
			first.addClass('hide');
			this.startSecondEpisode();
		});
		first.addClass('fadeout');
	}
	startSecondEpisode() {
		let second = $('.second-episode');
		second.addClass('show');
		setTimeout(() => {
			this.startFor();
		}, 2000);
	}
	startFor() {
		$('.second-episode .for').one('transitionend', () => {
			this.startThanks();
		}).addClass('fadein');
	}
	startThanks() {
		$('.second-episode .thanks').scrollTop(0).animate({
			scrollTop: 560
		}, 16000, () => {
			this.startThirdEpisode();
		});
	}
	startThirdEpisode() {
		$('.third-episode').addClass('show');
	}
}

let trailer = new Trailer();
$(function() {
	trailer.initialize();
});

module.exports = trailer;
