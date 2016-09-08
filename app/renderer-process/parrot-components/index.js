const parrot = require('../parrot');
const $ = parrot.jquery;
const $pt = parrot.parrot;
const React = parrot.react;
const ReactDOM = parrot.reactDOM;
const classnames = require('classnames');

const ComponentReceiverMixin = {
	getInitialState: function() {
		return {
			components: []
		};
	},
	componentDidMount: function() {
		$(this.refs.container).find('.n-file div[tabindex]').removeAttr('tabIndex');
	},
	componentDidUpdate: function() {
		$(this.refs.container).find('.n-file div[tabindex]').removeAttr('tabIndex');
	},
	renderDemoComponent: function(component) {
		return this.getComponentRenderer(component).call(this, component);
	},
	renderComponent: function(component, componentIndex) {
		return (<div className={this.getComponentWidthClassName('cell', component)}
					 key={componentIndex}
					 ref='container'>
			<div className='cell-inner-area'
				 tabIndex='0'>
				<span className='cell-operations'>
					<i className='mdi mdi-close-circle'
					   onClick={this.onComponentRemoveClicked.bind(this, component)} />
				</span>
				<span className='cell-label'>label</span>
				<div className='cell-component'>
					{this.renderDemoComponent(component)}
				</div>
			</div>
		</div>);
	},
	renderComponents: function() {
		return this.getComponents().sort(function(a, b) {
			return (a.row === b.row) ? (a.col - b.col) : (a.row - b.row);
		}).map(this.renderComponent);
	},
	onDrop: function(evt) {
		evt.preventDefault();
		evt.stopPropagation()
		let componentId = evt.dataTransfer.getData('componentId');
		let component = this.findComponentDefinitionById(componentId);
		this.insertComponent(component);
	},
	onDragEnter: function(evt) {
		evt.preventDefault();
		evt.stopPropagation()
		// console.log('drag enter');
	},
	onDragOver: function(evt) {
		evt.preventDefault();
		evt.stopPropagation()
		// console.log('drag over');
	},
	onDragLeave: function(evt) {
		evt.preventDefault();
		evt.stopPropagation()
		// console.log('drag leave');
	},
	onComponentRemoveClicked: function(component) {
		this.removeComponent(component);
	},
	getComponents: function() {
		return this.state.components;
	},
	findComponentDefinitionById: function(componentId) {
		return parrotComponents.find(function(component) {
			return component.id === componentId;
		});
	},
	insertComponent: function(component) {
		this.getComponents().push(this.adaptComponent(component));
		this.forceUpdate();
	},
	removeComponent: function(component) {
		let components = this.getComponents();
		components.splice(components.indexOf(component), 1);
		this.forceUpdate();
	},
	adaptComponent: function(component) {
		return {
			def: component,
			row: 0,
			col: 0,
			width: component.defaultWidth ? component.defaultWidth : 3
		};
	},
	getComponentWidthClassName: function(className, component) {
		var widthCSS = {};
		widthCSS['col-md-' + component.width] = true;

		return classnames(className, widthCSS);
	},
	getComponentRenderer: function(component) {
		if (component.def.renderer) {
			return component.def.renderer;
		} else {
			return this.getStandardComponentRenderer;
		}
	},
	getStandardComponentRenderer: function(component) {
		let layoutJSON = {
			label: component.def.label,
			comp: {
				type: component.def.type,
				labelDirection: 'vertical',
				enabled: false
			},
			css: {
				comp: 'design-demo'
			},
			pos: {width: 0}
		};
		if (component.def.layoutAdapt) {
			layoutJSON = component.def.layoutAdapt.call(this, layoutJSON, DesignPanel);
		}
		let layout = $pt.createCellLayout('', layoutJSON);
		let model = $pt.createModel({});
		return <$pt.Components.NFormCell model={model}
									 	 layout={layout} />;
	}
};

const DesignPanel = React.createClass($pt.defineCellComponent({
	mixins: [ComponentReceiverMixin],
	render: function() {
		return (<div className='component-receiver'
					 onDrop={this.onDrop}
					 onDragOver={this.onDragOver}
					 onDragEnter={this.onDragEnter}
					 onDragLeave={this.onDragLeave}>
			{this.renderComponents()}
		</div>);
	}
}));
$pt.Components.DesignPanel = DesignPanel;
$pt.ComponentConstants.DesignPanel = {type: 'design-panel', label: false};
$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.DesignPanel, function (model, layout, direction, viewMode) {
	return <$pt.Components.DesignPanel {...$pt.LayoutHelper.transformParameters(model, layout, direction, viewMode)}/>;
});

const parrotComponents = [
	require('./label')(parrot),
	require('./toggle')(parrot),
	require('./text')(parrot), 
	require('./textarea')(parrot), 
	require('./select')(parrot), 
	require('./datepicker')(parrot),
	require('./checkbox')(parrot), 
	require('./array-check')(parrot), 
	require('./radio')(parrot), 
	require('./upload')(parrot), 
	require('./code-search')(parrot), 
	require('./select-tree')(parrot),
	require('./button')(parrot), 
	{id: 'pt-btnFooter', label: 'Button Footer', group: 'container'},

	require('./panel')(parrot), 
	{id: 'pt-aPnl', label: 'Array Panel', group: 'container'},
	{id: 'pt-tab', label: 'Tab', group: 'container'}, 
	{id: 'pt-aTab', label: 'Array Tab', group: 'container'},
	require('./table')(parrot), 
	require('./tree')(parrot)
];


module.exports = {
	components: parrotComponents,
	parrot: parrot,
	ComponentReceiverMixin: ComponentReceiverMixin
};