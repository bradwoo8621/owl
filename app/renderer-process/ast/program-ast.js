const fs = require('fs');
const babel = require("babel-core");

const ExportSection = require('./export-ast');

class ProgramAST {
	loadFromFile(file) {
		let code = fs.readFileSync(file, 'utf8');
		let result = babel.transform(code, {
			presets: ['react'],
			plugins: ['transform-react-jsx']
		});
		let body = result.ast.program.body;

		this.classes = body.filter((node) => {
			return node.type === 'ClassDeclaration';
		});
		this.exports = new ExportSection().build();
	}

	writeToFile(file) {
		fs.writeFileSync(file, this.getSourceCode());
	}

	getSourceCode() {
		return babel.transformFromAst(this.toAST()).code;
	}

	getClasses() {
		return this.classes;
	}

	getExportSection() {
		return this.exports;
	}

	toAST() {
		return {
			type: 'Program',
			body: this.getClasses().map(function(clazz) {
				return clazz.toAST();
			}).concat(this.getExportSection().toAST())
		}
	}
}

module.exports = ProgramAST;