// base view
mindhub.CanvasView = function() {

	this.$getDrawingArea = function() {
		return $("#drawing-area");
	};

	this.$getContainer = function() {
		return $("#canvas-container");
	};

	this.scroll = function(x, y) {
		var container = this.$getContainer();
		container.scrollLeft(x).scrollTop(y);
	};

	this.center = function() {
		var container = this.$getContainer();
		var area = this.$getDrawingArea();
		var w = area.width() - container.width();
		var h = area.height() - container.height();
		this.scroll(w / 2, h / 2);
	};

	this.applyViewZoom = function() {
		var delta = this.zoomFactorDelta;
		console.log(delta);

		var container = this.$getContainer();
		var left = container.scrollLeft();
		var top = container.scrollTop();
		var cw = container.width();
		var ch = container.height();
		var x = cw / 2 + left;
		var y = ch / 2 + top;
		x *= this.zoomFactorDelta;
		y *= this.zoomFactorDelta;

		left = x - cw / 2;
		top = y - ch / 2;
		console.log(left, top);

		var area = this.$getDrawingArea();
		var dw = area.width();
		var dh = area.height();
		area.width(dw * delta).height(dh * delta);

		this.scroll(left, top);

		var backgroundSize = parseFloat(arae.css("background-size"));
		if (isNaN(backgroundSize)) {
			console.warn("Could not set background-size!!!");
		}
		area.css("background-size", backgroundSize * delta);
	};

	this.setDimensions = function(width, height) {
		width = width * this.zoomFactor;
		height = width * this.zoomFactor;
		var area = this.$getDrawingArea();
		area.width(width).height(height);
	};

	this.setZoomFactor = function(factor) {
		this.zoomFactorDelta = factor / (this.zoomFactor || 1);
		this.zoomFactor = factor;
	};
};



mindhub.DefaultCanvasView = function() {
	var self = this;
	var nodeDragging = false;
	var creator = new Creator(this);
	var contentEditor = new ContentEditor(this);
	contentEditor.commit = function(node, text) {
		if (self.nodeContentEditCommitted) {
			self.nodeContentEditCommitted(node, text);
		}
	};

	var textMetrics = mindhub.TextMetrics;
	var branchDrawer = new mindhub.CanvasBranchDrawer();
	branchDrawer.beforeDraw = function(width, height, left, top) {
		this.$canvas.attr({
			width: width,
			height: height
		}).css({
			left: left,
			top: top
		});
	};

	function makeDraggable() {
		self.$getContainer().dragscrollable({
			dragSelector: "#drawing-area, canvas.line-canvas",
			acceptPropagatedEvent: false,
			delegateMode: true,
			preventDefault: true
		});
	}

	function $getNodeCanvas(node) {
		return $("#node-canvas-" + node.id);
	}

	function $getNode(node) {
		return $("#node-" + node.id);
	}

	function $getNodeContent(node) {
		return $("#node-content-" + node.id);
	}

	function drawLineCanvas($canvas, depth, x, y, $node, $parent, color) {
		var canvas = $canvas[0];
		var ctx = canvas.getContext("2d");
		//set $canvas for beforeDraw() callback
		branchDrawer.$canvas = $canvas;
		branchDrawer.render(ctx, depth, x, y, $node, $parent, color, self.zoomFactor);
	}

	this.init = function() {
		// console.log("------init canvas view");
		makeDraggable();
		this.center();

		var $area = this.$getDrawingArea();
		$area.addClass("mindmap");

		// setup delegates
		$area.delegate("div.node-content", "mousedown", function(e) {
			var node = $(this).parent().data("node");
			if (self.nodeMouseDown) {
				self.nodeMouseDown(node);
			}
		});

		$area.delegate("div.node-content", "mouseup", function(e) {
			var node = $(this).parent().data("node");
			if (self.nodeMouseUp) {
				self.nodeMouseUp(node);
			}
		});

		$area.delegate("div.node-content", "dblclick", function(e) {
			var node = $(this).parent().data("node");
			if (self.nodeDoubleClicked) {
				self.nodeDoubleClicked(node);
			}
		});

		$area.delegate("div.node-container", "mouseover", function(e) {
			if (e.target === this) {
				var node = $(this).data("node");
				if (self.nodeMouseOver) {
					self.nodeMouseOver(node);
				}
			}
			return false;
		});

		$area.delegate("div.node-content", "mouseover", function(e) {
			if (e.target === this) {
				var node = $(this).parent().data("node");
				if (self.nodeContentMouseOver) {
					self.nodeContentMouseOver(node);
				}
			}
			return false;
		});

		this.$getContainer().bind("mousewheel", function(e, delta) {
			if (self.mouseWheeled) {
				self.mouseWheeled(delta);
			}
		});
	};

	this.clear = function() {
		var area = this.$getDrawingArea();
		area.children().remove();
		area.width(0).height(0);
	};

	this.getLineWidth = function(depth) {
		return mindhub.CanvasDrawingUtil.getLineWidth(this.zoomFactor, depth);
	};

	this.drawMap = function(map) {
		console.log("--- draw map");
		var currentTime = new Date().getTime();
		var $area = this.$getDrawingArea();

		$area.children().remove();

		var root = map.root;

		var detach = false;
		if (detach) {
			var $parent = $area.parent();
			$area.detach();
			self.createNode(root, $area);
			$area.appendTo($parent);
		} else {
			self.createNode(root, $area);
		}

		console.debug("draw map ms: ", new Date().getTime() - currentTime);
	};

	this.createNode = function(node, $parent, depth) {
		//console.log("--- create node");
		var parent = node.getParent();
		var $parent = $parent || $getNode(parent);
		var depth = depth || node.getDepth();
		var x = node.position.x;
		var y = node.position.y;

		var $node = $("<div/>", {
			id: "node-" + node.id,
			"class": "node-container"
		}).data({
			node: node
		}).css({
			"font-size": node.text.font.size
		});

		$node.appendTo($parent);

		if (node.isRoot()) {
			// console.log("--- create root node");
			var width = this.getLineWidth(depth);
			$node.css("border-bottom-width", width);
		}

		if (!node.isRoot()) {
			var branchThickness = this.getLineWidth(depth);
			var branchColor = node.branchColor;
			var bb = branchThickness + "px solid " + branchColor;

			$node.css({
				left: this.zoomFactor * x,
				top: this.zoomFactor * y,
				"border-bottom": bb
			});

			// node drag behaviour
			$node.one("mouseenter", function() {
				$node.draggable({
					handle: "div.node-content:first",
					start: function() {
						nodeDragging = true;
					},
					drag: function(e, ui) {
						var x = ui.position.left / self.zoomFactor;
						var y = ui.position.top / self.zoomFactor;
						var color = node.branchColor;
						var $canvas = $getNodeCanvas(node);

						drawLineCanvas($canvas, depth, x, y, $node, $parent, color);

						// fire dragging event
						if (self.nodeDragging) {
							self.nodeDragging();
						}
					},
					stop: function(e, ui) {
						nodeDragging = false;
						var pos = new mindhub.Point(ui.position.left / self.zoomFactor,
							ui.position.top / self.zoomFactor);
						// fire dragged event
						if (self.nodeDragged) {
							self.nodeDragged(node, pos);
						}
					}
				});
			});
		}

		// text content
		var font = node.text.font;
		var $text = $("<div/>", {
			id: "node-content-" + node.id,
			"class": "node-content node-text-behaviour",
			text: node.text.content
		}).css({
			"color": font.color,
			"font-size": this.zoomFactor * 100 + "%",
			"font-weight": font.weight,
			"font-style": font.style,
			"text-decoration": font.decoration
		}).appendTo($node);

		var metrics = textMetrics.getTextMetrics(node, this.zoomFactor);
		$text.css(metrics);

		// create fold button for parent if it hasn't one already
		var parentHasFoldButton = $parent.data("foldButton");
		var nodeOrParentIsRoot = node.isRoot() || parent.isRoot();
		if (!parentHasFoldButton && !nodeOrParentIsRoot) {
			this.createFoldButton(parent);
		}

		if (!node.isRoot()) {
			// toggle
			if (parent.foldChildren) {
				$node.hide();
			} else {
				$node.show();
			}

			// draw canvas to parent if node is not the root
			var $canvas = $("<canvas/>", {
				id: "node-canvas-" + node.id,
				"class": "line-canvas"
			});

			// position and draw branch line
			drawLineCanvas($canvas, depth, x, y, $node, $parent, node.branchColor);
			$canvas.appendTo($node);
		}

		if (node.isRoot()) {
			$node.children().andSelf().addClass("root");
		}

		// draw child nodes
		node.forEachChild(function(child) {
			self.createNode(child, $node, depth + 1);
		});
	};

	// remove a node 
	this.deleteNode = function(node) {
		var $node = $getNode(node);
		$node.remove();
	};

	this.highlightNode = function(node) {
		var $text = $getNodeContent(node);
		$text.addClass("selected");
	};

	this.unhighlightNode = function(node) {
		var $text = $getNodeContent(node);
		$text.removeClass("selected");
	};

	this.closeNode = function(node) {
		var $node = $getNode(node);
		$node.children(".node-container").hide();
		var $foldButton = $node.children(".button-fold").first();
		$foldButton.removeClass("open").addClass("closed");
	};

	this.openNode = function(node) {
		var $node = $getNode(node);
		$node.children(".node-container").show();
		var $foldButton = $node.children(".button-fold").first();
		$foldButton.removeClass("closed").addClass("open");
	};

	this.createFoldButton = function(node) {
		var pos = node.position.x > 0 ? " right" : " left";
		var status = node.isFold ? " closed" : " open";
		var $foldButton = $("<div/>", {
			"class": "button-fold no-select" + status + pos
		}).click(function(e) {
			// fire event
			if (self.foldButtonClicked) {
				self.foldButtonClicked(node);
			}

			e.preventDefault();
			return false;
		});
		// remember that foldButton was set and attach it to node
		var $node = $getNode(node);
		$node.data({
			foldButton: true
		}).append($foldButton);
	};

	this.removeFoldButton = function(node) {
		var $node = $getNode(node);
		$node.data({
			foldButton: false
		}).children(".button-fold").remove();
	};

	// goes into edit mode for a node
	this.startEditNodeContent = function(node) {
		contentEditor.edit(node, this.$getDrawingArea());
	};

	// stops the edit mode for a node
	this.stopEditNodeContent = function() {
		contentEditor.stop();
	};

	// updates the text for node
	this.setNodeText = function(node, value) {
		var $text = $getNodeContent(node);
		// metrics is a css style ?
		var metrics = textMetrics.getTextMetrics(node, this.zoomFactor, value);
		$text.css(metrics).text(value);
	};

	// get a ref to the creator tool
	this.getCreator = function() {
		return creator;
	};

	// whether a node is being dragged
	this.isNodeDragging = function() {
		return nodeDragging;
	};

	// redraw a node's branch to its parent
	function drawNodeCanvas(node, color) {
		var parent = node.getParent(node);
		var depth = node.getDepth();
		console.log("node depth:" + depth);
		var x = node.position.x;
		var y = node.position.y;
		color = color || node.branchColor;

		var $node = $getNode(node);
		var $parent = $getNode(parent);
		var $canvas = $getNodeCanvas(node);

		drawLineCanvas($canvas, depth, x, y, $node, $parent, color);
	}

	this.redrawNodeConnectors = function(node) {
		// redraw canvas to parent
		if (!node.isRoot()) {
			drawNodeCanvas(node);
		}

		// redraw all child canvases
		if (!node.isLeaf()) {
			node.forEachChild(function(child) {
				drawNodeCanvas(child);
			});
		}
	};

	this.updateBranchColor = function(node, color) {
		var $node = $getNode(node);
		$node.css("border-bottom-color", color);
		// redraw canvas to parent
		if (!node.isRoot) {
			drawNodeCanvas(node, color);
		}
	};

	this.updateFontColor = function(node, color) {
		var $text = $getNodeContent(node);
		$text.css("color", color);
	};

	this.updateNode = function(node) {
		var $node = $getNode(node);
		var $text = $getNodeContent(node);
		var font = node.text.font;
		$node.css({
			"font-size": font.size,
			"border-bottom-color": node.branchColor
		});

		var metrics = textMetrics.getTextMetrics(node, this.zoomFactor);

		$text.css({
			"color": font.color,
			"font-weight": font.weight,
			"font-style": font.style,
			"text-decoration": font.decoration
		}).css(metrics);

		this.redrawNodeConnectors(node);
	};

	this.positionNode = function(node) {
		var $node = $getNode(node);
		$node.css({
			left: this.zoomFactor * node.position.x,
			top: this.zoomFactor * node.position.y
		});

		drawNodeCanvas(node);
	};

	// redraws the whole map according to a new zoom factor
	this.scaleMap = function() {
		var zoomFactor = this.zoomFactor;
		var $root = this.$getDrawingArea().children().first();
		var root = $root.data("node");

		var width = this.getLineWidth(0);
		$root.css("border-bottom-width", width);

		// handle the root
		var $text = $getNodeContent(root);
		var metrics = textMetrics.getTextMetrics(root, this.zoomFactor);
		$text.css({
			"font-size": zoomFactor * 100 + "%",
			"left": zoomFactor * -mindhub.TextMetrics.ROOT_CONTENT_MIN_WIDTH / 2
		}).css(metrics);

		root.forEachChild(function(child) {
			scale(child, 1); // scale from the root
		});

		function scale(node, depth) {
			var $node = $getNode(node);
			// draw border and position
			var borderWidth = self.getLineWidth(depth);
			$node.css({
				left: zoomFactor * node.position.x,
				top: zoomFactor * node.position.y,
				"border-bottom-width": borderWidth
			});

			var $text = $getNodeContent(node);
			$text.css({
				"font-size": zoomFactor * 100 + "%"
			});

			var metrics = textMetrics.getTextMetrics(node, this.zoomFactor);
			$text.css(metrics);

			// redraw canvas to parent
			drawNodeCanvas(node);

			// redraw all child canvases
			if (!node.isLeaf()) {
				node.forEachChild(function(child) {
					scale(child, depth + 1);
				});
			}
		}
	};

	function ContentEditor(view) {
		var self = this;
		var attached = false;

		// input text for editing
		var $editor = $("<textarea/>", {
			id: "content-editor",
			"class": "node-text-behaviour"
		}).bind("keydown", "esc", function() {
			self.stop();
		}).bind("keydown", "return", function() {
			commitText();
		}).mousedown(function(e) {
			e.stopPropagation();
		}).blur(function() {
			commitText();
		}).bind("input", function() {
			var metrics = textMetrics.getTextMetrics(self.node, view.zoomFactor, $editor.val());
			$editor.css(metrics);
			alignBranches();
		});

		function commitText() {
			if (attached && self.commit) {
				self.commit(self.node, $editor.val());
			}
		}

		function alignBranches() {
			// slightly defer execution for better performance on slow broswers
			setTimeout(function() {
				view.redrawNodeConnectors(self.node);
			}, 1);
		}

		this.edit = function(node, $cancelArea) {
			if (attached) {
				return;
			}
			this.node = node;
			attached = true;

			// put text into span and hide
			this.$text = $getNodeContent(node);
			this.$cancelArea = $cancelArea;

			this.text = this.$text.text();

			this.$text.css({
				width: "auto",
				height: "auto"
			}).empty().addClass("edit");

			// jquery ui prevents blur() event from happening when dragging a draggable.
			// need this workaround to detect click on other draggable
			$cancelArea.bind("mousedown.editNodeContent", function(e) {
				commitText();
			});

			var metrics = textMetrics.getTextMetrics(self.node, view.zoomFactor, this.text);
			$editor.attr({
				value : this.text
			}).val(this.text).css(metrics).appendTo(this.$text).select();
		};

		// removes the editor from the node and restores the old text value
		this.stop = function() {
			if (attached) {
				attached = false;
				this.$text.removeClass("edit");
				$editor.detach();
				this.$cancelArea.unbind("mousedown.editNodeContent");
				view.setNodeText(this.node, this.text);
				alignBranches();
			}
		};
	}

	function Creator(view) {
		var self = this;
		var dragging = false;

		this.node = null;
		this.lineColor = null;

		var $wrapper = $("<div/>", {
			id: "creator-wrapper"
		}).bind("remove", function(e) {
			// detach the creator when some removed the node or opened a new map
			self.detach();
			// and avoid removing from DOM
			e.stopImmediatePropagation();

			console.debug("creator detached.");
			return false;
		});

		// red dot creator
		var $dot = $("<div/>", {
			id: "creator-dot"
		}).appendTo($wrapper);

		var $fakeNode = $("<div/>", {
			id: "creator-fakenode"
		}).appendTo($dot);

		// canvas used by the creator tool to draw new lines
		var $canvas = $("<canvas/>", {
			id: "creator-canvas",
			"class": "line-canvas"
		}).hide().appendTo($wrapper);

		// make it draggable
		$wrapper.draggable({
			revert: true,
			revertDuration: 0,
			start: function() {
				dragging = true;
				// show creator canvas
				$canvas.show();
				if (self.dragStarted) {
					self.lineColor = self.dragStarted(self.node);
				}
			},
			drag: function(e, ui) {
				// update creator canvas
				var left = ui.position.left / view.zoomFactor;
				var top = ui.position.top / view.zoomFactor;

				// set depth+1 because we are drawing the canvas for the child
				var $node = $getNode(self.node);
				drawLineCanvas($canvas, self.depth + 1, left, top, $fakeNode, $node, self.lineColor);
			},
			stop: function(e, ui) {
				dragging = false;
				// remove creator canvas, gets replaced by real canvas
				$canvas.hide();
				if (self.dragStopped) {
					var $wp = $wrapper.position();
					var $wpLeft = $wp.left / view.zoomFactor;
					var $wpTop = $wp.top / view.zoomFactor;
					var dotLeft = ui.position.left / view.zoomFactor;
					var dotTop = ui.position.top / view.zoomFactor;

					var distance = mindhub.Util.distance($wpLeft - dotLeft, $wpTop - dotTop);
					self.dragStopped(self.node, dotLeft, dotTop, distance);
				}

				// remove any positioning that the draggable might have caused
				$wrapper.css({
					left: "",
					top: ""
				});
			}
		});

		this.attachToNode = function(node) {
			if (this.node === node) {
				return;
			}
			this.node = node;

			// position the dot correctly
			$wrapper.removeClass("left right");
			if (node.position.x > 0) {
				$wrapper.addClass("right");
			} else if (node.position.x < 0) {
				$wrapper.addClass("left");
			}

			// set border on our fake node for correct ling drawing
			this.depth = node.getDepth();
			var width = view.getLineWidth(this.depth + 1);
			$fakeNode.css("border-bottom-width", width);

			var $node = $getNode(node);
			$wrapper.appendTo($node);
		};

		// removes the tool from the current node
		this.detach = function() {
			$wrapper.detach();
			this.node = null;
		};

		// returns whether the tool is currently in use being dragged
		this.isDragging = function() {
			return dragging;
		};
	}

};

// inherit from base canvas view
mindhub.DefaultCanvasView.prototype = new mindhub.CanvasView();