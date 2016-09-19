import Expression from './expression'

export default class ObjectExpression extends Expression {
	constructor(properties) {
		super();
		if (properties) {
			this.properties = properties;
		}
	}

	getType() {
		return 'ObjectExpression';
	}

	getProperties() {
		if (this.properties == null) {
			this.properties = [];
		}
		return this.properties;
	}

	toAST() {
		let ast = super.toAST();
		ast.properties = this.getProperties().map(function(prop) {
			return prop.toAST();
		});

		return ast;
	}
}