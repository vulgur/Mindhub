// Zoom Controller controls the zoom setting

mindhub.ZoomController = function(eventBus, commandRegistry) {
	var self = this;

	this.ZOOM_STEP = 0.25;
	this.MAX_ZOOM = 3;
	this.MIN_ZOOM = 0.25;
	this.DEFAULT_ZOOM = 1;

	this.zoomFactor = this.DEFAULT_ZOOM;

	this.zoomTo = function(factor) {
		if (factor <= this.MAX_ZOOM && factor >= this.MIN_ZOOM) {
			this.zoomFactor = factor;
			eventBus.publish(mindhub.Event.ZOOM_CHANGED, factor);
		}
	};

	// zoom in by ZOOM_STEP
	this.zoomIn = function() {
		this.zoomFactor += this.ZOOM_STEP;
		if (this.zoomFactor > this.MAX_ZOOM) {
			this.zoomFactor -= this.ZOOM_STEP;
		} else {
			eventBus.publish(mindhub.Event.ZOOM_CHANGED, this.zoomFactor);
		}

		return this.zoomFactor;
	};

	// zoom out by ZOOM_STEP
	this.zoomOut = function() {
		this.zoomFactor -= this.ZOOM_STEP;
		if (this.zoomFactor < this.MIN_ZOOM) {
			this.zoomFactor += this.ZOOM_STEP;
		} else {
			eventBus.publish(mindhub.Event.ZOOM_CHANGED, this.zoomFactor);
		}
		return this.zoomFactor;
	};

	// reset zoom factor when document is closed
	eventBus.subscribe(mindhub.Event.DOCUMENT_CLOSED, function(doc) {
		self.zoomTo(self.DEFAULT_ZOOM);
	});
};