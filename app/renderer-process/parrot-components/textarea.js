module.exports = function(parrot) {
	let $pt = parrot.parrot;
	return {
		id: 'pt-txtA', 
		label: 'Text Area', 
		group: 'plain',

		type: $pt.ComponentConstants.TextArea
	};
};