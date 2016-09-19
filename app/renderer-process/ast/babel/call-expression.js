import Expression from './expression'

export default class CallExpression extends Expression {
	getType() {
		return 'CallExpression';
	}

	getCallee() {
		return this.callee;
	}

	getArguments() {
		if (this.arguments == null) {
			this.arguments = [];
		}
		return this.arguments;
	}

	toAST() {
		let ast = super.toAST();
		ast.callee = this.getCallee().toAST();
		ast.arguments = this.getArguments().map(function(arg) {
			return arg.toAST();
		});

		return ast;
	}
}