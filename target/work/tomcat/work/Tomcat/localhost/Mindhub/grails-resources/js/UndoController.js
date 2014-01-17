// The undo controller mananges an instance of UndoManager and delegates all undo and redo commands to the undo UndoManager

mindhub.UndoController = function(eventBus, commandRegistry) {
	this.init = function() {
		this.undoManager = new UndoManager(128);
		this.undoManager.stateChanged = this.undoStateChanged.bind(this);

		this.undoCommand = commandRegistry.get(mindhub.UndoCommand);
		this.undoCommand.setHandler(this.doUndo.bind(this));

		this.redoCommand = commandRegistry.get(mindhub.RedoCommand);
		this.redoCommand.setHandler(this.doRedo.bind(this));

		eventBus.subscribe(mindhub.Event.DOCUMENT_OPENED, this.documentOpened.bind(this));
		eventBus.subscribe(mindhub.Event.DOCUMENT_CLOSED, this.documentClosed.bind(this));
	};

	this.undoStateChanged = function() {
		this.undoCommand.setEnabled(this.undoManager.canUndo());
		this.redoCommand.setEnabled(this.undoManager.canRedo());
	};

	this.addUndo = function(undoFunc, redoFunc) {
		this.undoManager.addUndo(undoFunc, redoFunc);
	};

	this.doUndo = function() {
		this.undoManager.undo();
	};

	this.doRedo = function() {
		this.undoManager.redo();
	};

	this.documentOpened = function() {
		this.undoManager.reset();
		this.undoStateChanged();
	};

	this.documentClosed = function() {
		this.undoManager.reset();
		this.undoStateChanged();
	};

	this.init();
};