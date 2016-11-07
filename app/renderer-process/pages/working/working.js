const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const {Model, Layout, Envs, NForm, NComponent, NPanel} = require('../../../../node_modules/nest-parrot2/dist/nest-parrot2');

const electron = require('electron');
const {ipcRenderer} = electron;

const {Commands} = require('../../../common/commander');
const router = require('../../common/router');
const {Categories, Components} = require('../../components/standard-components');

class ComponentCategories extends NComponent {
	constructor(props) {
		super(props);
		this.onCategoryExpanded = this.onCategoryExpanded.bind(this);
	}
	renderCategory(category, categoryIndex) {
		return <NPanel model={this.getModel()}
					n-id={category.getId()}
					n-label={category.getLabel()}
					n-comp-style='borderless'
					n-comp-collapsible={true}
					n-comp-expanded={false}
					n-comp-children={this.getChildrenLayoutOfCategory(category)}
					n-styles-comp='component-category'
					n-evt-expand={this.onCategoryExpanded}
					ref={category.getId()}
					key={categoryIndex} />;
	}
	renderInNormal() {
		return (<div className='component-categories'
					 ref='me'>
			{Categories.map((category, categoryIndex) => {
				return this.renderCategory(category, categoryIndex);
			})}
		</div>);
	}
	getChildrenLayoutOfCategory(category) {
		return category.getComponents().reduce((layout, component, componentIndex) => {
			layout[component.getKey()] = {
				label: component.getLabel(),
				comp: {
					type: Envs.COMPONENT_TYPES.COMPONENT,
					define: component
				},
				pos: {width: 6, row: 100, col: (componentIndex + 1) * 100}
			};
			return layout;
		}, {});
	}
	onCategoryExpanded(evt) {
		let target = evt.target;
		Categories.map((category) => {
			return category.getId();
		}).forEach((ref) => {
			let panel = this.refs[ref];
			if (ReactDOM.findDOMNode(panel.refs.me) != target) {
				panel.collapse();
			}
		});
	}
}
Envs.COMPONENT_TYPES.COMPONENT_CATEGORIES = {type: 'component_categories', label: false, error: false};
Envs.setRenderer(Envs.COMPONENT_TYPES.COMPONENT_CATEGORIES.type, function (options) {
	return <ComponentCategories {...options} />;
});

class Component extends NComponent {
	constructor(props) {
		super(props);
		this.onDragStarted = this.onDragStarted.bind(this);
	}
	renderInNormal() {
		return (<div className='component'
					 draggable={true}
					 onDragStart={this.onDragStarted}
					 data-title={this.getLabel()}>
			{this.getLabel()}
		</div>);
	}
	getComponentKey() {
		return this.getLayoutOptionValue('define').getKey();
	}
	onDragStarted(evt) {
		evt.dataTransfer.setData('componentKey', this.getComponentKey());
	}
}
Envs.COMPONENT_TYPES.COMPONENT = {type: 'component', label: false, error: false};
Envs.setRenderer(Envs.COMPONENT_TYPES.COMPONENT.type, function (options) {
	return <Component {...options} />;
});

class Content extends React.Component {
	render() {
		return (<div className='page'
					 onDrop={this.onDropped}
					 onDragOver={this.onDragOver}
					 onDragEnter={this.onDragEnter}
					 onDragLeave={this.onDragLeave}>
		</div>);
	}
	onDropped(evt) {
		evt.preventDefault();
		evt.stopPropagation()
		let componentKey = evt.dataTransfer.getData('componentKey');
		let component = Components[componentKey];
		console.log(component);
	}
	onDragOver(evt) {
		evt.preventDefault();
		evt.stopPropagation()
	}
	onDragEnter(evt) {
		evt.preventDefault();
		evt.stopPropagation()
	}
	onDragLeave(evt) {
		evt.preventDefault();
		evt.stopPropagation()
	}
}

class Working {
	renderSideBar() {
		return ReactDOM.render(<NForm model={this.getToolBarModel()}
							   layout={this.getToolBarLayout()} />, 
				document.getElementById('side-bar'));
	}
	getToolBarModel() {
		if (this.toolbarModel == null) {
			this.toolbarModel = new Model({});
		}
		return this.toolbarModel;
	}
	getToolBarLayout() {
		if (this.toolbarLayout == null) {
			this.toolbarLayout = new Layout('form', {
				comp: {
					children: {
						tabs: {
							comp: {
								type: Envs.COMPONENT_TYPES.TAB,
								style: 'primary',
								tabs: [{
									label: 'Components',
									children: {
										categories: {
											comp: {
												type: Envs.COMPONENT_TYPES.COMPONENT_CATEGORIES
											},
											pos: {width: 12, row: 100}
										}
									}
								}, {
									label: 'Folders',
									children: {
										name: {}
									}
								}]
							},
							pos: {width: 12},
							styles: {
								cell: 'working-tabs'
							}
						}
					}
				}
			});
		}
		return this.toolbarLayout;
	}
	onSideBarToggle() {
		$('#side-bar').toggleClass('hide');
	}

	renderContent() {
		return ReactDOM.render(<Content />, 
				document.getElementById('content'));
	}
}

let working = new Working();
let sidebar = working.renderSideBar();
let content = working.renderContent();

ipcRenderer.on(Commands.TOGGLE_SIDE_BAR, (evt, arg) => {
	working.onSideBarToggle();
});
module.exports = working;