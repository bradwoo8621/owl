const classnames = require('classnames');

const $ = require('jquery');
window.jQuery = $;
const mousewheel = require('jquery-mousewheel')($);
require('bootstrap');
require('bootstrap-fileinput');
const moment = require('moment');
const React = require('react');
const ReactDOM = require('react-dom');
const jsface = require('jsface');

const parrot = require('nest-parrot')(window, $, jsface, moment, React, ReactDOM, false);

// consts
NFormCell.LABEL_WIDTH = 6;						// 50/50
parrot.BUILD_PROPERTY_VISITOR = false;			// no getter/setter
parrot.PROPERTY_SEPARATOR = '.';				// use .
parrot.LayoutHelper.setDefaultCellWidth(4);		// 3 cell per line

const labelDirection = $pt.createCodeTable([
	{id: 'horizontal', text: 'Horizontal'},
	{id: 'vertical', text: 'Vertical'}
]);

module.exports = {
	parrot: parrot,
	react: React,
	reactDOM: ReactDOM,
	moment: moment,
	jsface: jsface,
	jquery: $,
	codes: {
		labelDirection: labelDirection
	}
};