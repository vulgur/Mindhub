// Events in the event bus

// namespace for Events
mindhub.Event = {
	DOCUMENT_OPENED: "DocumentOpenedEvent",
	DOCUMENT_SAVED: "DocumentSavedEvent",
	DOCUMENT_CLOSED: "DocumentClosedEvent",

	NODE_SELECTED: "NodeSelectedEvent",
	NODE_DESELECTED : "NodeDeselectedEvent",
	NODE_MOVED: "NodeMovedEvent",
	NODE_TEXT_CONTENT_CHANGED: "NodeTextContentChangedEvent",
	NODE_FONT_CHANGED: "NodeFontChangedEvent",
	NODE_FONT_COLOR_PREVIEW: "NodeFontColorPreviewEvent",
	NODE_BRANCH_COLOR_CHANGED: "NodeBranchColorChangedEvent",
	NODE_BRANCH_COLOR_PREVIEW: "NodeBranchColorPreviewEvent",
	NODE_CREATED: "NodeCreaedEvent",
	NODE_DELETED: "NodeDeletedEvent",
	NODE_OPENED: "NodeOpenedEvent",
	NODE_CLOSED: "NodeClosedEvent",

	ZOOM_CHANGED: "ZoomChangedEvent",

	NOTIFICATION_INFO: "NotificationInfoEvent",
	NOTIFICATION_WARN: "NotificationWarnEvent",
	NOTIFICATION_ERROR: "NotificationErrorEvent"
};

mindhub.EventBus = EventEmitter;

if (mindhub.DEBUG) {
	// overwrite publish function and display amount of listeners
	var old = mindhub.EventBus.prototype.emit;
	mindhub.EventBus.prototype.publish = function(type) {
		var len = this.listeners(type).length;
		console.log("EventBus > publish: " + type, "(listeners: " + len + ")");

		old.apply(this, arguments);
	};
}