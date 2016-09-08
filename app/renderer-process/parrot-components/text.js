module.exports = function(parrot) {
	let $pt = parrot.parrot;
	return {
		id: 'pt-txt', 
		label: 'Text', 
		group: 'plain',

		type: $pt.ComponentConstants.Text
	};
};