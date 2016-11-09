const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const Parrot = require('../../../node_modules/nest-parrot2/dist/nest-parrot2');
const {Envs, CodeTable, NComponent} = Parrot;

const {StandardStyles, UnderlineStyles} = require('./standard-components-styles');

const router = require('../common/router');

const codes = new CodeTable({
	items: [{id: 1, text: 'Item 1'}, {id: 2, text: 'Item 2'}]
});

const CellWidth = 12;
const LabelPosition = 'left';
const LabelWidth = 3;

class AttributeValueEditor extends NComponent {
	constructor(props) {
		super(props);
		this.onHelpClicked = this.onHelpClicked.bind(this);
	}
	renderText() {
		let layout = {
			comp: {
				type: Envs.COMPONENT_TYPES.TEXT,
				tail: [{
					comp: {
						type: Envs.COMPONENT_TYPES.ICON,
						fontAwesome: false,
						icon: '!mdi !mdi-code-braces'
					},
					evt: {
						click: function() {}
					}
				}, {
					comp: {
						type: Envs.COMPONENT_TYPES.ICON,
						icon: 'question-circle-o',
					},
					evt: {
						click: this.onHelpClicked
					}
				}]
			}
		}
		return this.renderInternalComponent(layout);
	}
	renderInNormal() {
		return (<div className='owl-attr-value-editor'>
			{this.renderText()}
		</div>);
	}
	getDefinition() {
		return this.getLayoutOptionValue('define');
	}
	onHelpClicked() {
		router.openParrtoHelp(this.getDefinition().a);
	}
}
Envs.COMPONENT_TYPES.OWL_ATTR_VALUE_EDITOR = {type: 'owl-attr-value-editor', label: true, error: true};
Envs.setRenderer(Envs.COMPONENT_TYPES.OWL_ATTR_VALUE_EDITOR.type, function (options) {
	return <AttributeValueEditor {...options} />;
});

class CommonAttributesLayout {
	styles(hasLine) {
		let attrs = StandardStyles.slice(0);
		if (hasLine) {
			attrs = attrs.concat(UnderlineStyles);
		}
		return attrs.sort((a, b) => {
			return a.label.localeCompare(b.label);
		}).map((attr, attrIndex) => {
			attr.row = attr.col = (attrIndex + 1) * 100;
			return attr;
		}).reduce((layout, attr) => {
			layout[attr.id] = {
				label: attr.label,
				comp: {
					type: Envs.COMPONENT_TYPES.OWL_ATTR_VALUE_EDITOR,
					labelPosition: LabelPosition,
					labelWidth: LabelWidth,
					define: attr
				},
				pos: {width: CellWidth, row: attr.row, col: attr.col}
			};
			return layout;
		}, {});
	}
	position() {

	}
};
const commonAttrLayout = new CommonAttributesLayout();

class Component {
	constructor(options) {
		this.label = options.label;
		this.type = options.type;
		this.width = options.width;
		this.layoutOptions = options.layoutOptions;
		this.attrsLayout = options.attrsLayout;
	}
	getLabel() {
		return this.label;
	}
	getType() {
		return this.type;
	}
	getKey() {
		return this.getType().type;
	}
	getWidth() {
		return this.width ? this.width : 3;
	}
	getLayoutOptions() {
		return this.layoutOptions;
	}
	getAttributeLayout() {
		return this.attrsLayout;
	}
}
const Label = new Component({
	label: 'Label',
	type: Envs.COMPONENT_TYPES.LABEL,
	layoutOptions: {
		textFromModel: false
	},
	attrsLayout: {
		styles: commonAttrLayout.styles(false)
	}
});
const Text = new Component({
	label: 'Text',
	type: Envs.COMPONENT_TYPES.TEXT,
	attrsLayout: {
		styles: commonAttrLayout.styles(true)
	}
});
const TextArea = new Component({
	label: 'Text Area',
	type: Envs.COMPONENT_TYPES.TEXTAREA,
	attrsLayout: {
		styles: commonAttrLayout.styles(true)
	}
});
const Check = new Component({
	label: 'Check Box',
	type: Envs.COMPONENT_TYPES.CHECK,
	attrsLayout: {
		styles: commonAttrLayout.styles(false)
	}
});
const Toggle = new Component({
	label: 'Toggle',
	type: Envs.COMPONENT_TYPES.TOGGLE,
	attrsLayout: {
		styles: commonAttrLayout.styles(false)
	}
});
const DateTime = new Component({
	label: 'Date Time',
	type: Envs.COMPONENT_TYPES.DATE_PICKER,
	attrsLayout: {
		styles: commonAttrLayout.styles(true)
	}
});
const Button = new Component({
	label: 'Button',
	type: Envs.COMPONENT_TYPES.BUTTON,
	attrsLayout: {
		styles: commonAttrLayout.styles(false)
	}
});

const Radio = new Component({
	label: 'Radio',
	type: Envs.COMPONENT_TYPES.RADIO,
	layoutOptions: {
		codes: codes
	},
	attrsLayout: {
		styles: commonAttrLayout.styles(false)
	}
});
const RadioButton = new Component({
	label: 'Radio Button',
	type: Envs.COMPONENT_TYPES.RADIO_BUTTON,
	layoutOptions: {
		codes: codes
	},
	attrsLayout: {
		styles: commonAttrLayout.styles(false)
	}
});
const Select = new Component({
	label: 'Select',
	type: Envs.COMPONENT_TYPES.SELECT,
	layoutOptions: {
		codes: codes
	},
	attrsLayout: {
		styles: commonAttrLayout.styles(true)
	}
});
const List = new Component({
	label: 'List',
	type: Envs.COMPONENT_TYPES.LIST,
	layoutOptions: {
		codes: codes
	},
	attrsLayout: {
		styles: commonAttrLayout.styles(false)
	}
});
const Tree = new Component({
	label: 'Tree',
	type: Envs.COMPONENT_TYPES.TREE,
	layoutOptions: {
		codes: codes
	},
	attrsLayout: {
		styles: commonAttrLayout.styles(false)
	}
});
const ArrayCheck = new Component({
	label: 'Array Check Box',
	type: Envs.COMPONENT_TYPES.ARRAY_CHECK,
	layoutOptions: {
		codes: codes
	},
	attrsLayout: {
		styles: commonAttrLayout.styles(false)
	}
});

const Table = new Component({
	label: 'Table',
	type: Envs.COMPONENT_TYPES.TABLE,
	width: 12,
	attrsLayout: {
		styles: commonAttrLayout.styles(false)
	}
});
const ArrayPanel = new Component({
	label: 'Array Panel',
	type: Envs.COMPONENT_TYPES.ARRAY_PANEL,
	width: 12,
	attrsLayout: {
		styles: commonAttrLayout.styles(false)
	}
});
const ArrayTab = new Component({
	label: 'Array Tab',
	type: Envs.COMPONENT_TYPES.ARRAY_TAB,
	width: 12,
	attrsLayout: {
		styles: commonAttrLayout.styles(false)
	}
});
const Panel = new Component({
	label: 'Panel',
	type: Envs.COMPONENT_TYPES.PANEL,
	width: 12,
	attrsLayout: {
		styles: commonAttrLayout.styles(false)
	}
});
const Tab = new Component({
	label: 'Tab',
	type: Envs.COMPONENT_TYPES.TAB,
	width: 12,
	attrsLayout: {
		styles: commonAttrLayout.styles(false)
	}
});
const ButtonBar = new Component({
	label: 'Button Bar',
	type: Envs.COMPONENT_TYPES.BUTTON_BAR,
	width: 12,
	attrsLayout: {
		styles: commonAttrLayout.styles(false)
	}
});
const Form = new Component({
	label: 'Form',
	type: Envs.COMPONENT_TYPES.FORM,
	width: 12,
	attrsLayout: {
		styles: commonAttrLayout.styles(false)
	}
});

class Category {
	constructor(id, label, components) {
		this.id = id;
		this.label = label;
		this.components = components;
	}
	getLabel() {
		return this.label;
	}
	getId() {
		return this.id;
	}
	getComponents() {
		return this.components;
	}
}

const SimpleComponents = new Category('simple', 'Simple Components', [
		Label, Text, TextArea, Check, Toggle, DateTime, Button
	]);
const CodesComponents = new Category('codes', 'Codes Components', [
		ArrayCheck, Radio, RadioButton, Select, List, Tree
	]);
const Containers = new Category('container', 'Containers', [
		Panel, ArrayPanel, Tab, ArrayTab, ButtonBar, Table, Form
	]);


module.exports = {
	Categories: [
		SimpleComponents,
		CodesComponents,
		Containers
	],
	Components: [
		SimpleComponents, CodesComponents, Containers
	].reduce((all, components) => {
		components.getComponents().forEach((component) => {
			all[component.getKey()] = component;
		});
		return all;
	}, {})
};