// create a new CommandRegistry

mindhub.CommandRegistry = function(shortcutController) {
	this.commands = {};

	function registerShortcut(command) {
		if (command.shortcut && command.execute) {
			shortcutController.register(command.shortcut, command.execute.bind(command));
		}
	}

	function unregisterShortcut(command) {
		if (command.shortcut) {
			shortcutController.unregister(command.shortcut);
		}
	}

	// returns a command object by the given type
	this.get = function(commandType) {
		var command = this.commands[commandType];
		if (!command) {
			command = new commandType;
			this.commands[commandType] = command;

			if (shortcutController) {
				registerShortcut(command);
			}
		}
		return command;
	};

	// removes the command object by the give type
	this.remove = function(commandType) {
		var command = this.commands[commandType];
		if (!command) {
			return;
		}

		delete this.commands[commandType];

		if (shortcutController) {
			unregisterShortcut(command);
		}
	};
};