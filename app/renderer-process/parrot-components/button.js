module.exports = function(parrot) {
	let $pt = parrot.parrot;
	return {
		id: 'pt-btn', 
		label: 'Button', 
		group: 'plain',

		type: $pt.ComponentConstants.Button
	};
};