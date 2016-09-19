import ASTNode from './node'

export default class ObjectMember extends ASTNode {
	getType() {
		return 'ObjectMember';
	}

	getKey() {
		return this.key;
	}

	getComputed() {
		return this.computed ? true : false;
	}

	getValue() {
		return this.value;
	}

	toAST() {
		let ast = super.toAST();
		ast.key = this.getKey().toAST();
		ast.computed = this.getComputed();
		ast.value = this.getValue() == null ? null : this.getValue().toAST();

		return ast;
	}
}