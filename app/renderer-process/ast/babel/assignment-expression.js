import Expression from './expression'

export default class AssignmentExpression extends Expression {
	getType() {
		return 'AssignmentExpression';
	}

	getOperator() {
		if (this.operator == null) {
			this.operator = '=';
		}
		return this.operator;
	}

	getLeft() {
		return this.left;
	}

	getRight() {
		return this.right;
	}

	toAST() {
		let ast = super.toAST();
		ast.operator = this.getOperator();
		ast.left = this.getLeft().toAST();
		ast.right = this.getRight().toAST();
		return ast;
	}
}