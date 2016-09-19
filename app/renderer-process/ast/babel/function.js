import ASTNode from './node'
import BlockStatement from './block-statement'

export default class Function extends ASTNode {
	getType() {
		return 'Function';
	}

	getAsync() {
		return this.async ? true : false;
	}

	getGenerator() {
		return this.generator ? true : false;
	}

	getId() {
		return this.id;
	}

	getParams() {
		if (this.params == null) {
			this.params = [];
		}
		return this.params;
	}

	get body() {
		return this.getOrCreateBody().getBody();
	}

	set body(body) {
		this.getOrCreateBody().body = body;
	}

	getOrCreateBody() {
		if (this.block == null) {
			this.block = new BlockStatement();
		}
		return this.block;
	}

	toAST() {
		let ast = super.toAST();
		ast.async = this.getAsync();
		ast.generator = this.getGenerator();
		ast.id = this.getId() == null ? null : this.getId().toAST();
		ast.params = this.getParams().map(function(param) {
			return param.toAST();
		});
		ast.body = this.getOrCreateBody().toAST();
		return ast;
	}
}