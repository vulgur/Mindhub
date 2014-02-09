// The canvas container is the area between the toolbar and the statusbar.
// The mind map will be drawn inside this area.
// The floating panels are contained within this area.

mindhub.CanvasContainer = function() {
	var self = this;
	var $content = $("#canvas-container");

	this.getContent = function() {
		return $content;
	};

	this.setSize = function() {
		var windowHeight = $(window).height();
		var headerHeight = $("#topbar").outerHeight(true);
		var footerHeight = $("#bottombar").outerHeight(true);
		var height = windowHeight - headerHeight - footerHeight;
		$content.height(height);

		var size = new mindhub.Point($content.width(), height);
		self.publish(mindhub.CanvasContainer.Event.RESIZED, size);
	};

	// set up the container to accept drag and drop of files from the desktop
	this.acceptFileDrop = function() {

		function ignore(e) {
			e.originalEvent.stopPropagation();
			e.originalEvent.prevetDefault();
		}

		function handleDragOver(e) {
			ignore(e);
		}

		function handleDrop(e) {
			ignore(e);

			var files = e.originalEvent.dataTransfer.files;
			var file = files[0];

			var reader = new FileReader();
			reader.onload = function() {
				self.receivedFileDrop(reader.result);
			};
			reader.readAsText(file);
		}

		$content.bind("dragover", handleDragOver);
		$content.bind("drop", handleDrop);
	};

	this.init = function() {
		// recalculate size when window is resized
		$(window).resize(function() {
			self.setSize();
		});

		this.setSize();
		this.acceptFileDrop();
	};

	// callback for when a file was dropped onto the container
	this.receivedFileDrop = function(result) {

	};
};

EventEmitter.mixin(mindhub.CanvasContainer);

// events fired by the container
mindhub.CanvasContainer.Event = {
	// fired when the container has been resized
	RESIZED : "ResizedEvent"
};

// Main View Controller.
// responsible for creating all main ui elements
mindhub.MainViewController = function(eventBus, mindmapModel, commmandRegistry) {
	var zoomController = new mindhub.ZoomController(eventBus, commmandRegistry);
	var canvasContainer = new mindhub.CanvasContainer();

	canvasContainer.receivedFileDrop = function(result) {
		try {
			var doc = mindhub.Document.fromJSON(result);
			mindmapModel.setDocument(doc);
		} catch(e) {
			eventBus.publish(mindhub.Event.NOTIFICATION_ERROR, "Could not read the file!");
			console.warn("Could not open the mind map via drag and drop!");
		}
	};

	this.go = function() {
		canvasContainer.init();

		// init all presenters

		// toolbar
		var toolbar = new mindhub.ToolBarView();
		var toolbarPresenter = new mindhub.ToolBarPresenter(eventBus, commmandRegistry,
			toolbar, mindmapModel);
		toolbarPresenter.go();

		// canvas
		var canvas = new mindhub.DefaultCanvasView();
		var canvasPrensenter = new mindhub.CanvasPresenter(eventBus, commmandRegistry,
			mindmapModel, canvas, zoomController);
		canvasPrensenter.go();

		// // statusbar
		// var statusbar = new mindhub.StatusBarView();
		// var statusbarPresenter = new mindhub.StatusBarPresenter(eventBus, statusbar);
		// statusbarPresenter.go();

		// // floating panels factory
		// var fpf = new mindhub.FloatPanelFactory(canvasContainer);

		// // inspector
		// var inspectorView = new mindhub.InspectorView();
		// var inspectorPresenter = new mindhub.InspectorPresenter(eventBus, mindmapModel,
		// 	inspectorView);
		// inspectorPresenter.go();

		// var inspectorPanel = fpf.create("Inspector", inspectorView.getContent());
		// inspectorPanel.show();
		// statusbarPresenter.addEntry(inspectorPanel);

		// // navigator
		// var navigatorView = new mindhub.NavigatorView();
		// var navigatorPresenter = new mindhub.NavigatorPresenter(eventBus, 
		// 	navigatorView, canvasContainer, zoomController);
		// navigatorPresenter.go();

		// var navigatorPanel = fpf.create("Navigator", navigatorView.getContent());
		// navigatorPanel.show();
		// statusbarPresenter.addEntry(navigatorPanel);
	};
};