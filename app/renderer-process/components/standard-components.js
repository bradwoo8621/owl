const {Envs, CodeTable} = require('../../../node_modules/nest-parrot2/dist/nest-parrot2');

const codes = new CodeTable({
	items: [{id: 1, text: 'Item 1'}, {id: 2, text: 'Item 2'}]
});

class Component {
	constructor(options) {
		this.label = options.label;
		this.type = options.type;
		this.width = options.width;
		this.layoutOptions = options.layoutOptions;
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
}
const Label = new Component({
	label: 'Label',
	type: Envs.COMPONENT_TYPES.LABEL,
	layoutOptions: {
		textFromModel: false
	}
});
const Text = new Component({
	label: 'Text',
	type: Envs.COMPONENT_TYPES.TEXT
});
const TextArea = new Component({
	label: 'Text Area',
	type: Envs.COMPONENT_TYPES.TEXTAREA
});
const Check = new Component({
	label: 'Check Box',
	type: Envs.COMPONENT_TYPES.CHECK
});
const Toggle = new Component({
	label: 'Toggle',
	type: Envs.COMPONENT_TYPES.TOGGLE
});
const DateTime = new Component({
	label: 'Date Time',
	type: Envs.COMPONENT_TYPES.DATE_PICKER
});
const Button = new Component({
	label: 'Button',
	type: Envs.COMPONENT_TYPES.BUTTON
});

const Radio = new Component({
	label: 'Radio',
	type: Envs.COMPONENT_TYPES.RADIO,
	layoutOptions: {
		codes: codes
	}
});
const RadioButton = new Component({
	label: 'Radio Button',
	type: Envs.COMPONENT_TYPES.RADIO_BUTTON,
	layoutOptions: {
		codes: codes
	}
});
const Select = new Component({
	label: 'Select',
	type: Envs.COMPONENT_TYPES.SELECT,
	layoutOptions: {
		codes: codes
	}
});
const List = new Component({
	label: 'List',
	type: Envs.COMPONENT_TYPES.LIST,
	layoutOptions: {
		codes: codes
	}
});
const Tree = new Component({
	label: 'Tree',
	type: Envs.COMPONENT_TYPES.TREE,
	layoutOptions: {
		codes: codes
	}
});
const ArrayCheck = new Component({
	label: 'Array Check Box',
	type: Envs.COMPONENT_TYPES.ARRAY_CHECK,
	layoutOptions: {
		codes: codes
	}
});

const Table = new Component({
	label: 'Table',
	type: Envs.COMPONENT_TYPES.TABLE,
	width: 12
});
const ArrayPanel = new Component({
	label: 'Array Panel',
	type: Envs.COMPONENT_TYPES.ARRAY_PANEL,
	width: 12
});
const ArrayTab = new Component({
	label: 'Array Tab',
	type: Envs.COMPONENT_TYPES.ARRAY_TAB,
	width: 12
});
const Panel = new Component({
	label: 'Panel',
	type: Envs.COMPONENT_TYPES.PANEL,
	width: 12
});
const Tab = new Component({
	label: 'Tab',
	type: Envs.COMPONENT_TYPES.TAB,
	width: 12
});
const ButtonBar = new Component({
	label: 'Button Bar',
	type: Envs.COMPONENT_TYPES.BUTTON_BAR,
	width: 12
});
const Form = new Component({
	label: 'Form',
	type: Envs.COMPONENT_TYPES.FORM,
	width: 12
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