const ast = require('./babel');

class ExportSection {
	build() {
		let statement = new ast.ExpressionStatement();
		statement.expression = this.buildAssignment();
		return statement;
	}

	buildAssignment() {
		let assignment = new ast.AssignmentExpression();
		assignment.left = this.buildAssignmentLeft();
		assignment.right = this.buildAssignmentRight();

		return assignment;
	}

	buildAssignmentLeft() {
		let member = new ast.MemberExpression();
		member.object = new ast.Identifier('module');
		member.property = new ast.Identifier('exports');

		return member;
	}

	buildAssignmentRight() {
		let func = new ast.FunctionExpression();
		func.params = [new ast.Identifier('options')];
		func.body = [this.buildReturnStatement()]

		return func;
	}

	buildReturnStatement() {
		let ret = new ast.ReturnStatement();
		ret.argument = this.buildReturnObject();
		return ret;
	}

	buildReturnObject() {
		let object = new ast.NewExpression();
		object.callee = new ast.Identifier('Controller');
		object.arguments = [
			new ast.ObjectExpression([
				this.buildReturnObjectParam('layout', 'Layout'),
				this.buildReturnObjectParam('mocker', 'Mocker')
			]),
			new ast.Identifier('options')
		];

		return object;
	}

	buildReturnObjectParam(name, clazz) {
		let prop = new ast.ObjectProperty();
		prop.key = new ast.Identifier(name);

		let object = new ast.NewExpression();
		object.callee = new ast.Identifier(clazz);
		object.arguments = [
			new ast.Identifier('options')
		];
		prop.value = object;

		return prop;
	}
}

module.exports = ExportSection;