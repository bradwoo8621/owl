module.exports = function(parrot) {
	let $pt = parrot.parrot;
	return {
		id: 'pt-tgl', 
		label: 'Toggle', 
		group: 'plain',

		type: $pt.ComponentConstants.Toggle
	};
};