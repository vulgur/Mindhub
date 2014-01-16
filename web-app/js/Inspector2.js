// inspector view

mindhub.InspectorView = function() {
	var self = this;

	var $content = $("#template-inspector").tmpl();
	var $sizeDecreaseButton = $("#inspector-button-font-size-decrease", $content);
	var $sizeIncreaseButton = $("#inspector-button-font-size-increase", $content);
	var $boldCheckbox = $("#inspector-checkbox-font-bold", $content);
	var $italicCheckbox = $("#inspector-checkbox-font-italic", $content);
	var $underlineCheckbox = $("#inspector-checkbox-font-underline", $content);
	var $linethroughCheckbox = $("#inspector-checkbox-font-linethrough", $content);

	var $branchColorChildrenButton = $("#inspector-button-branch-color-children", $content);
	var branchColorPicker = $("#inspector-branch-color-picker", $content);
	var fontColorPicker = $("#inspector-font-color-picker", $content);

	var $allButtons = [
		$sizeDecreaseButton, 
		$sizeIncreaseButton, 
		// $boldCheckbox,
		// $italicCheckbox, 
		// $underlineCheckbox, 
		// $linethroughCheckbox, 
		$branchColorChildrenButton
	];
	var $allPickers = [branchColorPicker, fontColorPicker];

	this.getContent = function() {
		return $content;
	};

	this.setControlsEnabled = function(enabled) {
		var state = enabled ? "enable" : "disable";
		$allButtons.forEach(function($button) {
			$button.button(state);
		});

		$allPickers.forEach(function($picker) {
			$picker.miniColors("disabled", !enabled);
		});
	};

	this.setBoldCheckboxState = function(checked) {
		$boldCheckbox.prop("checked", checked).button("refresh");
	};

	this.setItalicCheckboxState = function(checked) {
		$italicCheckbox.prop("checked", checked).button("refresh");
	};


	this.setUnderlineCheckboxState = function(checked) {
		$underlineCheckbox.prop("checked", checked).button("refresh");
	};


	this.setLinethroughCheckboxState = function(checked) {
		$linethroughCheckbox.prop("checked", checked).button("refresh");
	};


	this.setBranchColorPickerColor = function(color) {
		branchColorPicker.miniColors("value", color);
	};

	this.setFontColorPickerColor = function(color) {
		fontColorPicker.miniColors("value", color);
	};

	this.init = function() {
		$(".buttonset", $content).buttonset();
		$branchColorChildrenButton.button();

		$sizeDecreaseButton.click(function() {
			if (self.fontSizeDecreaseButtonClicked) {
				self.fontSizeDecreaseButtonClicked();

			}
		});

		$sizeIncreaseButton.click(function() {
			if (self.fontSizeIncreaseButtonClicked) {
				self.fontSizeIncreaseButtonClicked();
			}
		});

		$boldCheckbox.click(function() {
			if (self.fontBoldCheckboxClicked) {
				var checked = $(this).prop("checked");
				self.fontBoldCheckboxClicked(checked);
			}
		});

		$italicCheckbox.click(function() {
			if (self.fontItalicCheckboxClicked) {
				var checked = $(this).prop("checked");
				self.fontItalicCheckboxClicked(checked);
			}
		});

		$underlineCheckbox.click(function() {
			if (self.fontUnderlineCheckboxClicked) {
				var checked = $(this).prop("checked");
				self.fontUnderlineCheckboxClicked(checked);
			}
		});

		$linethroughCheckbox.click(function() {
			if (self.fontLinethroughCheckboxClicked) {
				var checked = $(this).prop("checked");
				self.fontLinethroughCheckboxClicked(checked);
			}
		});

		branchColorPicker.miniColors({
			hide: function(hex) {
				if (this.attr("disabled")) {
					return;
				}
				console.log("hide branch", hex);
				if (self.branchColorPicked) {
					self.branchColorPicked(hex);
				}
			},

			move: function(hex) {
				if (self.branchColorPreview) {
					self.branchColorPreview(hex);
				}
			}
		});

		fontColorPicker.miniColors({
			hide: function(hex) {
				if (this.attr('disabled')) {
					return;
				}

				console.log("font", hex);
				if (self.fontColorPicked) {
					self.fontColorPicked(hex);
				}
			},

			move: function(hex) {
				if (self.fontColorPreview) {
					self.fontColorPreview(hex);
				}
			}
		});

		$branchColorChildrenButton.click(function() {
			if (self.branchColorChildrenButtonClicked) {
				self.branchColorChildrenButtonClicked();
			}
		});
	};
};


// inspector presenter
mindhub.InspectorPresenter = function(eventBus, mindmapModel, view) {
	var self = this;

	view.fontSizeDecreaseButtonClicked = function() {
		var action = new mindhub.action.DecreaseNodeFontSizeAction(mindmapModel.selectedNode);
		mindmapModel.executeAction(action);
	};

	view.fontSizeIncreaseButtonClicked = function() {
		var action = new mindhub.action.IncreaseNodeFontSizeAction(mindmapModel.selectedNode);
		mindmapModel.executeAction(action);
	};

	view.fontBoldCheckboxClicked = function(checked) {
		var action = new mindhub.action.SetFontWeightAction(
			mindmapModel.selectedNode, checked);
		mindmapModel.executeAction(action);
	};

	view.fontItalicCheckboxClicked = function(checked) {
		var action = new mindhub.action.SetFontStyleAction(
			mindmapModel.selectedNode, checked);
		mindmapModel.executeAction(action);
	};

	view.fontUnderlineCheckboxClicked = function(checked) {
		var action = new mindhub.action.SetFontDecorationAction(
			mindmapModel.selectedNode, checked ? "underline" : "none");
		mindmapModel.executeAction(action);
	};

	view.fontLinethroughCheckboxClicked = function(checked) {
		var action = new mindhub.action.SetFontDecorationAction(
			mindmapModel.selectedNode, checked ? "line-through" : "none");
		mindmapModel.executeAction(action);
	};

	view.branchColorPicked = function(color) {
		var action = new mindhub.action.SetBranchColorAction(mindmapModel.selectedNode, color);
		mindmapModel.executeAction(action);
	};

	view.branchColorPreview = function(color) {
		eventBus.publish(mindhub.Event.NODE_BRANCH_COLOR_PREVIEW,
			mindmapModel.selectedNode, color);
	};

	view.fontColorPicked = function(color) {
		var action = new mindhub.action.SetFontColorAction(
			mindmapModel.selectedNode, color);
		mindmapModel.executeAction(action);
	};

	view.fontColorPreview = function(color) {
		eventBus.publish(mindhub.Event.NODE_FONT_COLOR_PREVIEW,
			mindmapModel.selectedNode, color);
	};

	view.branchColorChildrenButtonClicked = function(color) {
		var action = new mindhub.action.SetChildrenBranchColorAction(mindmapModel.selectedNode);
		mindmapModel.executeAction(action);
	};

	// update view on font event
	eventBus.subscribe(mindhub.Event.NODE_FONT_CHANGED, function(node) {
		if (mindmapModel.selectedNode === node) {
			updateView(node);
		}
	});

	eventBus.subscribe(mindhub.Event.NODE_BRANCH_COLOR_CHANGED, function(node) {
		if (mindmapModel.selectedNode === node) {
			updateView(node);
		}
	});

	eventBus.subscribe(mindhub.Event.NODE_SELECTED, function(node) {
		updateView(node);
	});

	eventBus.subscribe(mindhub.Event.DOCUMENT_OPENED, function() {
		view.setControlsEnabled(true);
	});

	eventBus.subscribe(mindhub.Event.DOCUMENT_CLOSED, function() {
		view.setControlsEnabled(false);
	});

	function updateView(node) {
		var font = node.text.font;
		view.setBoldCheckboxState(font.weight === "bold");
		view.setItalicCheckboxState(font.style === "italic");
		view.setUnderlineCheckboxState(font.decoration === "underline");
		view.setLinethroughCheckboxState(font.decoration === "line-throght");
		view.setFontColorPickerColor(font.color);
		view.setBranchColorPickerColor(node.branchColor);
	}

	this.go = function() {
		view.init();
	};
};