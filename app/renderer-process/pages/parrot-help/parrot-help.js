const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const classnames = require('classnames');
const hljs = require('highlightjs');

// commands constants
const {Commands} = require('../../../common/commander');

// electron related
const electron = require('electron');
const {ipcRenderer} = electron;

class ContentSection extends React.Component {
	renderCode() {
		let code = this.getCode();
		if (code) {
			return (<div className='section-code'>
				<pre><code className='javascript'>{code}</code></pre>
			</div>);
		}
	}
	render() {
		let className = classnames('section', `section-lvl-${this.getLevel()}`);
		return (<div className={className}>
			<a id={this.getId()} className='section-anchor'></a>
			<div className='section-header'>
				{`${this.getIndex()} ${this.getTitle()}`}
			</div>
			<div className='section-body'>
				{this.getDescription()}
			</div>
			{this.renderCode()}
			<div className='section-children'>
				{this.getChildren().map((child, childIndex) => {
					let index = [this.getIndex(), childIndex + 1].join('.');
					return <ContentSection content={child}
										   index={index}
										   level={this.getLevel() + 1}
										   key={childIndex} />;
				})}
			</div>
		</div>);
	}
	getContent() {
		return this.props.content;
	}
	getTitle() {
		return this.getContent().title;
	}
	getLevel() {
		return this.props.level ? this.props.level : 0;
	}
	getChildren() {
		let children = this.getContent().children;
		return children ? children : [];
	}
	getIndex() {
		return this.props.index;
	}
	getDescription() {
		return this.getContent().desc;
	}
	getCode() {
		return this.getContent().code;
	}
	getId() {
		return this.getContent().a;
	}
}

const all = [{
	title: 'Concept',
	a: 'concept'
}, {
	title: 'Component',
	a: 'component',
	children: [{
		title: 'Styles',
		a: 'styles',
		desc: 'Each component should has its specific styles.',
		code: `styles: {
	cell: 'your-cell-class-name',
	comp: 'your-comp-class-name',
	view: 'your-view-mode-class-name',
	'normal-line': 'your-normal-line-class-name',
	'focus-line': 'your-focus-line-class-name'
}`,
		children: [{
			title: 'Cell',
			a: 'styles-cell'
		}, {
			title: 'Component',
			a: 'styles-component'
		}, {
			title: 'View Mode',
			a: 'styles-view-mode'
		}, {
			title: 'Normal Underline',
			a: 'styles-normal-line'
		}, {
			title: 'Focus Underline',
			a: 'styles-focus-line'
		}]
	}]
}];
class Helper {
	paintContent() {
		return ReactDOM.render((<div className='content'>
			{all.map((item, itemIndex) => {
				return <ContentSection content={item} 
									   index={itemIndex + 1}
									   key={itemIndex} />;
			})}
		</div>), document.getElementById('content'));
	}
	paintGuide() {

	}
}

const helper = new Helper();
helper.paintContent();
hljs.initHighlightingOnLoad();

ipcRenderer.on(Commands.SCROLL_TO, (evt, hash) => {
	if (hash) {
		window.location.hash = hash;
	}
});

module.exports = helper;