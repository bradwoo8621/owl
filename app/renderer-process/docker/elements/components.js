const locale = require('../../locale');

const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const parrotComponents = require('../../parrot-components');

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
		return (<div className='docker-components-header bg-color-primary color-reverse'>
			<div className='docker-components-header-label'>
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
			{label: langs.plainTitle, key: Components.PLAIN},
			{label: langs.containerTitle, key: Components.CONTAINER},
			{label: langs.customTitle, key: Components.CUSTOMIZED}
		];
		let components = parrotComponents.sort(function(a, b) {
			return a.label.localeCompare(b.label);
		});
		return (<div className='docker-components-body'>
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
	reactClass: Components,
	className: 'docker-components-container',
	containerId: 'left-docker',
	onExpanded: function() {
		$('body').addClass('left-docker-expanded');
	},
	onCollapsed: function() {
		$('body').removeClass('left-docker-expanded');
	}
};
