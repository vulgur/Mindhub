// This view shows a minified version of mindmap and controls for adjusting the zoom

mindhub.NavigatorView = function() {
	var self = this;

	var $content = $("#template-navigator").tmpl();
	var $contentActive = $content.children(".active").hide();
	var $contentInactive = $content.children(".inactive").hide();
	var $dragger = $("#navi-canvas-overlay", $content);
	var $canvas = $("#navi-canvas", $content);

	this.getContent = function() {
		return $content;
	};

	this.showActiveContent = function() {
		$contentInactive.hide();
		$contentActive.show();
	};

	this.showInactiveContent = function() {
		$contentActive.hide();
		$contentInactive.show();
	};

	this.setDraggerSize = function(width, height) {
		$dragger.css({
			width: width,
			height: height
		});
	};

	this.setDraggerPosition = function(x, y) {
		$dragger.css({
			left: x,
			top: y
		});
	};

	// set the height of the mini canvas
	this.setCanvasHeight = function(height) {
		$("#navi-canvas", $content).css({
			height: height
		});
	};

	// get the width of the mini canvas
	this.getCanvasWidth = function() {
		return $("#navi-canvas", $content).width();
	};

	this.init = function(canvasSize) {
		$("#navi-slider", $content).slider({
			min: 0,
			max: 11,
			step: 1,
			value: 3,
			slide: function(e, ui) {
				if (self.sliderChanged) {
					self.sliderChanged(ui.value);
				}
			}

		});

		$("#button-navi-zoom-in", $content).button({
			text: false,
			icons: {
				primary: "ui-icon-zoomin"
			}
		}).click(function() {
			if (self.buttonZoomInClicked) {
				self.buttonZoomInClicked();
			}
		});

		$("#button-navi-zoom-out", $content).button({
			text: false,
			icons: {
				primary: "ui-icon-zoomout"
			}
		}).click(function() {
			if (self.buttonZoomOutClicked) {
				self.buttonZoomOutClicked();
			}
		});

		// make draggable
		$dragger.draggable({
			containment: "parent",
			start: function(e, ui) {
				if (self.dragStart) {
					self.dragStart();
				}
			},
			drag: function(e, ui) {
				if (self.dragging) {
					var x = ui.position.left;
					var y = ui.position.top;
					self.dragging(x, y);
				}
			},
			stop: function(e, ui) {
				if (self.dragStop) {
					self.dragStop();
				}
			}
		});
	};

	// draw the complete mind map onto the mini canvas
	this.draw = function(mindmap, scaleFactor) {
		var root = mindmap.root;
		var canvas = $canvas[0];
		var width = canvas.width;
		var height = canvas.height;
		var context = canvas.getContext("2d");
		context.clearRect(0, 0, width, height);
		context.lineWidth = 1.8;

		drawNode(root, width / 2, height / 2);

		// draw rect for root
		context.fillRect(width / 2 - 4, height / 2 - 4, 8, 4);

		function scale (value) {
			return value / scaleFactor;
		}
		function drawNode(node, x, y) {
			context.save();
			context.translate(x, y);

			if (!node.collapseChildren) {
				node.forEachChild(function(child) {
					context.beginPath();
					context.strokeStyle = child.branchColor;
					context.moveTo(0, 0);
					var x = scale(child.position.x);
					var y = scale(child.position.y);
					var textWidth = 5;

					/**
					 * draw two lines: one link to the node, and a second horizontal line for the node content.
					 * if node is left of the parent (x<0), shorten the first line and draw the rest
					 * horizontally to arrive at the node's offset position.
					 * in the other case, draw the line to the node's offset and draw another for the text.
					 */
					if (x < 0) {
						var firstStop = x + textWidth;
						var secondStop = x;
					} else {
						var firstStop = x;
						var secondStop = x + textWidth;
					}

					context.lineTo(firstStop, y);
					context.lineTo(secondStop, y);

					context.stroke();
					drawNode(child, secondStop, y);
				});
			}
			context.restore();
		}
	};

	this.showZoomLevel = function(zoom) {
		$("#navi-zoom-level").text(zoom);
	};

	this.setSliderValue = function(value) {
		$("#navi-slider").slider("value", value)
	};
};

mindhub.NavigatorPresenter = function(eventBus, view, container, zoomController) {
	var self = this;
	var $container = container.getContent();
	var viewDragging = false;
	var scale = zoomController.DEFAULT_ZOOM;
	var canvasSize = new mindhub.Point();
	var docSize = null;
	var mindmap = null;

	// calculate and set the size of the dragger element
	function calculateDraggerSize() {
		var cw = $container.width() / scale;
		var ch = $container.height() / scale;

		var width = (cw * canvasSize.x) / docSize.x;
		var height = (ch * canvasSize.y) / docSize.y;

		if (width > canvasSize.x) {
			width = canvasSize.x;
		}

		if (height > canvasSize.y) {
			height = canvasSize.y;
		}

		view.setDraggerSize(width, height);
	}

	// calculate and set the size of the mini canvas
	function calculateCanvasSize() {
		var width = view.getCanvasWidth();
		var factor = docSize.x / width;
		var height = docSize.y / factor;

		view.setCanvasHeight(height);

		canvasSize.x = width;
		canvasSize.y = height;
	}

	// calculate and set the position of the dragger element
	function calculateDraggerPosition() {
		var sl = $container.scrollLeft() / scale;
		var st = $container.scrollTop() / scale;

		var left = sl * canvasSize.x / docSize.x;
		var top = st * canvasSize.y / docSize.y;
		view.setDraggerPosition(left, top);
	}

	// calculate and set the zoom level
	function calculateZoomLevel() {
		var zoomLevel = scale * 100 + " %";
		view.showZoomLevel(zoomLevel);
	}

	// calculate and set the slider value for the zoom level
	function calculateSliderValue() {
		var val = scale / zoomController.ZOOM_STEP - 1;
		view.setSliderValue(val);
	}

	// init view when a document was opened
	function documentOpened(doc) {
		docSize = doc.dimensions;
		mindmap = doc.mindmap;

		calculateCanvasSize();
		calculateDraggerPosition();
		calculateDraggerSize();
		calculateZoomLevel();
		calculateSliderValue();
		renderView();

		view.showActiveContent();

		// move dragger when container was scrolled
		$container.bind("scroll.navigator-view", function() {
			if (!viewDragging) {
				calculateDraggerPosition();
			}
		});
	}

	// update the canvas of the view component
	function renderView() {
		var scale = docSize.x / canvasSize.x;
		view.draw(mindmap, scale);
	}

	// reset when document was closed
	function documentClosed() {
		docSize = null;
		mindmap = null;
		scale = 1;

		$container.unbind("scroll.navigator-view");

		view.showInactiveContent();
	}

	// view callbacks

	view.dragStart = function() {
		viewDragging = true;
	};

	view.dragging = function() {
		var scrollLeft = scale * docSize.x * x / canvasSize.x;
		var scrollTop = scale * docSize.y * y / canvasSize.y;
		$container.scrollLeft(scrollLeft).scrollTop(scrollTop);
	};

	view.dragStop = function() {
		viewDragging = false;
	};

	view.buttonZoomInClicked = function() {
		zoomController.zoomIn();
	};

	view.buttonZoomOutClicked = function() {
		zoomController.zoomOut();
	};

	view.sliderChanged = function(value) {
		zoomController.zoomTo((value + 1) * zoomController.ZOOM_STEP);
	};

	// set dragger size when container was resized
	container.subscribe(mindhub.CanvasContainer.Event.RESIZED, function() {
		if (docSize) {
			calculateDraggerSize();
		}
	});

	// document events
	eventBus.subscribe(mindhub.Event.DOCUMENT_OPENED, documentOpened);
	eventBus.subscribe(mindhub.Event.DOCUMENT_CLOSED, documentClosed);

	// node events
	eventBus.subscribe(mindhub.Event.NODE_MOVED, renderView);
	eventBus.subscribe(mindhub.Event.NODE_BRANCH_COLOR_CHANGED, renderView);
	eventBus.subscribe(mindhub.Event.NODE_BRANCH_COLOR_CHANGED, renderView);
	eventBus.subscribe(mindhub.Event.NODE_CREATED, renderView);
	eventBus.subscribe(mindhub.Event.NODE_DELETED, renderView);
	eventBus.subscribe(mindhub.Event.NODE_OPENED, renderView);
	eventBus.subscribe(mindhub.Event.NODE_CLOSED, renderView);

	eventBus.subscribe(mindhub.Event.ZOOM_CHANGED, function(zoomFactor) {
		scale = zoomFactor;
		calculateDraggerPosition();
		calculateDraggerSize();
		calculateZoomLevel();
		calculateSliderValue();
	});

	this.go = function() {
		view.init();
		view.showInactiveContent();
	};
};