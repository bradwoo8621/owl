const React = require('react');
const ReactDOM = require('react-dom');

const Width = {
	title: 'Width',
	a: 'pos-width',
	desc: (<div className='section-body-fragment'>
		<div>Value of <span className='keyword'>width</span> can be number, string, JSON or function.</div>
		<div><ul>
			<li>
				When value is a number, it is converted to <code className='inline javascript'>`n-col-sm-value`</code>.
				<br/>
				eg: <code className='inline javascript'>width: 3 => n-col-sm-3</code>,
			</li>
			<li>
				When value is a string, and no comma, it is converted to <code className='inline javascript'>`n-col-sm-value`</code>.
				<br/>
				eg: <code className='inline javascript'>width: '3' => n-col-sm-3</code>,
			</li>
			<li>
				Or value is a string with comma, it is splitted with comma and converted to class names.
				<br/>
				eg: <code className='inline javascript'>width: 'sm-6,md-3' => n-col-sm-6 n-col-md-3</code>.
				<br/>
				It is a shortcut to define widths in different media widths.
				<br/>
				<span className='warning'>Note, prefix is 'n-col-'; and in previous two scenarios, prefix is 'n-col-sm-'</span>,
			</li>
			<li>
				When value is a JSON object, property key is used as width segment, and value is used as value segment.
				<br/>
				eg: <code className='inline javascript'>{'width: {sm: 6, md: 3}'} => n-col-sm-6 n-col-md-3</code>,
			</li>
			<li>At last, value also can be a function, which returns value following the previous formats.</li>
		</ul></div>
		<div>
			<span className='keyword'>width</span> is optional. Since the class <code className='inline javascript'>n-col-*</code> introduces <code className='inline javascript'>float: left</code> to component, which means if no <span className='keyword'>width</span> defined, component follows the original component CSS rules, might be a block or inline DOM.
		</div>
	</div>),
	code: [{
		type: 'desc',
		code: <div className='example'>Example:</div>
	}, {
		code: `pos: {
	width: 4
}
// or
pos: {
	width: 'sm-6,md-3'
}
// or
// => n-col-sm-hidden n-col-md-6 n-col-lg-3
pos: {
	width: {
		sm: 'hidden',
		md: '6',
		lg: 3
	}
}
// or use width attribute to declare clear together
// => n-col-sm-6 n-clear-none-sm n-col-md-3 n-clear-both-md
pos: {
	width: 'sm-6 n-clear-none-sm,md-3 n-clear-both-md'
}
// or add your own classes
// => n-col-sm-3 your-own-class-name
pos: {
	width: '3 your-own-class-name'
}`
	}]
};
const Row = {
	title: 'Row Index',
	a: 'pos-row',
	desc: (<div className='section-body-fragment'>
		<div>Row index defines relative row position in its container, default value is <span className='keyword'>9999</span>.</div>
		<div>Value of row index is used to compute the renderring order, cannot be found in DOM. And since it just declares the relative index, continuous numbers are not necessary.</div>
		<div>Number, string and function are supported.</div>
	</div>),
	code: [{
		type: 'desc',
		code: <div className='example'>Example:</div>
	}, {
		code: `pos: {
	row: 100
}
// or
pos: {
	row: function() {
		return this.isViewMode() ? 100 : 200;
	}
}`
	}]
};
const Column = {
	title: 'Column Index',
	a: 'pos-col',
	desc: (<div className='section-body-fragment'>
		<div>Column index defines relative column position in its row, default value is <span className='keyword'>9999</span>.</div>
		<div>Value of column index is used to compute the renderring order, cannot be found in DOM. And since it just declares the relative index, continuous numbers are not necessary.</div>
		<div>Number, string and function are supported.</div>
		<div>In responsible layout design, when container row cannot render current component in same row with previous components, current component should be auto wrapped to leading of current row. Learn <span className='third-party'>Bootstrap</span> to find more information about responsible design.</div>
	</div>),
	code: [{
		type: 'desc',
		code: <div className='example'>Example:</div>
	}, {
		code: `pos: {
	col: 100
}
// or
pos: {
	col: function() {
		return this.isViewMode() ? 100 : 200;
	}
}`
	}]
};
const Clear = {
	title: 'Row Wrapping',
	a: 'pos-clear',
	desc: (<div className='section-body-fragment'>
		<div>In responsible design, component position might be different under different media equipments, <span className='keyword'>row wrapping</span> attribute is designed for this purpose.</div>
		<div>Value of <span className='keyword'>row wrapping</span> can be boolean, string, JSON or function.</div>
		<div><ul>
			<li>
				When value is a boolean, it is converted to <code className='inline javascript'>`n-clear-both-sm`</code> or <code className='inline javascript'>`n-clear-none-sm`</code>.
				<br/>
				eg: <code className='inline javascript'>clear: true => n-clear-both-sm</code>,
			</li>
			<li>
				When value is a string, and no comma, it is converted to <code className='inline javascript'>`n-clear-sm-value`</code>.
				<br/>
				eg: <code className='inline javascript'>clear: 'both' => n-clear-sm-both</code>,
			</li>
			<li>
				When value is a string with comma, it is splitted with comma and converted to class names.
				<br/>
				eg: <code className='inline javascript'>clear: 'both:sm,none:md' => n-clear-both-sm n-clear-none-md</code>.
				<br/>
				For different widths, a white space can be used to split them.
				<br/>
				eg: <code className='inline javascript'>clear: 'both:sm md,none:lg' => n-clear-both-sm n-clear-both-md n-clear-none-lg</code>.
				<br/>
				It is a shortcut to define row warpping in different media widths,
			</li>
			<li>
				When value is a JSON object, property key is used as width segment, and value is used as value segment.
				<br/>
				eg: <code className='inline javascript'>{'clear: {sm: \'both\', md: \'none\'}'} => n-clear-both-sm n-clear-none-md</code>,
			</li>
			<li>At last, value also can be a function, which returns value following the previous formats.</li>
		</ul></div>
		<div>Parrot2 supports <span className='keyword'>both</span> and <span className='keyword'>none</span>, if there is more special requirements, define your own CSS classes.</div>
	</div>),
	code: [{
		type: 'desc',
		code: <div className='example'>Example:</div>
	}, {
		code: `pos: {
	clear: true
}
// or
pos: {
	clear: 'both'
}
// or
pos: {
	clear: 'both:sm md,none:lg'
}
// or
pos: {
	clear: {
		sm: true,
		md: false,
		lg: 'both',
		xl: 'none'
	}
}
// or
// => n-clear-both-sm n-clear-both-md n-clear-none-lg n-clear-right-xl
// defines n-clear-right-xl by yourself in your own css file
pos: {
	clear: 'both:sm md,none:lg,right:xl'  
}`
	}]
};
const Position = {
	title: 'Position',
	a: 'pos',
	desc: (<div className='section-body-fragment'>
		<div>Each component should has its specific position.</div>
		<div>To understand the position settings, firstly should know how Parrot2 layouts components.</div>
		<div>Parrot2 use grid system to layout components, similar with <span className='third-party'>Bootstrap</span>, which is define 12 columns grid system, Parrot2 also pre-set 12 columns grid system via css class <code className='inline javascript'>n-row</code>.</div>
		<div>And as additional, Parrot2 CSS pre-defines 10(<code className='inline javascript'>n-row n-row-10c</code>), 16(<code className='inline javascript'>n-row n-row-16c</code>) and 20(<code className='inline javascript'>n-row n-row-20c</code>) columns grid systems.</div>
		<div>Grid columns can be set on component via <code className='inline javascript'>comp.columnsOfGrid</code>, which is only enabled for container, such as <span className='keyword'>NForm</span>, <span className='keyword'>NPanel</span> etc.</div>
		<div>To define component's position in its container, there are 4 attributes: <span className='keyword'>width</span>, <span className='keyword'>row</span>, <span className='keyword'>col</span> and <span className='keyword'>clear</span>.</div>
		<div>Like <span className='third-party'>Bootstrap</span>, <code className='inline javascript'>n-col-*-push-*</code>, <code className='inline javascript'>n-col-*-pull-*</code>, <code className='inline javascript'>n-col-*-offset-*</code> and <code className='inline javascript'>n-col-*-hidden</code> are supported. They can be added via <span className='keyword'>width</span> or <span className='keyword'>row wrapping</span>.</div>
		<div>
			The pre-defined sizes are {['xs(<=767px)', 'sm(>=768px)', 'md(>=992px)', 'lg(>=1200px)', 'xl(>=1366px)', '2xl(>=1440px)', '3xl(>=1600px)', '4xl(>=1920px)'].map((size, sizeIndex) => {
				return (<span>
					{sizeIndex !== 0 ? ', ' : null}
					<span className='keyword'>{size}</span>
				</span>);
			})}
		</div>
		<div>The class names generated by <span className='keyword'>position</span> attribute are added at cell div, same as <code className='inline javascript'>styles.cell</code>.</div>
	</div>),
	code: [{
		type: 'desc',
		code: <div className='example'>Example:</div>
	}, {
		code: `pos: {
	width: 4,
	row: 100,
	col: 100,
	clear: true
}`
	}, {
		type: 'desc',
		code: (<div>
			<div>Attribute <span className='keyword'>width</span> means component takes 4 columns, but the actually width is according to its container's grid columns.</div>
			<div>Attributes <span className='keyword'>row</span> and <span className='keyword'>col</span> only define the relative row and column index in its container, not exactly the 100th.</div>
			<div>Attribute <span className='keyword'>clear</span> means row is wrapped before this component.</div>
		</div>)
	}],
	children: [Width, Row, Column, Clear]
};

module.exports = Position;