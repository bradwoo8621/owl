export default class ASTNode {
	getType() {
		return this.type;
	}

	toAST() {
		return {
			type: this.getType()
		};
	}
}