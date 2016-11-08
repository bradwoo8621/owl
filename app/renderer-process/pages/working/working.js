// jquery, react and parrot2
const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const {Model, Layout, Envs, NForm, NComponent, NPanel} = require('../../../../node_modules/nest-parrot2/dist/nest-parrot2');

// electron related
const electron = require('electron');
const {ipcRenderer} = electron;

// commands constants
const {Commands} = require('../../../common/commander');
// router for handle default webContents commands
const router = require('../../common/router');
// require standard components from pre-define file
const StandardComponents = require('../../components/standard-components');

// component categories
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
					n-styles-comp='owl-component-category'
					n-evt-expand={this.onCategoryExpanded}
					ref={category.getId()}
					key={categoryIndex} />;
	}
	renderInNormal() {
		return (<div className='owl-component-categories'
					 ref='me'>
			{StandardComponents.Categories.map((category, categoryIndex) => {
				return this.renderCategory(category, categoryIndex);
			})}
		</div>);
	}
	getChildrenLayoutOfCategory(category) {
		return category.getComponents().reduce((layout, component, componentIndex) => {
			layout[component.getKey()] = {
				label: component.getLabel(),
				comp: {
					type: Envs.COMPONENT_TYPES.OWL_COMPONENT_DEF,
					define: component
				},
				pos: {width: 6, row: 100, col: (componentIndex + 1) * 100}
			};
			return layout;
		}, {});
	}
	onCategoryExpanded(evt) {
		let target = evt.target;
		StandardComponents.Categories.map((category) => {
			return category.getId();
		}).forEach((ref) => {
			let panel = this.refs[ref];
			if (ReactDOM.findDOMNode(panel.refs.me) != target) {
				panel.collapse();
			}
		});
	}
}
Envs.COMPONENT_TYPES.OWL_COMPONENT_CATEGORIES = {type: 'owl-component-categories', label: false, error: false};
Envs.setRenderer(Envs.COMPONENT_TYPES.OWL_COMPONENT_CATEGORIES.type, function (options) {
	return <ComponentCategories {...options} />;
});

// let it draggable and carry component definition
class ComponentDef extends NComponent {
	constructor(props) {
		super(props);
		this.onDragStarted = this.onDragStarted.bind(this);
	}
	renderInNormal() {
		return (<div className='owl-component-def'
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
Envs.COMPONENT_TYPES.OWL_COMPONENT_DEF = {type: 'owl-component-def', label: false, error: false};
Envs.setRenderer(Envs.COMPONENT_TYPES.OWL_COMPONENT_DEF.type, function (options) {
	return <ComponentDef {...options} />;
});

// work area, drag and drop component here
class Content extends React.Component {
	constructor(props) {
		super(props);
		this.newComponentIndex = 1;

		this.onDropped = this.onDropped.bind(this);
		this.onDragOver = this.onDragOver.bind(this);
		this.onDragEnter = this.onDragEnter.bind(this);
		this.onDragLeave = this.onDragLeave.bind(this);
	}
	render() {
		return (<div className='page'
					 onDrop={this.onDropped}
					 onDragOver={this.onDragOver}
					 onDragEnter={this.onDragEnter}
					 onDragLeave={this.onDragLeave}>
			<NForm model={this.getFormModel()} layout={this.getFormLayout()} />
		</div>);
	}
	getFormModel() {
		if (this.formModel == null) {
			this.formModel = new Model({});
		}
		return this.formModel;
	}
	getFormLayout() {
		if (this.formLayout == null) {
			this.formLayout = new Layout('form', {
				comp: {
					children: {}
				}
			});
		}
		return this.formLayout;
	}
	appendComponent(component) {
		let children = this.getFormLayout().getOptionValue('children');
		let maxRow = Object.keys(children).reduce((maxRow, cellKey) => {
			let layout = children[cellKey];
			let rowIndex = (layout && layout.pos) ? layout.pos.row : 0;
			if (rowIndex > maxRow) {
				maxRow = rowIndex;
			}
			return maxRow;
		}, 100);
		let maxCol = Object.keys(children).reduce((maxCol, cellKey) => {
			let layout = children[cellKey];
			let rowIndex = (layout && layout.pos) ? layout.pos.row : 0;
			if (rowIndex === maxRow) {
				let columnIndex = (Layout && layout.pos) ? layout.pos.col : 0;
				if (columnIndex > maxCol) {
					maxCol = columnIndex;
				}
			}
			return maxCol + 100;
		}, 100);
		let cell = {
			label: component.getLabel(),
			comp: Envs.deepMergeTo({}, {
				type: component.getType(),
				enabled: false
			}, component.getLayoutOptions()),
			styles: {
				cell: 'owl-component'
			},
			pos: {
				width: component.getWidth(),
				row: maxRow,
				col: maxCol
			}
		};
		children[`pseduo-${this.newComponentIndex++}`] = cell;
		// repaint
		console.log(children);
		this.forceUpdate();
	}
	onDropped(evt) {
		evt.preventDefault();
		evt.stopPropagation()
		let componentKey = evt.dataTransfer.getData('componentKey');
		let component = StandardComponents.Components[componentKey];
		this.appendComponent(component);
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
												type: Envs.COMPONENT_TYPES.OWL_COMPONENT_CATEGORIES
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