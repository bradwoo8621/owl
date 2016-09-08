module.exports = function(parrot) {
	let $pt = parrot.parrot;
	return {
		id: 'pt-sel', 
		label: 'Select', 
		group: 'plain',

		type: $pt.ComponentConstants.Select
	};
};