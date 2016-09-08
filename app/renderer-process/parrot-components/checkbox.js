module.exports = function(parrot) {
	let $pt = parrot.parrot;
	return {
		id: 'pt-chk', 
		label: 'CheckBox', 
		group: 'plain',

		type: $pt.ComponentConstants.Check
	};
};