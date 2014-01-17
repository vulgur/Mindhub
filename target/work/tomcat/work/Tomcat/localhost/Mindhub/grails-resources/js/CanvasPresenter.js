mindhub.CanvasPresenter = function(eventBus, commandRegistry, mindmapModel,
	view, zoomController) {
	var self = this;
	var creator = view.getCreator();

	this.init = function() {
		var editContentCommand = commandRegistry.get(mindhub.EditNodeContentCommand);
		editContentCommand.setHandler(this.editNodeContent.bind(this));

		var toggleNodeFoldingCommand = commandRegistry.get(mindhub.ToggleNodeFoldingCommand);
		toggleNodeFoldingCommand.setHandler(toggleFolding);
	};


	this.editNodeContent = function(node) {
		if (!node) {
			node = mindmapModel.selectedNode;
		}
		view.startEditNodeContent(node);
	};

	var toggleFolding = function(node) {
		if (!node) {
			node = mindmapModel.selectedNode;
		}

		var action = new mindhub.action.ToggleNodeFodingAction(node);
		mindmapModel.executeAction(action);
	};

	var selectNode = function(selectedNode, oldSelectedNode) {
		// deselect old node
		if (oldSelectedNode) {
			view.unhighlightNode(oldSelectedNode);
		}
		view.highlightNode(selectedNode);
	};

	view.mouseWheeled = function(delta) {
		view.stopEditNodeContent();

		if (delta > 0) {
			zoomController.zoomIn();
		} else {
			zoomController.zoomOut();
		}
	};

	view.nodeMouseOver = function(node) {
		if (view.isNodeDragging() || creator.isDragging()) {
			// don't relocate the creator if we are dragging
		} else {
			// console.log("--- mouse over node");
			creator.attachToNode(node);
		}
	};

	view.nodeContentMouseOver = function(node) {
		if (view.isNodeDragging() || creator.isDragging()) {

		} else {
			// console.log("--- mouse over node content");
			creator.attachToNode(node);
		}
	};

	view.nodeMouseDown = function(node) {
		mindmapModel.selectNode(node);
		creator.attachToNode(node);
	};

	view.nodeDoubleClicked = function(node) {
		view.startEditNodeContent(node);
	};

	// view callback: execute MoveNodeAction when node was dragged
	view.nodeDragged = function(node, pos) {
		var action = new mindhub.action.MoveNodeAction(node, pos);
		mindmapModel.executeAction(action);
	};

	view.foldButtonClicked = function(node) {
		toggleFolding(node);
	};

	// CREATOR TOOLS

	creator.dragStarted = function(node) {
		var color = node.isRoot() ? mindhub.Util.randomColor() : node.branchColor;
		return color;
	};

	creator.dragStopped = function(parent, x, y, distance) {
		if (distance < 50) {
			return;
		}

		// update the model
		var node = new mindhub.Node();
		node.branchColor = creator.lineColor;
		node.position = new mindhub.Point(x, y);
		node.shouldEditContent = true;

		mindmapModel.createNode(node, parent);
	};

	view.nodeContentEditCommitted = function(node, str) {
		// avoid spaces only 
		var string = $.trim(str);
		if (!string) {
			return;
		}

		view.stopEditNodeContent();
		mindmapModel.changeNodeContent(node, string);
	};

	this.go = function() {
		view.init();
	};

	function showMindMap(doc) {
		view.setZoomFactor(zoomController.DEFAULT_ZOOM);
		var dimensions = doc.dimensions;
		view.setDimensions(dimensions.x, dimensions.y);
		var map = doc.mindmap;
		view.drawMap(map);
		view.center();

		mindmapModel.selectNode(map.root);
	}

	function bind() {
		// listen to global events
		eventBus.subscribe(mindhub.Event.DOCUMENT_OPENED, function(doc, newDocument) {
			showMindMap(doc);
		});

		eventBus.subscribe(mindhub.Event.DOCUMENT_CLOSED, function(node) {
			view.positionNode(node);
		});

		eventBus.subscribe(mindhub.Event.NODE_MOVED, function(node) {
			view.positionNode(node);
		});

		eventBus.subscribe(mindhub.Event.NODE_TEXT_CONTENT_CHANGED, function(
			node) {
			view.setNodeText(node, node.getContent());

			// redraw node in case height has changed
			// TODO maybe only redraw if height has changed
			view.redrawNodeConnectors(node);
		});

		eventBus.subscribe(mindhub.Event.NODE_CREATED, function(node) {
			view.createNode(node);

			// edit node content immediately if requested
			if (node.shouldEditContent) {
				delete node.shouldEditContent;
				// open parent node when creating a new child and the other children are hidden
				var parent = node.getParent();
				if (parent.isFold) {
					var action = new mindhub.action.OpenNodeAction(parent);
					mindmapModel.executeAction(action);
				}


				// select and go into edit mode on new node
				mindmapModel.selectNode(node);
				// attach creator manually, sometimes the mouseover listener wont fire
				creator.attachToNode(node);

				view.startEditNodeContent(node);

			}
		});

		eventBus.subscribe(mindhub.Event.NODE_DELETED, function(node, parent) {
			// select parent if we are deleting a selected node or a descendant
			var selected = mindmapModel.selectedNode;
			if (node === selected || node.isDescendant(selected)) {
				mindmapModel.selectNode(parent);
			}

			// update view
			view.deleteNode(node);
			if (parent.isLeaf()) {
				view.removeFoldButton(parent);
			}
		});

		eventBus.subscribe(mindhub.Event.NODE_SELECTED, selectNode);

		eventBus.subscribe(mindhub.Event.NODE_OPENED, function(node) {
			view.openNode(node);
		});

		eventBus.subscribe(mindhub.Event.NODE_CLOSED, function(node) {
			view.closeNode(node);
		});

		eventBus.subscribe(mindhub.Event.NODE_FONT_CHANGED, function(node) {
			view.updateNode(node);
		});

		eventBus.subscribe(mindhub.Event.NODE_FONT_COLOR_PREVIEW, function(node, color) {
			view.updateFontColor(node, color);
		});

		eventBus.subscribe(mindhub.Event.NODE_BRANCH_COLOR_CHANGED, function(
			node) {
			view.updateNode(node);
		});

		eventBus.subscribe(mindhub.Event.NODE_BRANCH_COLOR_PREVIEW, function(node, color) {
			view.updateBranchColor(node, color)
		});

		eventBus.subscribe(mindhub.Event.ZOOM_CHANGED, function(zoomFactor) {
			view.setZoomFactor(zoomFactor);
			view.applyViewZoom();
			view.scaleMap();
		});
	}

	bind();
	this.init();
};