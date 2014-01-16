mindhub.NewDocumentView = function() {};

mindhub.NewDocumentPresenter = function(eventBus, mindmapModel, view) {
	this.go = function () {
		var doc = new mindhub.Document();
		mindmapModel.setDocument(doc);
	};
};