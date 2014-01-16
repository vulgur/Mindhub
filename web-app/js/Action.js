// namespace for action
mindhub.action = {};

// creates a new action
mindhub.action.Action = function() {

};

mindhub.action.Action.prototype = {
	// make this action un-undoable
	noUndo: function() {
		delete this.undo;
		delete this.redo;
		return this;
	},
	// don't emit an event after execution
	noEvent: function() {
		delete this.event;
		return this;
	},
	// execute this action
	execute: function() {

	},

	cancel: function() {
		this.isCancelled = true;
	}
};

// action for moving a node
mindhub.action.MoveNodeAction = function(node, position) {
	var oldPos = node.position;
	this.execute = function() {
		node.position = position;
	};

	this.event = [mindhub.Event.NODE_MOVED, node];
	this.undo = function() {
		return new mindhub.action.MoveNodeAction(node, oldPos);
	};
};
mindhub.action.MoveNodeAction.prototype = new mindhub.action.Action();

// action for deleting a node
mindhub.action.DeleteNodeAction = function(node, mindmap) {
	var parent = node.getParent();
	this.execute = function() {
		if (node.isRoot()) {
			return false;
		}
		mindmap.deleteNode(node);
	};
	this.event = [mindhub.Event.NODE_DELETED, node, parent];
	this.undo = function() {
		return new mindhub.action.CreateNodeAction(node, parent, mindmap);
	};
};
mindhub.action.DeleteNodeAction.prototype = new mindhub.action.Action();

// action for creating a node in a auto position
mindhub.action.CreateAutoPositionedNodeAction = function(parent, mindmap) {
	if (parent.isRoot()) {
		var branchColor = mindhub.Util.randomColor();

		// calculate position
		// magic formula???
		var leftOrRight = Math.random() > 0.49 ? 1 : -1;
		var topOrBottom = Math.random() > 0.49 ? 1 : -1;
		var x = leftOrRight * (100 + Math.random() * 250);
		var y = topOrBottom * (Math.random() * 250);
	} else {
		var branchColor = parent.branchColor;

		// calculate position
		var leftOrRight = parent.position.x > 0 ? 1 : -1;
		var x = leftOrRight * (150 + Math.random() * 10);

		// put into random height when child nodes are there

		if (parent.isLeaf()) {
			var max = 5, min = -5;
		} else {
			var max = 150, min = -150;
		}

		var y = Math.floor(Math.random() * (max - min + 1) + min);
	}

	var node = new mindhub.Node();
	node.branchColor = branchColor;
	node.shouldEditContent = true;
	node.position = new mindhub.Point(x, y);

	return new mindhub.action.CreateNodeAction(node, parent, mindmap);
};

// action for creating a node
mindhub.action.CreateNodeAction = function(node, parent, mindmap) {
	this.execute = function() {
		mindmap.addNode(node);
		parent.addChild(node);
	};

	this.event = [mindhub.Event.NODE_CREATED, node];
	this.undo = function() {
		return new mindhub.action.DeleteNodeAction(node, mindmap);
	};
};
mindhub.action.CreateNodeAction.prototype = new mindhub.action.Action();

// action for toggling a node folding
mindhub.action.ToggleNodeFoldingAction = function(node) {
	if (node.isFold) {
		return new mindhub.action.OpenNodeAction(node);
	} else {
		return new mindhub.action.CloseNodeAction(node);
	}
};

// action for opening node folding
mindhub.action.OpenNodeAction = function(node) {
	this.execute = function() {
		node.isFold = false;
	};
	this.event = [mindhub.Event.NODE_OPENED, node];
};
mindhub.action.OpenNodeAction.prototype = new mindhub.action.Action();

// action for closing node folding
mindhub.action.CloseNodeAction = function() {
	this.execute = function() {
		node.isFold = true;
	};
	this.event = [mindhub.Event.NODE_CLOSED, node];
};
mindhub.action.CloseNodeAction.prototype = new mindhub.action.Action();

// action for changing node shouldEditContent
mindhub.action.ChangeNodeContentAction = function(node, content) {
	var oldContent = node.getContent();

	this.execute = function() {
		if (oldContent === content) {
			return false;
		}
		node.setContent(content);
	};

	this.event = [mindhub.Event.NODE_TEXT_CONTENT_CHANGED, node];
	this.undo = function() {
		return new mindhub.action.ChangeNodeContentAction(node, oldContent);
	};
};
mindhub.action.ChangeNodeContentAction.prototype = new mindhub.action.Action();

// action for changing font size
mindhub.action.ChangeNodeFontSizeAction = function(node, step) {
	this.execute = function() {
		node.text.font.size += step;
	};

	this.event = [mindhub.Event.NODE_FONT_CHANGED, node];
	this.undo = function() {
		return new mindhub.action.ChangeNodeFontSizeAction(node, -step);
	};
};
mindhub.action.ChangeNodeFontSizeAction.prototype = new mindhub.action.Action();

// action for decreasing font size
mindhub.action.DecreaseNodeFontSizeAction = function(node) {
	return new mindhub.action.ChangeNodeFontSizeAction(node, -4);
};

// action for increasing font size
mindhub.action.InscreaseNodeFontSizeAction = function(node) {
	return new mindhub.action.ChangeNodeFontSizeAction(node, +4);
};

// action for setting font weight
mindhub.action.SetFontWeightAction = function(node, isBold) {
	this.execute = function() {
		var weight = isBold ? "bold" : "normal";
		node.text.font.weight = weight;
	};

	this.event = [mindhub.Event.NODE_FONT_CHANGED, node];
	this.undo = function() {
		return new mindhub.action.SetFontWeightAction(node, !isBold);
	};
};
mindhub.action.SetFontWeightAction.prototype = new mindhub.action.Action();


// action for setting font style
mindhub.action.SetFontStyleAction = function(node, isItalic) {
	this.execute = function() {
		var style = isItalic ? "italic" : "normal";
		node.text.font.style = style;
	};

	this.event = [mindhub.Event.NODE_FONT_CHANGED, node];
	this.undo = function() {
		return new mindhub.action.SetFontStyleAction(node, !isItalic);
	};
};
mindhub.action.SetFontStyleAction.prototype = new mindhub.action.Action();

// action for setting font decoration
mindhub.action.SetFontDecorationAction = function(node, style) {
	var oldDecoration = node.text.decoration;
	this.execute = function() {
		node.text.font.decoration = style;
	};

	this.event = [mindhub.Event.NODE_FONT_CHANGED, node];
	this.undo = function() {
		return new mindhub.action.SetFontDecorationAction(node, oldDecoration);
	};
};
mindhub.action.SetFontDecorationAction.prototype = new mindhub.action.Action();

// action for setting font color
mindhub.action.SetFontColorAction = function(node, color) {
	var oldColor = node.text.font.color;
	this.execute = function() {
		node.text.font.color = color;
	};

	this.event = [mindhub.Event.NODE_FONT_CHANGED, node];
	this.undo = function() {
		return new mindhub.action.SetFontColorAction(node, oldColor);
	};
};
mindhub.action.SetFontColorAction.prototype = new mindhub.action.Action();

// action for setting branch color
mindhub.action.SetBranchColorAction = function(node, branchColor) {
	var oldColor = branchColor;
	this.execute = function() {
		if (branchColor === node.branchColor) {
			return false;
		}
		node.branchColor = branchColor;
	};

	this.event = [mindhub.Event.NODE_BRANCH_COLOR_CHANGED, node];
	this.undo = function() {
		return new mindhub.action.SetBranchColorAction(node, oldColor);
	};
};
mindhub.action.SetBranchColorAction.prototype = new mindhub.action.Action();

// action for a group of actions
mindhub.action.CompositeAction = function() {
	this.actions = [];
};

mindhub.action.CompositeAction.prototype.addAction = function(action) {
	this.actions.push(action);
};

mindhub.action.CompositeAction.prototype.forEachAction = function(fn) {
	this.actions.forEach(fn);
};

// action for setting children branch color
mindhub.action.SetChildrenBranchColorAction = function(node) {
	mindhub.action.CompositeAction.call(this);
	var branchColor = node.branchColor;
	var self = this;

	node.forEachDescendant(function(descendant) {
		self.addAction(new mindhub.action.SetBranchColorAction(descendant, branchColor));
	});
};
mindhub.action.SetChildrenBranchColorAction.prototype = new mindhub.action.CompositeAction();