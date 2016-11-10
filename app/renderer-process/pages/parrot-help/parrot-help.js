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

const all = [{
	title: 'Concept',
	a: 'concept'
}, {
	title: 'Component',
	a: 'component',
	children: [{
		title: 'Styles',
		a: 'styles',
		desc: (<div className='section-body-fragment'>
			<div>Each component should has its specific styles.</div>
			<div>Value of class name can be a function or any format which can recognized by <span className='third-party'>classnames</span>.</div>
			<div>If it is a function, should returns format following <span className='third-party'>classnames</span>.</div>
			<div>
				<span className='third-party'>classnames</span> supports <span className='keyword'>string</span>, <span className='keyword'>number</span>, <span className='keyword'>JSON</span>, <span className='keyword'>null</span> or <span className='keyword'>undefined</span> and <span className='keyword'>array</span>.</div>
		</div>),
		code: {
			code: `styles: {
	cell: 'your-cell-class-name',
	comp: 'your-comp-class-name',
	view: 'your-view-mode-class-name',
	'normal-line': 'your-normal-line-class-name',
	'focus-line': 'your-focus-line-class-name'
}`
		},
		children: [{
			title: 'Cell',
			a: 'styles-cell',
			desc: (<div className='section-body-fragment'>
				<div>A div is created for wrapping the component when the <span className='keyword'>cell</span> attribute is defined.</div>
				<div>Cell class is used to change the styles on DOMs which contains in cell, but outside of component.</div>
				<div>eg. label, validation results, etc.</div>
			</div>),
			code: [{
				type: 'desc',
				code: <div className='example'>Example:</div>
			}, {
				code: `styles: {cell: 'your-cell-class-name'}`
			}, {
				type: 'desc',
				code: 'DOM should be:'
			}, {
				type: 'html',
				code: `<div class='your-cell-class-name'>
	<div class='n-text'>
	</div>
</div>`
			}]
		}, {
			title: 'Component',
			a: 'styles-component',
			desc: (<div className='section-body-fragment'>
				<div>Class is added on root DOM of the component when the <span className='keyword'>comp</span> attribute is defined.</div>
				<div>Component class is used to change the styles on DOMs which inside of component.</div>
				<div>eg. addons on <span className='keyword'>NText</span>, etc.</div>
			</div>),
			code: [{
				type: 'desc',
				code: <div className='example'>Example:</div>
			}, {
				code: `styles: {comp: 'your-comp-class-name'}`
			}, {
				type: 'desc',
				code: 'DOM should be:'
			}, {
				type: 'html',
				code: `<div class='your-comp-class-name n-text'></div>`
			}]
		}, {
			title: 'View Mode',
			a: 'styles-view-mode',
			desc: (<div className='section-body-fragment'>
				<div>Class is added on root DOM of the component when the <span className='keyword'>view</span> attribute is defined.</div>
				<div>View mode class is used to change the styles on DOMs which inside of component.</div>
				<div>eg. addons on <span className='keyword'>NText</span>, etc.</div>
				<div>
					Note that view mode class is only effective on component which renderred as standard view mode, 
					such as <span className='keyword'>NText</span>. 
					In the following example, a <span className='keyword'>NText</span> will be renderred as <span className='keyword'>NLabel</span>,
					which means the DOM structure is following the <span className='keyword'>NLabel</span>, not <span className='keyword'>NText</span> anymore.
					To check the component is renderred as standard view mode, follow the rules:
					<ul>
						<li>No additional renderer is defined via <code className='inline javascript'>Envs.setViewModeRenderer()</code>,</li>
						<li>Returns <span className='keyword'>false</span> on <code className='inline javascript'>NComponent.isViewModeSameAsNormal()</code>.</li>
					</ul>
				</div>
			</div>),
			code: [{
				type: 'desc',
				code: <div className='example'>Example:</div>
			}, {
				code: `styles: {view: 'your-view-mode-class-name'}`
			}, {
				type: 'desc',
				code: 'DOM should be:'
			}, {
				type: 'html',
				code: `<div class='your-view-mode-class-name n-label'></div>`
			}]
		}, {
			title: 'Normal Underline',
			a: 'styles-normal-line',
			desc: (<div className='section-body-fragment'>
				<div>Class is added on normal underline DOM <span className='keyword'>hr</span> of the component if exists.</div>
			</div>),
			code: [{
				type: 'desc',
				code: <div className='example'>Example:</div>
			}, {
				code: `styles: {'normal-line': 'your-normal-line-class-name'}`
			}, {
				type: 'desc',
				code: 'DOM should be:'
			}, {
				type: 'html',
				code: `<div class='n-text'>
	<hr class='n-normal-line your-normal-line-class-name'></hr>
</div>`
			}]
		}, {
			title: 'Focus Underline',
			a: 'styles-focus-line',
			desc: (<div className='section-body-fragment'>
				<div>Class is added on focus underline DOM <span className='keyword'>hr</span> of the component if exists.</div>
			</div>),
			code: [{
				type: 'desc',
				code: <div className='example'>Example:</div>
			}, {
				code: `styles: {'focus-line': 'your-focus-line-class-name'}`
			}, {
				type: 'desc',
				code: 'DOM should be:'
			}, {
				type: 'html',
				code: `<div class='n-text'>
	<hr class='n-focus-line your-focus-line-class-name'></hr>
</div>`
			}]
		}]
	}]
}];

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