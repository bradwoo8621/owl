const {Envs} = require('../../../node_modules/nest-parrot2/dist/nest-parrot2');

class Component {
	constructor(options) {
		this.label = options.label;
		this.type = options.type;
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
}
const Label = new Component({
	label: 'Label',
	type: Envs.COMPONENT_TYPES.LABEL
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
const Radio = new Component({
	label: 'Radio',
	type: Envs.COMPONENT_TYPES.RADIO
});
const RadioButton = new Component({
	label: 'Radio Button',
	type: Envs.COMPONENT_TYPES.RADIO_BUTTON
});
const DateTime = new Component({
	label: 'Date Time',
	type: Envs.COMPONENT_TYPES.DATE_PICKER
});
const Button = new Component({
	label: 'Button',
	type: Envs.COMPONENT_TYPES.BUTTON
});

const Select = new Component({
	label: 'Select',
	type: Envs.COMPONENT_TYPES.SELECT
});
const List = new Component({
	label: 'List',
	type: Envs.COMPONENT_TYPES.LIST
});
const Tree = new Component({
	label: 'Tree',
	type: Envs.COMPONENT_TYPES.TREE
});

const Table = new Component({
	label: 'Table',
	type: Envs.COMPONENT_TYPES.TABLE
});
const ArrayPanel = new Component({
	label: 'Array Panel',
	type: Envs.COMPONENT_TYPES.ARRAY_PANEL
});
const ArrayTab = new Component({
	label: 'Array Tab',
	type: Envs.COMPONENT_TYPES.ARRAY_TAB
});
const ArrayCheck = new Component({
	label: 'Array Check Box',
	type: Envs.COMPONENT_TYPES.ARRAY_CHECK
});

const Panel = new Component({
	label: 'Panel',
	type: Envs.COMPONENT_TYPES.PANEL
});
const Tab = new Component({
	label: 'Tab',
	type: Envs.COMPONENT_TYPES.TAB
});
const ButtonBar = new Component({
	label: 'Button Bar',
	type: Envs.COMPONENT_TYPES.BUTTON_BAR
});
const Form = new Component({
	label: 'Form',
	type: Envs.COMPONENT_TYPES.FORM
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
		Label, Text, TextArea, Check, Toggle, Radio, RadioButton, DateTime, Button
	]);
const CodesComponents = new Category('codes', 'Codes Components', [
		Select, List, Tree
	]);
const ArrayComponents = new Category('array', 'Array Components', [
		Table, ArrayPanel, ArrayTab, ArrayCheck
	]);
const Containers = new Category('container', 'Containers', [
		Panel, Tab, ButtonBar, Form
	]);


module.exports = {
	Categories: [
		SimpleComponents,
		CodesComponents,
		ArrayComponents,
		Containers
	],
	Components: [
		SimpleComponents, CodesComponents, ArrayComponents, Containers
	].reduce((all, components) => {
		components.getComponents().forEach((component) => {
			all[component.getKey()] = component;
		});
		return all;
	}, {})
};