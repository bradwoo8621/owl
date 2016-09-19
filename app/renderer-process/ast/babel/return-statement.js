import Statement from './statement'

export default class ReturnStatement extends Statement {
	getType() {
		return 'ReturnStatement';
	}

	getArgument() {
		return this.argument;
	}

	toAST() {
		let ast = super.toAST();
		ast.argument = this.getArgument() == null ? null : this.getArgument().toAST();
		return ast;
	}
}