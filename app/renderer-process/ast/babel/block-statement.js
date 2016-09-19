import Statement from './statement'

export default class BlockStatement extends Statement {
	getType() {
		return 'BlockStatement';
	}

	getBody() {
		if (this.body == null) {
			this.body = [];
		}
		return this.body;
	}

	toAST() {
		let ast = super.toAST();
		ast.body = this.getBody().map(function(statement) {
			return statement.toAST();
		});
		return ast;
	}
}