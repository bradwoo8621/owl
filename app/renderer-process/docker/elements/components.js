const locale = require('../../locale');

const jsface = require('jsface');
const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const classNames = require('classnames');

const langs = locale.load('docker/components');

const Components = React.createClass({
	statics: {
		PLAIN: 'plain',
		CONTAINER: 'container',
		CUSTOMIZED: 'custom'
	},
	getInitialState: function() {
		return {};
	},
	renderHeader: function() {
		return (<div className='components-header bg-color-primary color-reverse'>
			<div className='components-header-label'>
				<span>{langs.title}</span>
			</div>
		</div>);
	},
	renderCustomizedAddButton: function(options) {
		if (options.group.key !== Components.CUSTOMIZED) {
			return null;
		}
		return (<div className='component color-advice-darken-20'>
			<span className='first-char'>{langs.addCustomComponent.substring(0, 1)}</span>
			<span>{langs.addCustomComponent.substring(1)}</span>
		</div>);
	},
	renderComponent: function(options) {
		let component = options.component,
			componentIndex = options.componentIndex;
		return (<div className='component'
							 key={componentIndex}>
			<span className='first-char'>{component.label.substring(0, 1)}</span>
			<span>{component.label.substring(1)}</span>
		</div>);
	},
	renderComponentGroup: function(options) {
		let group = options.group, 
			groupIndex = options.groupIndex,
			components = options.components;
		return (<div className='component-group'
					 key={groupIndex}>
			<div className='component-group-title header-expand-btn-tail bg-color-primary-lighten-10 color-reverse'
				 onClick={this.onComponentGroupTitleClicked}>
				<span>{group.label}</span>
			</div>
			<div className='component-group-body'>
				{components.map(function(component, componentIndex) {
					return this.renderComponent({
						component: component,
						componentIndex: componentIndex
					});
				}.bind(this))}
				{this.renderCustomizedAddButton(options)}
			</div>
		</div>);
	},
	renderBody: function() {
		let groups = [
			{label: 'Plain', key: 'plain'},
			{label: 'Container', key: 'container'},
			{label: 'Customized', key: 'custom'}
		];
		let components = [
			{label: 'Label', group: 'plain'}, {label: 'Toggle', group: 'plain'},
			{label: 'Text', group: 'plain'}, {label: 'Text Area', group: 'plain'}, 
			{label: 'Select', group: 'plain'}, {label: 'Date Picker', group: 'plain'},
			{label: 'CheckBox', group: 'plain'}, {label: 'Array Check', group: 'plain'}, 
			{label: 'Radio', group: 'plain'}, {label: 'Upload', group: 'plain'}, 
			{label: 'Code Search', group: 'plain'}, {label: 'Select Tree', group: 'plain'},
			{label: 'Button', group: 'plain'}, {label: 'Button Footer', group: 'container'},

			{label: 'Panel', group: 'container'}, {label: 'Array Panel', group: 'container'},
			{label: 'Tab', group: 'container'}, {label: 'Array Tab', group: 'container'},
			{label: 'Table', group: 'container'}, {label: 'Tree', group: 'plain'}
		].sort(function(a, b) {
			return a.label.localeCompare(b.label);
		});
		return (<div className='components-body'>
			{groups.map(function(group, groupIndex) {
				return this.renderComponentGroup({
					group: group,
					groupIndex: groupIndex,
					components: components.filter(function(component) {
						return component.group === group.key;
					})
				});
			}.bind(this))}
		</div>);
	},
	render: function() {
		return (<div className='docker-components'>
			{this.renderHeader()}
			{this.renderBody()}
		</div>);
	},
	toggleComponentGroupExpanded: function(title) {
		title.parent().toggleClass('collapsed');
		title.next().slideToggle(500);
	},
	onComponentGroupTitleClicked: function(evt) {
		this.toggleComponentGroupExpanded($(evt.target).closest('.component-group-title'));
	}
});

module.exports = {
	label: langs.title,
	icon: 'mdi mdi-view-dashboard',
	pos: 'left',
	reactClass: Components,
	className: 'docker-components-contianer'
};
