function findNodeDiv(id) {
	var divId = '#node-content-' + id
	return $(divId);
}

function renderNodeDiffDiv($div, diffs) {
	$.each(diffs, function(index, diff) {

		var p = $("<p></p>");
		if (diff.type == 'ADDED') {
			p.text("Add node: " + diff.nodeContent);
		} else if (diff.type == 'MODIFIED') {
			p.text("Change content to: " + diff.nodeContent);
		} else {
			p.text("Delete this node");
		}
		p.appendTo($div);
	});
}

function renderAllDiffs(diffList) {
	$.each(diffList, function(key, value) {
		var nodeId = key;
		var diffs = value;
		var $diffDiv = $("<div class='node-container'></div>");
		var $nodeDiv = findNodeDiv(nodeId);
		var $btnDiv = $("<div class='btn-group'></div>");
		var $btn = $("<button type='button' class='btn btn-primary dropdown-toggle' data-toggle='dropdown'>Action<span class='caret'></button>")
		$btn.appendTo($btnDiv);
		var $ul = $("<ul class='dropdown-menu' role='menu'></ul>");
		$ul.append("<li>AAA</li>");
		$ul.append("<li>BBB</li>");
		$ul.append("<li>CCC</li>");
		$ul.appendTo($btnDiv);
		$btnDiv.appendTo($nodeDiv);
		// $nodeDiv.before($diffDiv);
		// renderNodeDiffDiv($diffDiv, diffs);
	});
}

function getAllDiffs() {
	var json
	$.ajax({
		url: "http://localhost:8080/Mindhub/commit/getCommitsByDocId",
		data: {
			docId: docId
		},
		type: 'POST',
		success: function(data) {
			json = data;
		},
		async: false
	});
	var obj = $.parseJSON(json);
	var diffsMap = {};
	$.each(obj, function(index, value){
		// console.log(value);
		var diff = new mindhub.Diff();
		diff.type = value.type.name;
		diff.nodeJSON = value.nodeJSON;
		diff.nodeId = value.nodeId;
		diff.nodeContent = value.nodeContent;
		diff.parentId = value.parentId;
		if (value.parentId == null) { // modified or removed
			var key = diff.nodeId;
		} else { // added
			var key = diff.parentId;
		}
		if (diffsMap[key] === undefined) {
			// console.log("diffsMap of "+diff.nodeId + " is empty.");
			diffsMap[key] = [];
		}
		diffsMap[key].push(diff);
	});
	console.log("DiffMap:");
	$.each(diffsMap,function(key, value){
		console.log(key,value);
	});
	// var diffList = fromJSON(json);
	// console.log("diffList:"+diffList);
	renderAllDiffs(diffsMap);
}

function fromJSON(json) {

}