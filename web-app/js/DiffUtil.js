function findNodeDiv(id) {
	var divId = '#node-content-' + id
	return $(divId);
}

function renderNodeDiffDiv($ul, diffs, mindmapModel) {

	$.each(diffs, function(index, diff) {
		var node = mindmapModel.getMindMap().nodeMap.getNodeById(diff.nodeId);
		var $link = $("<a></a>");
		if (diff.type == 'ADDED') {
			$link.html("Add node: " + diff.nodeContent);
			$link.click(function() {
				console.log(diff.nodeJSON);
				var obj = $.parseJSON(diff.nodeJSON);

				var addedNode = mindhub.Node.fromObject(obj);
				var parent = mindmapModel.getMindMap().nodeMap.getNodeById(diff.parentId);
				mindmapModel.createNode(addedNode, parent);
			});
		} else if (diff.type == 'MODIFIED') {
			$link.html("Change to: " + diff.nodeContent);
			$link.click(function() {
				mindmapModel.changeNodeContent(node, diff.nodeContent);
			});
		} else {
			$link.html("Delete this node");
			$link.click(function() {
				mindmapModel.deleteNode(node);
			});
		}
		$link.append("<br/>");
		$link.appendTo($ul);
	});
}

function renderAllDiffs(diffList, mindmapModel) {
	$.each(diffList, function(key, value) {
		var nodeId = key;
		var diffs = value;
		var $diffDiv = $("<div class='node-container'></div>");
		var $nodeDiv = findNodeDiv(nodeId);
		var $btnDiv = $("<div class='btn-group'></div>");
		var $btn = $("<button type='button' class='btn btn-primary dropdown-toggle' data-toggle='dropdown'>Diffs<span class='caret'></button>")
		$btn.appendTo($btnDiv);
		var $ul = $("<ul class='dropdown-menu' role='menu'></ul>");
		renderNodeDiffDiv($ul, diffs, mindmapModel);
		$ul.appendTo($btnDiv);
		$btnDiv.appendTo($nodeDiv);
		// $nodeDiv.before($diffDiv);

	});
}

function getAllDiffs(mindmapModel) {
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
	$.each(obj, function(index, value) {
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
	$.each(diffsMap, function(key, value) {
		console.log(key, value);
	});
	// var diffList = fromJSON(json);
	// console.log("diffList:"+diffList);
	renderAllDiffs(diffsMap, mindmapModel);
}

function fromJSON(json) {

}