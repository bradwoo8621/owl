const React = require('react');
const ReactDOM = require('react-dom');

const Cell = {
	title: 'Cell',
	a: 'styles-cell',
	desc: (<div className='section-body-fragment'>
		<div>A div is created for wrapping the component when the <span className='keyword'>cell</span> attribute is defined(if <code className='inline javascript'>position.width</code> or <code className='inline javascript'>position.clear</code> is defined, div also is created, they are the same DIV DOM).</div>
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
};
const Comp = {
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
};
const ViewMode = {
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
};
const NormalLine = {
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
};
const FocusLine = {
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
};

const Styles = {
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
	children: [Cell, Comp, ViewMode, NormalLine, FocusLine]
};
module.exports = Styles;