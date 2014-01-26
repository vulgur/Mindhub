mindhub.OpenDocumentJSONView = function() {
};

mindhub.OpenDocumentJSONPresenter = function(eventBus, mindmapModel, view, id) {
	function getDocById(id) {
		var json = "";
		var url = "http://localhost:8080/Mindhub/document/getDocumentById";
		$.ajax({
			  type: 'POST',
			  url: url,
			  data: {docId:id},
			  success: function(data) {
//				  console.log("Open Doc JSON: data= " + data);
				  json = data;
			  },
			  async:false
			});

		return json;
	}

	this.go = function() {
		console.log("Open Doc JSON: docId= " + id);
		var json = getDocById(id);
		//json = json.slice(0,-4);
		// console.log("Open Doc JSON: docJSON= " + json);
		var doc = mindhub.Document.fromJSON(json);
		mindmapModel.setDocument(doc);
	};
};