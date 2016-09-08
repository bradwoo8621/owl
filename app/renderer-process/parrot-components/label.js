module.exports = function(parrot) {
	let $pt = parrot.parrot;
	return {
		id: 'pt-lbl', 
		label: 'Label', 
		group: 'plain',

		type: $pt.ComponentConstants.Label
	};
};