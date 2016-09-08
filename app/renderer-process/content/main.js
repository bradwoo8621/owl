const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const classnames = require('classnames');
const $pt = require('../parrot').parrot;

const parrotComponents = require('../parrot-components');

const MainContent = React.createClass({
	getInitialState: function() {
		return {
			components: []
		};
	},
	renderDemoComponent: function(component) {
		return this.getComponentRenderer(component).call(this, component);
	},
	renderComponent: function(component, componentIndex) {
		return (<div className={this.getComponentWidthClassName('cell', component)}
					 key={componentIndex}>
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
	render: function() {
		return (<div className='main-content'
					 onDrop={this.onDrop}
					 onDragOver={this.onDragOver}
					 onDragEnter={this.onDragEnter}
					 onDragLeave={this.onDragLeave}>
			{this.renderComponents()}
		</div>);
	},
	onDrop: function(evt) {
		let componentId = evt.dataTransfer.getData('componentId');
		let component = this.findComponentDefinitionById(componentId);
		this.insertComponent(component);
	},
	onDragEnter: function(evt) {
		evt.preventDefault();
		// console.log('drag enter');
	},
	onDragOver: function(evt) {
		evt.preventDefault();
		// console.log('drag over');
	},
	onDragLeave: function(evt) {
		evt.preventDefault();
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
			layoutJSON = component.def.layoutAdapt.call(this, layoutJSON);
		}
		let layout = $pt.createCellLayout('', layoutJSON);
		let model = $pt.createModel({});
		return <$pt.Components.NFormCell model={model}
									 	 layout={layout} />;
	}
});

module.exports = {
	render: function(dockerId, callback) {
		return ReactDOM.render(<MainContent />, 
				window.document.getElementById(dockerId),
				callback);
	}
}