const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const classnames = require('classnames');
const hljs = require('highlightjs');

// commands constants
const {Commands} = require('../../../common/commander');
// router for handle default webContents commands
const router = require('../../common/router');

// electron related
const electron = require('electron');
const {ipcRenderer} = electron;

class ContentSection extends React.Component {
	renderCode() {
		let code = this.getCode();
		if (code) {
			let codes = Array.isArray(code) ? code : [code];
			return codes.map((code, codeIndex) => {
				let type = code.type ? code.type : 'javascript';
				if (type === 'desc') {
					return (<div className='section-code-desc'
								key={codeIndex}>
						{code.code}
					</div>);
				} else {
					return (<div className='section-code'
								 key={codeIndex}>
						<pre><code className={type}>{code.code}</code></pre>
					</div>);
				}
			});
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
				{this.renderCode()}
			</div>
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

class Guide extends React.Component {
	constructor(props) {
		super(props);
		this.onGuideClicked = this.onGuideClicked.bind(this);
	}
	componentDidMount() {
		let anchors = $('a.section-anchor');
		$(window).on('scroll', () => {
			let top = $(window).scrollTop() + 80;
			let currents = anchors.toArray().map((anchor) => {
				if ($(anchor).offset().top < top) {
					return anchor;
				}
			}).filter((anchor) => {
				return anchor != null;
			});
			if (currents.length > 0) {
				let anchorId = currents[currents.length - 1].id;
				let guideAnchors = $(ReactDOM.findDOMNode(this.refs.me)).find(`a.guide-anchor`);
				let anchor = guideAnchors.toArray().find((anchor) => {
					return $(anchor).attr('href') == `#${anchorId}`;
				});
				let lis = $(anchor).parents('li');
				lis.siblings().removeClass('active');
				$(anchor).parents('li').addClass('active');
			}
		});
	}
	componentWillUnmount() {
		$(window).off('scroll');
	}
	renderContentChildren(content, level) {
		if (!content.children || content.children.length == 0) {
			return null;
		}
		return (<ul>
			{content.children.map((content, contentIndex) => {
				return this.renderContent(content, contentIndex, level);
			})}
		</ul>);
	}
	renderContent(content, contentIndex, level) {
		return (<li className={`guide-${level}`}
					key={contentIndex}>
			<a href={`#${content.a}`}
			   className='guide-anchor'
			   onClick={this.onGuideClicked}>
				{content.title}
			</a>
			{this.renderContentChildren(content, level + 1)}
		</li>);
	}
	render() {
		return (<div className='guide'
					 ref='me'>
			<ul>
				{this.getContents().map((content, contentIndex) => {
					return this.renderContent(content, contentIndex, 0);
				})}
			</ul>
		</div>);
	}
	getContents() {
		return this.props.contents;
	}
	onGuideClicked(evt) {
		let target = $(evt.target);
		let parent = target.parent();
		let siblings = parent.siblings();
		siblings.removeClass('active');
		siblings.find('li').removeClass('active');
		parent.addClass('active');
	}
}
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
		return ReactDOM.render(<Guide contents={all} />, document.getElementById('guide'));
	}
}

const all = [
	require('./parrot-help-concept'), 
	require('./parrot-help-component')
];

const helper = new Helper();
helper.paintContent();
helper.paintGuide();
hljs.initHighlightingOnLoad();

ipcRenderer.on(Commands.SCROLL_TO, (evt, hash) => {
	if (hash) {
		window.location.hash = hash;
	}
});

module.exports = helper;