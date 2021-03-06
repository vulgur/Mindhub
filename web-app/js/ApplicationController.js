mindhub.ApplicationController = function() {
	var eventBus = new mindhub.EventBus();
	var shortcutController = new mindhub.ShortcutController();
	var commandRegistry = new mindhub.CommandRegistry(shortcutController);
	var undoController = new mindhub.UndoController(eventBus, commandRegistry);
	var mindmapModel = new mindhub.MindMapModel(eventBus, commandRegistry, undoController);
	//var clipboardController = new mindhub.ClipboardController(eventBus, commandRegistry, mindmapModel);
	//var helpController
	//var printController
	//var autosaveController
	//var filePicker
	var autosaveController = new mindhub.AutoSaveController(eventBus, mindmapModel);
	var filePicker = new mindhub.FilePicker(eventBus, mindmapModel);
	var docId = $('#docId').val();
	var isOrigin = $('#isOrigin').val();

	function doNewDocument() {
		// close old doc first
		var doc = mindmapModel.getDocument();
		doCloseDocument();

		var presenter = new mindhub.NewDocumentPresenter(eventBus,
			mindmapModel, new mindhub.NewDocumentView());
		presenter.go();
	}

	function doSaveDocument() {
		var presenter = new mindhub.SaveDocumentPresenter(eventBus,
			mindmapModel, new mindhub.SaveDocumentView(), autosaveController, filePicker);
		presenter.go();
	}

	function doCommitDocument() {
		var presenter = new mindhub.CommitDocumentPresenter(eventBus,mindmapModel,
			new mindhub.CommitDocumentView());
		presenter.go();
	}
	function doCloseDocument() {
		var doc = mindmapModel.getDocument();
		if (doc) {
			mindmapModel.setDocument(null);
		}
	}

	function doOpenDocument() {
		var presenter = new mindhub.OpenDocumentPresenter(eventBus,
			mindmapModel, new mindhub.OpenDocumentView(), filePicker);
		presenter.go;
	}

	function doOpenDocumentJSON() {
		if (docId) {
			console.log("AC - doOpenDocumentJSON: docId=" + docId);
			var presenter = new mindhub.OpenDocumentJSONPresenter(eventBus,
				mindmapModel, new mindhub.OpenDocumentJSONView(), docId);
		} else {
			var originDocId = $('#originDocId').val();
			console.log("AC - doOpenDocumentJSON: originDocId=" + originDocId);
			var presenter = new mindhub.OpenDocumentJSONPresenter(eventBus,
				mindmapModel, new mindhub.OpenDocumentJSONView(), originDocId);
		}

		presenter.go();
	}
	// function doExportDocument(){}

	this.init = function() {
		var newDocuemntCommand = commandRegistry.get(mindhub.NewDocumentCommand);
		newDocuemntCommand.setHandler(doNewDocument);
		newDocuemntCommand.setEnabled(true);

		var openDocumentCommand = commandRegistry.get(mindhub.OpenDocumentCommand);
		openDocumentCommand.setHandler(doOpenDocument);
		openDocumentCommand.setEnabled(true);

		var saveDocumentCommand = commandRegistry.get(mindhub.SaveDocumentCommand);
		saveDocumentCommand.setHandler(doSaveDocument);

		var closeDocumentCommand = commandRegistry.get(mindhub.CloseDocumentCommand);
		closeDocumentCommand.setHandler(doCloseDocument);

		// var exprotCommand

		eventBus.subscribe(mindhub.Event.DOCUMENT_CLOSED, function() {
			saveDocumentCommand.setEnabled(false);
			closeDocumentCommand.setEnabled(false);
			// exportCommand.setEnabled(false);
		});

		eventBus.subscribe(mindhub.Event.DOCUMENT_OPENED, function() {
			saveDocumentCommand.setEnabled(true);
			closeDocumentCommand.setEnabled(true);
			// exportCommand.setEnabled(true);
		});
	};

	this.go = function() {
		var viewController = new mindhub.MainViewController(eventBus, mindmapModel, commandRegistry);
		viewController.go();
		// edit the document
		if (docId) {
			console.log("EDIT DOCUMENT");
			doOpenDocumentJSON();
		} else {
			// new document
			if (isOrigin == "true") {
				console.log("New Document");
				doNewDocument();
			} else { // fork the document
				console.log("FORK DOCUMENT");
				doOpenDocumentJSON();
			}
		}

	};

	this.init();

};