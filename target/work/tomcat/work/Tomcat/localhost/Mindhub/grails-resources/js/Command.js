// base class for all commands

mindhub.Command = function() {
	this.id = "BASE_COMMAND";
	this.shortcut = null;

	this.handler = null;
	this.label = null;
	this.description = null;

	this.isEnabled = false;
};

mindhub.Command.Event = {
	HANDLER_REGISTERED: "HandlerRegistertedCommandEvent",
	HANDLER_REMOVED: "HnadlerRemovedCommandEvent",
	ENABLED_CHANGED: "EnabledChangedCommandEvent"
};

mindhub.Command.prototype = {
	execute: function() {
		if (this.handler) {
			this.handler();
			if (mindhub.DEBUG) {
				console.log("handler called for ", this.id);
			}
		} else {
			if (mindhub.DEBUG) {
				console.log("no handler found for ", this.id);
			}
		}
	},

	setHandler: function(handler) {
		this.removeHandler();
		this.handler = handler;
		this.publish(mindhub.Command.Event.HANDLER_REGISTERED);
	},

	removeHandler: function() {
		this.handler = null;
		this.publish(mindhub.Command.Event.HANDLER_REMOVED);
	},

	setEnabled: function(enabled) {
		this.isEnabled = enabled;
		this.publish(mindhub.Command.Event.ENABLED_CHANGED, enabled);
	}
};

// mixin EventEmitter into command objects
EventEmitter.mixin(mindhub.Command);

// node commands

// command for creating a new node
mindhub.CreateNodeCommand = function() {
	this.id = "CREATE_NODE_COMMAND";
	this.shortcut = "tab";
	this.label = "Add";
	this.icon = "ui-icon-plusthick";
	this.description = "Creates a new node";
};
mindhub.CreateNodeCommand.prototype = new mindhub.Command();

// command for creating a sibling node
mindhub.CreateSiblingNodeCommand = function() {
	this.id = "CREATE_SIBLING_NODE_COMMAND";
	this.shortcut = "shift+tab";
	this.label = "Add";
	this.icon = "ui-icon-plusthick";
	this.description = "Creates a new sibling node";
};
mindhub.CreateSiblingNodeCommand.prototype = new mindhub.Command();

// command for deleting a node
mindhub.DeleteNodeCommand = function() {
	this.id = "DELETE_NODE_COMMAND";
	this.shortcut = ["del", "backspace"];
	this.label = "Delete";
	this.icon = "ui-icon-minusthick";
	this.description = "Deletes a node";
};
mindhub.DeleteNodeCommand.prototype = new mindhub.Command();

// command for editing node content
mindhub.EditNodeContentCommand = function() {
	this.id = "EDIT_NODE_CONTENT_COMMAND";
	this.shortcut = ["F2", "return"];
	this.label = "Edit node content";
	this.description = "Edits the node text";
};
mindhub.EditNodeContentCommand.prototype = new mindhub.Command();

// command for toggling node folding
mindhub.ToggleNodeFoldingCommand = function() {
	this.id = "TOGGLE_NODE_FOLDING_COMMAND";
	this.shortcut = "space";
	this.description = "Show or hide the node's children";
};
mindhub.ToggleNodeFoldingCommand.prototype = new mindhub.Command();

// command for undo
mindhub.UndoCommand = function() {
	this.id = "UNDO_COMMAND";
	this.shortcut = ["ctrl+z", "meta+z"];
	this.label = "Undo";
	this.icon = "ui-icon-arrowreturnthick-1-w";
	this.description = "Undo";
};
mindhub.UndoCommand.prototype = new mindhub.Command();

// command for redo
mindhub.RedoCommand = function() {
	this.id = "REDO_COMMAND";
	this.shortcut = ["ctrl+y", "meth+shift+z"];
	this.label = "Redo";
	this.icon = "ui-icon-arrowreturnthick-1-e";
	this.description = "Redo";
};
mindhub.RedoCommand.prototype = new mindhub.Command();

// command for copying a node
mindhub.CopyNodeCommand = function() {
	this.id = "COPY_COMMAND";
	this.shortcut = ["ctrl+c", "meta+c"];
	this.label = "Copy";
	this.icon = "ui-icon-copy";
	this.description = "Copy a branch";
};
mindhub.CopyNodeCommand.prototype = new mindhub.Command();

// command for cutting a node
mindhub.CutNodeCommand = function() {
	this.id = "CUT_COMMAND";
	this.shortcut = ["ctrl+x", "meta+x"];
	this.label = "Cut";
	this.icon = "ui-icon-scissors";
	this.description = "Cut a branch";
};
mindhub.CutNodeCommand.prototype = new mindhub.Command();

// command for pasting a node
mindhub.PasteNodeCommand = function() {
	this.id = "PASTE_COMMAND";
	this.shortcut = ["ctrl+v", "meta+v"];
	this.label = "Paste";
	this.icon = "ui-icon-clipboard";
	this.description = "Paste a branch";
};
mindhub.PasteNodeCommand.prototype = new mindhub.Command();

// document commands

// command for creating a new document
mindhub.NewDocumentCommand = function() {
	this.id = "NEW_DOCUMENT_COMMAND";
	this.label = "New";
	this.icon = "ui-icon-document-b";
	this.description = "Create a new mind map";
};
mindhub.NewDocumentCommand.prototype = new mindhub.Command();

// command for opening a document
mindhub.OpenDocumentCommand = function() {
	this.id = "OPEN_DOCUMENT_COMMAND";
	this.label = "Open";
	this.shortcut = ["ctrl+o", "meta+o"];
	this.icon = "ui-icon-folder-open";
	this.description = "Open a mind map";
};
mindhub.OpenDocumentCommand.prototype = new mindhub.Command();

// command for saving a document
mindhub.SaveDocumentCommand = function() {
	this.id = "SAVE_DOCUMENT_COMMAND";
	this.label = "Save";
	this.shortcut = ["ctrl+s", "meta+s"];
	this.icon = "ui-icon-disk";
	this.description = "Save the mind map";
};
mindhub.SaveDocumentCommand.prototype = new mindhub.Command();

// command for closing a document
mindhub.CloseDocumentCommand = function() {
	this.id = "CLOSE_DOCUMENT_COMMAND";
	this.label = "Close";
	this.icon = "ui-icon-close";
	this.description = "Close the mind map";
};
mindhub.CloseDocumentCommand.prototype = new mindhub.Command();