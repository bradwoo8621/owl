module.exports = function(parrot) {
	let $pt = parrot.parrot;
	return {
		id: 'pt-upl', 
		label: 'Upload', 
		group: 'plain',

		type: $pt.ComponentConstants.File
	};
};