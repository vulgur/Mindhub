// object for UndoManager

function UndoManager(maxStackSize) {
	this.maxStackSize = maxStackSize || 64;

	var State = {
		UNDO: "undo",
		REDO: "redo"
	};

	var self = this;
	var undoStack = new UndoManager.CircularStack(this.maxStackSize);
	var redoStack = new UndoManager.CircularStack(this.maxStackSize);
	var undoContext = false;
	var currentAction = null;
	var currentState = null;

	var onStateChange = function() {
		if (self.stateChanged) {
			self.stateChanged();
		}
	};

	var callAction = function(action) {
		currentAction = action;
		undoContext = true;
		switch (currentState) {
			case State.UNDO:
				action.undo();
				break;
			case State.REDO:
				action.redo();
				break;
		}
		undoContext = false;
	};

	this.addUndo = function(undoFunc, redoFunc) {
		if (undoContext) {
			if (currentAction.redo == null && currentState == State.UNDO) {
				currentAction.redo = undoFunc;
			}
		} else {
			// store the functions as an action
			var action = {
				undo: undoFunc,
				redo: redoFunc
			};
			undoStack.push(action);
			// clear redo stack
			redoStack.clear();

			onStateChange();
		}
	};

	// redo the last action
	this.redo = function() {
		if (this.canRedo()) {
			currentState = State.REDO;
			var action = redoStack.pop();
			callAction(action);

			if (action.undo) {
				undoStack.push(action);
			}

			onStateChange();
		}
	};

	// return true if undo is possible, otherwise false
	this.canUndo = function() {
		return !undoStack.isEmpty();
	};

	// return true if redo is possible, otherwise false
	this.canRedo = function() {
		return !redoStack.isEmpty();
	};

	// reset this instance of the undo manager
	this.reset = function() {
		undoStack.clear();
		redoStack.clear();
		undoContext = false;
		currentState = null;
		currentAction = null;

		onStateChange();
	};

	// Event that is fired when undo or redo state changes
	this.stateChanged = function() {

	};
}

UndoManager.CircularStack = function (maxSize) {
	this.maxSize = maxSize || 32;
	this.buffer = [];
	this.nextPointer = 0;
};

UndoManager.CircularStack.prototype.push = function (item) {
	this.buffer[this.nextPointer] = item;
	this.nextPointer = (this.nextPointer+1) % this.maxSize;
};

UndoManager.CircularStack.prototype.isEmpty = function(item) {
	if (this.buffer.length === 0) {
		return true;
	}

	var prevPointer = this.getPrevPointer();
	if (prevPointer === null) {
		return true;
	} else {
		return this.buffer[prevPointer] === null;
	}
};

UndoManager.CircularStack.prototype.getPrevPointer = function() {
	if (this.nextPointer > 0) {
		return this.nextPointer -1;
	} else {
		if (this.buffer.length < this.maxSize) {
			return null;
		} else {
			return this.maxSize - 1;
		}
	}
};

UndoManager.CircularStack.prototype.clear = function() {
	this.buffer.length = 0;
	this.nextPointer = 0;
};

UndoManager.CircularStack.prototype.pop = function() {
	if (this.isEmpty()) {
		return null;
	}

	var prevPointer = this.getPrevPointer();
	var item = this.buffer[prevPointer];
	this.buffer[prevPointer] = null;
	this.nextPointer = prevPointer;

	return item;
};

UndoManager.CircularStack.prototype.peek = function() {
	if (this.isEmpty()) {
		return null;
	}
	return this.buffer[this.getPrevPointer()];
};
