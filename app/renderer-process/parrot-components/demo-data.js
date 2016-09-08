module.exports = function(parrot) {
	let $pt = parrot.parrot;
	return {
		codetable: $pt.createCodeTable([
			{id: '1', text: 'Item A'},
			{id: '2', text: 'Item B'}
		])
	};
};