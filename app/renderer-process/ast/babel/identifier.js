import ASTNode from './node'

export default class Identifier extends ASTNode {
	constructor(name) {
		super();
		if (name) {
			this.name = name;
		}
	}

	getType() {
		return 'Identifier';
	}

	getName() {
		return this.name;
	}

	toAST() {
		let ast = super.toAST();
		ast.name = this.getName();
		
		return ast;
	}
}