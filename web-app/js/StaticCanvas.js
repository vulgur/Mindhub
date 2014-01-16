// Render a mind map onto a single canvas object.
// The map will be drawn without its interactive elements 
// and the resulting image will be trimmed to fit the map plus a bit of padding onto it

mindhub.StaticCanvasRenderer = function() {

	var padding = 8;
	var zoomFactor = 1;
	var self = this;

	var $canvas = $("<canvas/>", {
		"class": "map"
	});

	var ctx = $canvas[0].getContext("2d");

	var branchDrawer = new mindhub.CanvasBranchDrawer();
	branchDrawer.beforeDraw = function(width, height, left, top) {
		ctx.translate(left, top);
	};

	function drawBranch(node, $parent) {
		ctx.save();
		branchDrawer.rendre(ctx, node.getDepth(), node.position.x, node.position.y,
			node, $parent, node.branchColor, zoomFactor);
		ctx.restore();
	}

	// add some infomation to each node which are needed for rendeing
	function prepareNodes(mindmap) {
		// clone tree since we modify it
		var root = mindmap.getRoot().clone();

		function addProps(node) {
			var lineWidth = mindhub.CanvasDrawingUtil.getLineWidth(zoomFactor, node.getDepth());
			var metrics = mindhub.TextMetrics.getTextMetrics(node, zoomFactor);

			var props = {
				lineWidth: lineWidth,
				textMetrics: metrics,
				width: function() {
					if (node.isRoot()) {
						return 0;
					}
					return metrics.width;
				},
				innerHeight: function() {
					return metrics.height + padding;
				},
				outerHeight: function() {
					return metrics.height + lineWidth + padding;
				}
			};

			$.extend(node, props);

			node.forEachChild(function(child) {
				addProps(child);
			});
		}

		addProps(root);

		return root;
	}

	// find the nodes which are most far away from the root
	// and calculate the actual dimensions of the mind map
	function getMindMapDimensions(root) {
		var position = root.getPosition();
		var left = 0,
			top = 0,
			right = 0,
			bottom = 0;
		var padding = 50;

		function checkDimensions(node) {
			var pos = node.getPosition();
			var tm = node.textMetrics;

			if (pos.x < left) {
				left = pos.x;
			}

			if (pos.x + tm.width > right) {
				right = pos.x + tm.width;
			}

			if (pos.y < top) {
				top = pos.y;
			}

			if (pos.y + node.outerHeight() > bottom) {
				bottom = pos.y + node.outerHeight();
			}
		}

		checkDimensions(root);
		root.forEachDescendant(function(node) {
			checkDimensions(node);
		});

		// find the longest offset to either side and use twice the length for canva width
		var horizontal = Math.max(Math.abs(right), Math.abs(left));
		var vertical = Math.max(Math.abs(bottom), Math.abs(top));

		return {
			width: 2 * horizontal + padding,
			height: 2 * vertical + padding
		};
	}

	// return the canvas image in Base64 encoding.
	// the canvas has to be rendered first
	this.getImageData = function(document) {
		renderCanvas(document);
		return $canvas[0].toDataURL("image/png");
	};

	// return a jquery object containing an img object with the map as PNG
	this.renderAsPNG = function(document) {
		var data = this.getImageData(document);

		var $img = $("<img/>", {
			src: data,
			"class": "map"
		});

		return $img;
	};

	// return the rendered canvas as a jquery object
	this.renderAsCanvas = function(document) {
		renderCanvas(document);
		return $canvas;
	};

	// render the map onto the canvas
	function renderCanvas(document) {
		var map = document.mindmap;
		var root = prepareNodes(map);
		var dimensions = getMindMapDimensions(root);

		var width = dimensions.width;
		var height = dimensions.height;
		$canvas.attr({
			width: width,
			height: height
		});

		ctx.textBaseline = "top";
		ctx.textAlign = "center";

		// fill background white
		ctx.fillStyle = "white"
		ctx.fillRect(0, 0, width, height);

		ctx.translate(width / 2, height / 2);

		// render in two steps: 1.lines 2.contents
		// contents should not be covered by lines since no z-index
		drawLines(root);
		drawContents(root);

		// draws all branches
		function drawLines(node, parent) {
			ctx.save();
			var x = node.position.x;
			var y = node.position.y;
			ctx.translate(x, y);

			// branch
			if (parent) {
				drawBranch(node, parent);
			}

			// bottom border
			if (!node.isRoot()) {
				ctx.fillStyle = node.branchColor;
				var tm = node.textMetrics;
				ctx.fillRect(0, tm.height + padding, tm.width, node.lineWidth);
			}

			node.forEachChild(function(child) {
				drawLines(child, node);
			});

			ctx.restore();
		}

		// draw all contents
		function drawContents(node) {
			ctx.save();
			var x = node.position.x;
			var y = node.position.y;
			ctx.translate(x, y);

			var tm = node.textMetrics;
			var content = node.getContext();
			var font = node.text.font;

			ctx.font = font.style + " " + font.weight + " " + font.size + "px sans-serif";

			var contentX = tm.width / 2;
			var contentY = 0;
			if (node.isRoot()) {
				contentX = 0;
				contentY = 20;

				// root box
				ctx.lineWidth = 5;
				ctx.strokeStyle = "orange";
				ctx.fillStyle = "white";
				mindhub.CanvasDrawingUtil.roundedRect(ctx,
					0 - tm.width / 2 - 4, 20 - 4, tm.width + 8, tm.height + 8, 10);
			}

			ctx.strokeStyle = font.color;
			ctx.fillStyle = font.color;

			function checkLength(str) {
				var ctm = ctx.measureText(str);
				return ctm.width <= tm.width;
			}

			// write node content
			if (checkLength(content)) {
				ctx.fillText(content, contentX, contentY);
			} else {
				// content consists of multiple lines.
				// handle the line breaking algorithm "word-wrap"
				// 1.break up string into words
				// 2.cut words that are too long into smaller pieces so they fit in a line
				// 3.construct lines: fit as many words as possible in a line
				// 4.print lines

				// step 1
				var regex = /[^ ]+ */gi;
				var words1 = content.match(regex);
				console.log("words1", words1);

				// step 2
				var words2 = [];
				words1.forEach(function(word) {
					if (!checkLength(word)) {
						var part = "";
						for (var i=0; i<word.length; i++) {
							var c = word.charAt(i);
							if (checkLength(part+c)) {
								part+=c;
								continue;
							} else {
								words2.push(part);
								part = c;
							}
						}
						words2.push(part);
					} else {
						words2.push(word);
					}
				});

				console.log("words2", words2);

				// step 3
				var wordWidth = function(str) {
					return ctx.measureText(str).width;
				};

				var lines = [];
				var line = "";
				var lineWidth = tm.width;

				// construct indivudual lines
				words2.forEach(function(word) {
					if (line === "") {
						line = word;
					} else {
						if (wordWidth(line + " " + word) > lineWidth) {
							lines.push(line);
							line = word;
						} else {
							line += " " + word;
						}
					}
				});
				lines.push(line);
				console.log("lines", lines);

				// step 4
				// print lines
				for (var j=0;j<lines.length;j++) {
					var line = lines[j];
					ctx.fillText(line, contentX, contentY + j*font.size);
				}
			}

			node.forEachChild(function(child) {
				drawContents(child);
			});

			ctx.restore();
		}
	}
};