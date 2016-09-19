import Expression from './expression'

export default class MemberExpression extends Expression {
	getType() {
		return 'MemberExpression';
	}

	getComputed() {
		return this.computed ? true : false;
	}

	getObject() {
		return this.object;
	}

	getProperty() {
		return this.property;
	}

	toAST() {
		let ast = super.toAST();
		ast.computed = this.getComputed();
		ast.object = this.getObject().toAST();
		ast.property = this.getProperty().toAST();
		return ast;
	}
}