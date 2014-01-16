// This object represents the underlying mind map model 
// and provides access to the document, the mind map and the currently selected node.
// All changes to the mind map pass through this object, either through
// calling methods directly or using the executeAction() method to perform NodeActions.

mindhub.MindMapModel = function(eventBus, commandRegistry, undoController) {
	var self = this;
	this.document = null;
	this.selectedNode = null;

	this.getDocument = function() {
		return this.document;
	};

	this.setDocument = function(document) {
		this.document = document;
		if (document) {
			eventBus.publish(mindhub.Event.DOCUMENT_OPENED, document);
		} else {
			eventBus.publish(mindhub.Event.DOCUMENT_CLOSED);
		}
	};

	this.getMindMap = function() {
		if (this.document) {
			return this.document.mindmap;
		}
		return null;
	};

	this.init = function() {
		var createNodeCommand = commandRegistry.get(mindhub.CreateNodeCommand);
		createNodeCommand.setHandler(this.createNode.bind(this));

		var createSiblingNodeCommand = commandRegistry.get(mindhub.CreateSiblingNodeCommand);
		createSiblingNodeCommand.setHandler(this.createSiblingNode.bind(this));

		var deleteNodeCommand = commandRegistry.get(mindhub.DeleteNodeCommand);
		deleteNodeCommand.setHandler(this.deleteNode.bind(this));

		eventBus.subscribe(mindhub.Event.DOCUMENT_CLOSED, function() {
			createNodeCommand.setEnabled(false);
			createSiblingNodeCommand.setEnabled(false);
			deleteNodeCommand.setEnabled(false);
		});

		eventBus.subscribe(mindhub.Event.DOCUMENT_OPENED, function() {
			createNodeCommand.setEnabled(true);
			createSiblingNodeCommand.setEnabled(true);
			deleteNodeCommand.setEnabled(true);
		});
	};

	this.deleteNode = function(node) {
		if (!node) {
			node = this.selectedNode;
		}
		var map = this.getMindMap();
		var action = new mindhub.action.DeleteNodeAction(node, map);
		this.executeAction(action);
	};

	this.createNode = function(node, parent) {
		var map = this.getMindMap();
		var action = null;
		if (!(node&&parent)) {
			parent = this.selectedNode;
			action = new mindhub.action.CreateAutoPositionedNodeAction(parent, map);
		} else {
			action = new mindhub.action.CreateNodeAction(node, parent, map);
		}

		this.executeAction(action);
	};

	this.createSiblingNode = function() {
		var map = this.getMindMap();
		var selectedNode = this.selectedNode;
		var parent = selectedNode.getParent();

		if (parent === null) {
			return;
		}

		var action = new mindhub.action.CreateAutoPositionNodeAction(parent, map);
		this.executeAction(action);
	};

	this.selectNode = function(node) {
		if (node === this.selectedNode) {
			return;
		}

		var oldSelectedNode = this.selectedNode;
		this.selectedNode = node;
		eventBus.publish(mindhub.Event.NODE_SELECTED, node, oldSelectedNode);
	};

	this.changeNodeContent = function(node, content) {
		if (!node) {
			node = this.selectedNode;
		}
		var action = new mindhub.action.ChangeNodeContentAction(node, content);
		this.executeAction(action);
	};

	this.executeAction = function(action) {
		if (action instanceof mindhub.action.CompositeAction) {
			var execute = this.executeAction.bind(this);
			action.forEachAction(execute);
			return;
		}

		var executed = action.execute();

		// cancel action if false was returned
		if (executed !== undefined && !executed) {
			return false;
		}

		// publish event
		if (action.event) {
			if (!Array.isArray(action.event)) {
				action.event = [action.event];
			}
			eventBus.publish.apply(eventBus, action.event);
		}

		// register undo function if available
		if (action.undo) {
			var undoFunc = function() {
				self.executeAction(action.undo());
			};

			// register redo function
			if (action.redo) {
				var redoFunc = function() {
					self.executeAction(action.redo());
				};
			}

			undoController.addUndo(undoFunc, redoFunc);
		}
	};

	this.saveToLoacal = function() {
		var doc = this.document.prepareSave();
		var success = mindhub.LocalDocumentStorage.saveDocument(doc);
		if (success) {
			eventBus.publish(mindhub.Event.DOCUMENT_SAVED, doc);
		}
		return success;
	};

	this.init();
};
