const $ = require('jquery');

class Home {
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
	canvasClicked() {
		$('body').one('transitionend', () => {
			$('#main').addClass('hide');
			this.stopInterval();
		}).click(() => {
			$('#main').addClass('fadeout');
		});
		return this;
	}
}

let home = new Home();
home.paintCanvas().enableInterval().canvasClicked();

module.exports = home;