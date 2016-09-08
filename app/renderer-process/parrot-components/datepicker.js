module.exports = function(parrot) {
	let $pt = parrot.parrot;
	return {
		id: 'pt-date', 
		label: 'Date Picker', 
		group: 'plain',

		type: $pt.ComponentConstants.Date
	};
};