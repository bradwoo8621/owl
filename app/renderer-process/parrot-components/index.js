module.exports = [
	require('./label'),
	require('./toggle'),
	require('./text'), 
	require('./textarea'), 
	require('./select'), 
	require('./datepicker'),
	require('./checkbox'), 
	require('./array-check'), 
	require('./radio'), 
	require('./upload'), 
	require('./code-search'), 
	require('./select-tree'),
	require('./button'), 
	{id: 'pt-btnFooter', label: 'Button Footer', group: 'container'},

	{id: 'pt-pnl', label: 'Panel', group: 'container'}, 
	{id: 'pt-aPnl', label: 'Array Panel', group: 'container'},
	{id: 'pt-tab', label: 'Tab', group: 'container'}, 
	{id: 'pt-aTab', label: 'Array Tab', group: 'container'},
	require('./table'), 
	require('./tree')
];