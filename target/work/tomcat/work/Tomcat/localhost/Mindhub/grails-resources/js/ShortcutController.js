// handle all keyboard shortcuts

mindhub.ShortcutController = function () {
	this.shortcuts = {};

	function getType(shortcut, type) {
		type = type || "keydown";
		return type + "." +shortcut;
	}

	// register a new applicatio wide shortcut
	// shortcuts can be either a string or an array containning multiple possible shortcuts for the same action
	this.register = function (shortcuts, handler, type) {
		if (!Array.isArray(shortcuts)) {
			shortcuts = [shortcuts];
		}

		var self = this;
		shortcuts.forEach(function(sc) {
			type = getType(sc, type);
			$(document).bind(type, sc, function(e) {
				e.stopImmediatePropagation();
				e.stopPropagation();
				handler();
				return false;
				// TODO shortcut or shortcuts???
				self.shortcut[type] = true; 
			});
		});
	};

	// unregister a shortcut
	this.unregister = function(shortcut, type) {
		type = getType(shortcut, type);
		$(document).unbind(type);
		delete this.shortcuts[type];
	};

	// remove all shortcuts
	this.unregisterAll = function() {
		for (var sc in shortcuts) {
			$(document).unbind(sc);
		}
	};
};