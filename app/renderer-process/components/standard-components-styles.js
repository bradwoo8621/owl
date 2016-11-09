const cell = {
	id: 'styles.cell', 
	label: 'Cell Class Name',
	a: 'styles-cell'
};
const comp = {
	id: 'styles.comp', 
	label: 'Component Class Name',
	a: 'styles-component'
};
const view = {
	id: 'styles.view', 
	label: 'View Mode Class Name',
	a: 'styles-view-mode'
}
const StandardStyles = [cell, comp, view];

const normalline = {
	id: 'styles.normal-line', 
	label: 'Normal Underline Class Name',
	a: 'styles-normal-line'
};
const focusline = {
	id: 'styles.focus-line', 
	label: 'Focused Underline Class Name',
	a: 'styles-focus-line'
};
const UnderlineStyles = [normalline, focusline];

module.exports = {
	StandardStyles, 
	UnderlineStyles
};