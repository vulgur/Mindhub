// toolbar view

mindhub.ToolBarView = function() {
	var self = this;
	this.init = function() {

	};

	// add a button to the toolbar with the given align function
	this.addButton = function(button, alignFunc) {
		alignFunc(button.asJquery());
	};

	this.addButtonGroup = function(buttons, alignFunc) {
		var $buttonset = $("<span/>");
		buttons.forEach(function(button) {
			$buttonset.append(button.asJquery());
		});
		$buttonset.buttonset();
		alignFunc($buttonset);
	};

	this.addMenu = function(menu) {
		this.alignRight(menu.getContent());
	};

	this.alignLeft = function($element) {
		$element.appendTo("#toolbar .buttons-left");
	};

	this.alignRight = function($element) {
		$element.appendTo("#toolbar .buttons-right");
	};

};

// toolbar button model

mindhub.ToolBarButton = function(command) {
	this.command = command;

	var self = this;
	command.subscribe(mindhub.Command.Event.ENABLED_CHANGED, function(enabled) {
		if (self.setEnabled) {
			self.setEnabled(enabled);
		}
	});
};

mindhub.ToolBarButton.prototype.isEnabled = function() {
	return this.command.enabled;
};

mindhub.ToolBarButton.prototype.click = function() {
	this.command.execute();
};

mindhub.ToolBarButton.prototype.getTitle = function() {
	return this.command.label;
};

mindhub.ToolBarButton.prototype.getToolTip = function() {
	var tooltip = this.command.description;

	var shortcut = this.command.shortcut;
	if (shortcut) {
		if (Array.isArray(shortcut)) {
			shortcut = shortcut.join(", ");
		}

		tooltip += " [" + shortcut.toUpperCase() + "]";
	}
	return tooltip;
};

mindhub.ToolBarButton.prototype.getId = function() {
	return "button-" + this.command.id;
};

mindhub.ToolBarButton.prototype.asJquery = function() {
	var self = this;
	var $button = $("<button/>", {
		id: this.getId(),
		title: this.getToolTip()
	}).click(function() {
		self.click();
	}).button({
		label: this.getTitle(),
		disabled: !this.isEnabled()
	});

	var icon = this.command.icon;
	if (icon) {
		$button.button({
			icons: {
				primary: icon
			}
		});
	}

	this.setEnabled = function(enabled) {
		$button.button(enabled ? "enable" : "disable");
	};

	return $button;
};

mindhub.ToolBarMenu = function(title, icon) {
	var self = this;

	this.$menuWrapper = $("<span/>", {
		"class": "menu-wrapper"
	}).hover(function() {
		self.$menu.show();
	}, function() {
		self.$menu.hide();
	});

	this.$menuButton = $("<button/>").button({
		label: title,
		icons: {
			primary: icon,
			secondary: "ui-icon-triangle-1-s"
		}
	}).appendTo(this.$menuWrapper);

	this.$menu = $("<div/>", {
		"class":"menu"
	}).click(function() {
		self.$menu.hide();
	}).appendTo(this.$menuWrapper);

	this.add = function(buttons) {
		if (!Array.isArray(buttons)) {
			buttons = [buttons];
		}

		buttons.forEach(function(button) {
			var $button = button.asJquery().removeClass("ui-corner-all")
				.addClass("menu-item");
			this.$menu.append($button);
		}, this);

		// last item gets rounded corners
		this.$menu.children().last().addClass("ui-corner-bottom")
			.prev().removeClass("ui-corner-bottom");
	};

	this.getContent = function() {
		return this.$menuWrapper;
	};
};

// ToolBar presenter
mindhub.ToolBarPresenter = function(eventBus, commandRegistry, view, mindmapModel) {

	function commandToButton(commandType) {
		var command = commandRegistry.get(commandType);
		return new mindhub.ToolBarButton(command);
	}

	function commandsToButtons(commands) {
		return commands.map(commandToButton);
	}

	// populate toolbar

	// node buttons
	var nodeCommands = [mindhub.CreateNodeCommand, mindhub.DeleteNodeCommand];
	var nodeButtons = commandsToButtons(nodeCommands);
	view.addButtonGroup(nodeButtons, view.alignLeft);

	// undo buttons
	var undoCommands = [mindhub.UndoCommand, mindhub.RedoCommand];
	var undoButtons = commandsToButtons(undoCommands);
	view.addButtonGroup(undoButtons, view.alignLeft);

	var saveCommand = [mindhub.SaveDocumentCommand];
	var saveButton = commandToButton(saveCommand);
	view.addButton(saveButton, view.alignLeft);

	// clipboard buttons
	/*var clipboardCommands = [mindhub.CopyNodeCommand,
		mindhub.CutNodeCommand, mindhub.PasteNodeCommand
	];
	var clipboardButtons = commandsToButtons(clipboardCommands);
	view.addButtonGroup(clipboardButtons, view.alignLeft);*/

	// file menu
	// var fileMenu = new mindhub.ToolBarMenu("Mind map", "ui-icon-document");
	// var fileCommands = [mindhub.NewDocumentCommand,
	// 	mindhub.OpenDocumentCommand, mindhub.SaveDocumentCommand,
	// 	// mindhub.ExportCommand, mindhub.PrintCommand,
	// 	mindhub.CloseDocumentCommand
	// ];
	// var fileButtons = commandsToButtons(fileCommands);
	// fileMenu.add(fileButtons);
	// view.addMenu(fileMenu);

	// help button
	// view.addButton(commandToButton(mindhub.HelpCommand), view.alignRight);

	this.go = function() {
		view.init();
	};
};