mindhub.StatusBarView = function () {
	var self = this;
	var $statusbar = $("#statusbar");

	this.init = function() {};

	this.createButton = function(id, text) {
		return $("<button/>", {
			id : "statusbar-button-" + id
		}).button({
			label:text
		}).click(function() {
			if (self.buttonClicked) {
				self.buttonClicked(id);
			}
		}).prependTo($statusbar.find(".buttons"));
	};

	this.getContent = function() {
		return $statusbar;
	};
};

mindhub.StatusBarPresenter = function(eventBus, view) {
	var buttonCounter = 0;
	var buttonIdPanelMap = {};
	var statusController = new mindhub.StatusNotificationController(eventBus, view.getContent());

	view.buttonClicked = function(id) {
		buttonIdPanelMap[id].toggle();
	};

	this.go = function() {
		view.init();
	};

	this.addEntry = function(panel) {
		var id = buttonCounter++;
		var $button = view.createButton(id, panel.caption);
		panel.setHideTarget($button);
		buttonIdPanelMap[id] = panel;
	};
};

mindhub.StatusNotificationController = function(eventBus, view) {
	var $anchor = $("<div class='notification-anchor' />").css({
		position:"absolute",
		right:20
	}).appendTo(view);

	eventBus.subscribe(mindhub.Event.DOCUMENT_SAVED, function() {
		var n = new mindhub.Notification($anchor, {
			position:"topRight",
			expires:2500,
			content:"Mind map saved"
		});
	});

	eventBus.subscribe(mindhub.Event.NOTIFICATION_INFO, function(msg) {
		var n = new mindhub.Notification($anchor, {
			position:"topRight",
			content:msg,
			expires:2500,
			type:"info"
		});
	});

	eventBus.subscribe(mindhub.Event.NOTIFICATION_WARN, function(msg) {
		var n = new mindhub.Notification($anchor, {
			position:"topRight",
			title:"Warning",
			content:msg,
			expires:3000,
			type:"warn"
		});
	});

	eventBus.subscribe(mindhub.Event.NOTIFICATION_ERROR, function(msg) {
		var n = new mindhub.Notification($anchor, {
			position:"topRight",
			expires:3500,
			title:"Error",
			content:msg,
			type:"error"
		});
	});
}