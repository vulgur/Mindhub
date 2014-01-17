// FloatPanelFactory. This factory object can create new instances of mindmaps.
// FloatPanel is constrained inside the container.

mindhub.FloatPanelFactory = function(container) {
	var $container = container.getContent();
	var dialogs = [];
	var paddingRight = 15;
	var paddingTop = 5;

	function setPosition(dialog) {
		container.subscribe(mindhub.CanvasContainer.Event.RESIZED, function() {
			dialogs.forEach(function(dialog) {
				if (dialog.visible) {
					dialog.ensurePosition();
				}
			});
		});

		var cw = $container.outerWidth();
		var ct = $container.offset().top;
		var dw = dialog.width();
		var dh = dialog.height();
		var heightOffset = dialogs.reduce(function(memo, dialog) {
			return memo + dialog.height() + paddingTop;
		}, 0);

		dialog.setPosition(cw - dw - paddingRight, ct + paddingTop + heightOffset);
	}

	this.create = function(title, $content) {
		var dialog = new mindhub.FloatPanel(title, $container, $content);
		setPosition(dialog);
		dialogs.push(dialog);
		return dialog;
	};
};

mindhub.FloatPanel = function(caption, $container, $content) {
	var self = this;
	var animating = false;

	this.caption = caption;
	this.visible = false;
	this.animationDuration = 400;

	this.setContent = function($content) {
		this.clearContent();
		$("div.ui-dialog-content", this.$widget).append($content);
	};

	this.clearContent = function() {
		$("div.ui-dialog-content", this.$widget).children().detach();
	};

	this.$widget = (function() {
		var $panel = $("#template-float-panel").tmpl({
			title: caption
		});

		// hide button
		$panel.find(".ui-dialog-titlebar-close").click(function() {
			self.hide();
		});

		// make draggable, hide, append to container
		$panel.draggable({
			containment: "parent",
			handle: "div.ui-dialog-titlebar",
			opacity: 0.75
		}).hide().appendTo($container);

		return $panel;
	})();

	// hide the panel
	this.hide = function() {
		if (!animating && this.visible) {
			this.visible = false;
			this.$widget.fadeOut(this.animationDuration * 1.5);

			// show transfer effect if hide target is set
			if (this.$hideTarget) {
				this.transfer(this.$widget, this.$hideTarget);
			}
		}
	};

	// show the panel
	this.show = function() {
		if (!animating && !this.visible) {
			this.visible = true;
			this.$widget.fadeIn(this.animationDuration * 1.5);

			// show transfer effect if hide target is set
			if (this.$hideTarget) {
				this.transfer(this.$hideTarget, this.$widget);
			}
		}
	};

	// show or hide the panel
	this.toggle = function() {
		if (this.visible) {
			this.hide();
		} else {
			this.show();
		}
	};

	// show a transfer effect
	this.transfer = function($from, $to) {
		animating = true;
		var endPosition = $to.offset();
		var animation = {
			top: endPosition.top,
			left: endPosition.left,
			height: $to.innerHeight(),
			width: $to.innerWidth()
		};
		var startPosition = $from.offset();
		var transfer = $(
			'<div class="ui-effects-transfer"></div>').appendTo(document.body).css({
			top: startPosition.top,
			left: startPosition.left,
			height: $from.innerHeight(),
			width: $from.innerWidth(),
			position: 'absolute'
		}).animate(animation, this.animationDuration, "linear", function() {
			transfer.remove();
			animating = false;
		});
	};

	this.width = function() {
		return this.$widget.outerWidth();
	};

	this.height = function() {
		return this.$widget.outerHeight();
	};

	this.offset = function() {
		return this.$widget.offset();
	};

	this.setPosition = function(x, y) {
		this.$widget.offset({
			left: x,
			top: y
		});
	};

	this.ensurePosition = function() {
		var cw = $container.outerWidth();
		var ch = $container.outerHeight();
		var col = $container.offset().left;
		var cot = $container.offset().top;
		var dw = this.width();
		var dh = this.height();
		var dol = this.offset().left;
		var dot = this.offset().top;

		// window width is too small for current dialog position but bigger than dialog width
		if (cw + col < dw + dol && cw >= dw) {
			this.setPosition(cw + col - dw, dot);
		}

		// window height is too small for current dialog position but bigger than dialog height
		if (ch + cot < dh + dot && ch >= dh) {
			this.setPosition(dol, ch + cot - dh);
		}
	};

	this.setHideTarget = function($target) {
		this.$hideTarget = $target;
	};
};