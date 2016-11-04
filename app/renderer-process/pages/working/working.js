const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const {Model, Layout, Envs, NForm} = require('../../../../node_modules/nest-parrot2/dist/nest-parrot2');

const router = require('../../common/router');

class Working {
	render() {
		ReactDOM.render(<NForm model={this.getToolBarModel()}
							   layout={this.getToolBarLayout()} />, 
				document.getElementById('toolbar'));
	}
	getToolBarModel() {
		if (this.toolbarModel == null) {
			this.toolbarModel = new Model({});
		}
		return this.toolbarModel;
	}
	getToolBarLayout() {
		if (this.toolbarLayout == null) {
			this.toolbarLayout = new Layout('form', {
				comp: {
					children: {
						tabs: {
							comp: {
								type: Envs.COMPONENT_TYPES.TAB,
								style: 'primary',
								tabs: [{
									label: 'Folders',
									children: {
										name: {}
									}
								}, {
									label: 'Components',
									children: {
										name: {}
									}
								}]
							}
						}
					}
				}
			});
		}
		return this.toolbarLayout;
	}
}

let working = new Working();
working.render();
module.exports = working;