"use strict";

// namespace for mindhub
var mindhub = mindhub || {};
mindhub.VERSION = "0.0.1";

$(function() {
	removeEventLayerXY();

	initConsole();
	var appController = new mindhub.ApplicationController();
	appController.go();
});

function initConsole() {
	var noOp = function() {};

	// provide console object and dummy functions if not built-in
	var console = window.console || {};
	['log', 'info', 'debug', 'warn', 'error'].forEach(function(prop) {
		console[prop] = console[prop] || noOp;
	});

	if (!mindhub.DEBUG) {
		console.debug = noOp;
		console.info = noOp;
		console.log = noOp;
		console.warn = noOp;
		console.error = function(s) {
			window.alert("Error: " + s);
		};
	}

	window.console = console;
}

function removeEventLayerXY() {
	// remove layerX and layerY
	var all = $.event.props,
		len = all.length,
		res = [];

	while (len--) {
		var el = all[len];
		if (el != 'layerX' && el != 'layerY') res.push(el);
	}
	$.event.props = res;
}