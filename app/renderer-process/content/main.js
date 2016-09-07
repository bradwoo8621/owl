const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const classnames = require('classnames');

const parrotComponents = require('../parrot-components');

const MainContent = React.createClass({
	getInitialState: function() {
		return {
			components: []
		};
	},
	renderDemoComponent: function(component) {
		return component.def.renderDemo.call(this);
	},
	renderComponent: function(component, componentIndex) {
		return (<div className={this.getComponentWidthClassName('cell', component)}
					 key={componentIndex}>
			<div className='cell-inner-area'
				 tabIndex='0'>
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
		// console.log(this.getComponents());
		this.forceUpdate();
	},
	adaptComponent: function(component) {
		return {
			def: component,
			row: 0,
			col: 0,
			width: 3
		};
	},
	getComponentWidthClassName: function(className, component) {
		var widthCSS = {};
		widthCSS['col-md-' + component.width] = true;
		return classnames(className, widthCSS);
	}
});

module.exports = {
	render: function(dockerId, callback) {
		return ReactDOM.render(<MainContent />, 
				window.document.getElementById(dockerId),
				callback);
	}
}