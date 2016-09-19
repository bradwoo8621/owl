import ObjectMember from './object-member'

export default class ObjectProperty extends ObjectMember {
	getType() {
		return 'ObjectProperty';
	}

	getShorthand() {
		return this.shorthand ? true : false;
	}

	toAST() {
		let ast = super.toAST();
		ast.shorthand = this.getShorthand();

		return ast;
	}
}