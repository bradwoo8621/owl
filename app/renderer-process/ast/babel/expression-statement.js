import Statement from './statement'

export default class ExpressionStatement extends Statement {
	getType() {
		return 'ExpressionStatement';
	}

	getExpression() {
		return this.expression;
	}

	toAST() {
		let ast = super.toAST();
		ast.expression = this.getExpression().toAST();
		return ast;
	}
}
