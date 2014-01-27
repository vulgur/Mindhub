mindhub.CommitDocumentView = function() {
	var self = this;
	var $commitButton = $('#commit').click(
		function(){
			if(self.commitButtonClicked){
				self.commitButtonClicked();
			}
		});
};

mindhub.CommitDocumentPresenter = function(eventBus, mindmapModel, view) {
	view.commitButtonClicked = function (){
		alert("commitButtonClicked");
	};

  this.go = function() {
    // console.log(mindmapModel.getMindMap().getRoot().getContent() + ".json");
    var doc = mindmapModel.getDocument();
    var json = doc.prepareSave().serialize();
    // console.log(json);

    // $.ajax({
    //     type: 'POST',
    //     url: "http://localhost:8080/Mindhub/documentJSON/saveDoc",
    //     data: {data:json,type:'commit'},
    //     success: function(data) {
    //       alert(data);
    //     }
    //   });
  };
};