mindhub.CanvasDrawingUtil = {

	getLineWidth: function(zoomFactor, depth) {
		var width = zoomFactor * (12 - depth * 2);

		if (width < 2) {
			width = 2;
		}
		return width;
	},

	roundedRect: function roundedRect(ctx, x, y, width, height, radius) {
		ctx.beginPath();
		ctx.moveTo(x, y + radius);
		ctx.lineTo(x, y + height - radius);
		ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
		ctx.lineTo(x + width - radius, y + height);
		ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
		ctx.lineTo(x + width, y + radius);
		ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
		ctx.lineTo(x + radius, y);
		ctx.quadraticCurveTo(x, y, x, y + radius);
		ctx.stroke();
		ctx.fill();
	}
};

mindhub.CanvasBranchDrawer = function() {
	this.beforeDraw = function(width, height, left, top) {

	};

	this.render = function(ctx, depth, x, y, $node, $parent, color, zoomFactor) {
		x = x * zoomFactor;
		y = y * zoomFactor;

		var pw = $parent.width();
		var nw = $node.width();
		var pih = $parent.innerHeight();
		var nih = $node.innerHeight();

		// line is drawn from node to parent
		// draw dirction
		var leftToRight, topToBottom;

		// node overlaps with parent above or below
		var isOverlapped = false;

		// canvas attributes
		var left, top, width, height;
		var branchColor;

		// position relative to parent
		var isNodeLeft = x + nw / 2 < pw / 2;
		if (isNodeLeft) {
			var xx = Math.abs(x);
			if (xx > nw) {
				width = xx - nw + 1;
				left = nw;
				leftToRight = true;

				// branchColor = "red";
			} else {
				left = -x;
				width = nw + x;
				leftToRight = false;
				isOverlapped = true;

				// branchColor = "orange";
			}
		} else {
			if (x > pw) {
				width = x - pw + 1;
				left = pw - x;
				leftToRight = false;

				// branchColor = "green";
			} else {
				width = pw - x;
				left = 0;
				leftToRight = true;
				isOverlapped = true;

				// branchColor = "yellow";
			}
		}

		var lineWidth = mindhub.CanvasDrawingUtil.getLineWidth(zoomFactor, depth);
		var halfLineWidth = lineWidth / 2;

		// avoid zero width
		if (width < lineWidth) {
			width = lineWidth;
		}

		var nodeAbove = y + nih < pih;
		if (nodeAbove) {
			top = nih;
			height = $parent.outerHeight() - y - top;

			topToBottom = true;
		} else {
			top = pih - y;
			height = $node.outerHeight() - top;

			topToBottom = false;
		}

		// fire before draw event
		this.beforeDraw(width, height, left, top);

		// determine start and end coordinates
		var startX, startY, endX, endY;
		if (leftToRight) {
			startX = 0;
			endX = width;
		} else {
			startX = width;
			endX = 0;
		}

		// calculate difference in line width to parent node
		// and position line vertically centered to parent line
		var pLineWidth = mindhub.CanvasDrawingUtil.getLineWidth(zoomFactor, depth - 1);
		var diff = (pLineWidth - lineWidth) / 2;

		if (topToBottom) {
			startY = 0 + halfLineWidth;
			endY = height - halfLineWidth - diff;
		} else {
			startY = height - halfLineWidth;
			endY = 0 + halfLineWidth + diff;
		}

		// calculate bezier points
		if (!isOverlapped) {
			var cp2x = startX > endX ? startX / 5 : endX - (endX / 5);
			var cp2y = endY;

			var cp1x = Math.abs(startX - endX) / 2;
			var cp1y = startY;
		} else {
			// node overlaps with parent

			// take left and right a bit away so line fits fully in canvas
			if (leftToRight) {
				startX += halfLineWidth;
				endX -= halfLineWidth;
			} else {
				startX -= halfLineWidth;
				endX += halfLineWidth;
			}

			// reversed bezier for overlap
			var cp1x = startX;
			var cp1y = Math.abs(startY - endY) / 2;

			var cp2x = endX;
			var cp2y = startY > endY ? startY / 5 : endY - (endY / 5);
		}

		// draw
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = color;
		ctx.fillStyle = color;

		ctx.beginPath();
		ctx.moveTo(startX, startY);
		ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
		ctx.stroke();

		var drawControlPoints = false;
		if (drawControlPoints) {
			ctx.beginPath();
			ctx.fillStyle = "red";
			ctx.arc(cp1x, cp1y, 4, 0, Math.PI*2);
			ctx.fill();
			ctx.beginPath();
			ctx.fillStyle = "green";
			ctx.arc(cp2x, cp2y, 4, 0, Math.PI*2);
			ctx.fill();
		}
	};
};

mindhub.TextMetrics = (function() {
	var $div = $("<div/>", {
		"class":"node-text-behaviour"
	}).css({
		position:"absolute",
		visibility:"hidden",
		height:"auto",
		width:"auto"
	}).prependTo($("body"));

	return {
		ROOT_CONTENT_MIN_WIDTH:100,
		NODE_CONTENT_MIN_WIDTH:70,
		NODE_CONTENT_MAX_WIDTH:150,

		getTextMetrics:function(node, zoomFactor, text) {
			zoomFactor = zoomFactor || 1;
			text = text || node.getContent();
			var font = node.text.font;
			var minWidth = node.isRoot()? this.ROOT_CONTENT_MIN_WIDTH : this.NODE_CONTENT_MIN_WIDTH;
			var maxWidth = this.NODE_CONTENT_MAX_WIDTH;

			$div.css({
				"font-size":zoomFactor*font.size,
				"min-width":zoomFactor*minWidth,
				"max-width":zoomFactor*maxWidth,
				"font-weight":font.weight
			}).text(text);

			// add some safety pixels for firefox
			var w = $div.width() + 2;
			var h = $div.height() + 2;

			return {
				width:w,
				height:h
			};
		}
	};
})();