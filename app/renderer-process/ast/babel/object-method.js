import ObjectMember from './object-member'
import Function from './function'

export default class ObjectMethod extends ObjectMember {
	getType() {
		return 'ObjectMethod';
	}

	getKind() {
		if (this.kind == null) {
			this.kind = 'method';
		}
		return this.kind;
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
		let superAST = super.toAST();
		let ast = this.getFunction().toAST();

		Object.keys(superAST).forEach(function(key) {
			ast[key] = superAST[key];
		})
		ast.kind = this.getKind();

		return ast;
	}
}