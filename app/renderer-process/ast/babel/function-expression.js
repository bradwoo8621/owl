import Function from './function'
import Expression from './expression'

export default class FunctionExpression extends Expression {
	getType() {
		return 'FunctionExpression';
	}

	getFunction() {
		if (this.function == null) {
			this.function = new Function();
		}
		return this.function;
	}

	get async() {
		return this.getFunction().isAsync();
	}

	set async(async) {
		this.getFunction().async = async;
	}

	get generator() {
		return this.getFunction().isGenerator();
	}

	set generator(generator) {
		this.getFunction().generator = generator;
	}

	get id() {
		return this.getFunction().getId();
	}

	set id(id) {
		this.getFunction().id = id;
	}

	get params() {
		return this.getFunction().getParams();
	}

	set params(params) {
		this.getFunction().params = params;
	}

	get body() {
		return this.getFunction().getBody();
	}

	set body(body) {
		this.getFunction().body = body;
	}

	toAST() {
		let ast = this.getFunction().toAST();
		ast.type = this.getType();
		return ast;
	}
}