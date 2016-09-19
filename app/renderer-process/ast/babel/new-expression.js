import CallExpression from './call-expression'

export default class NewExpression extends CallExpression {
	getType() {
		return 'NewExpression';
	}
}