// Object for MindMap

mindhub.MindMap = function(root) {
	this.nodeMap = new mindhub.NodeMap();
	if (root) {
		this.root = root;
	} else {
		this.root = new mindhub.Node();
		this.root.text.font.size = "20";
		this.root.text.font.weight = "bold";
		this.root.text.content = "Great Idea!";
	}
	this.addNode(this.root);
};

mindhub.MindMap.prototype.addNode = function(node) {
	this.nodeMap.add(node);
	// TODO add all children
	var self = this;
	node.forEachDescendant(function(descendant){
		self.nodeMap.add(descendant);
	});
};

mindhub.MindMap.prototype.deleteNode = function(node) {
	var parent = node.parent;
	parent.deleteChild(node);
	this.nodeMap.remove(node);
};

mindhub.MindMap.prototype.getRoot = function() {
	return this.root;
};

mindhub.MindMap.prototype.createNode = function() {
	var node = new mindhub.Node();
	this.addNode(node);
	return node;
};

mindhub.MindMap.prototype.removeNode = function(node) {
	var parent = node.parent;
	parent.removeChild(node);

	var self = this;
	node.forEachDescendant(function(descendant) {
		self.nodeMap.remove(descendant);
	});
	this.nodeMap.remove(node);
};

mindhub.MindMap.prototype.toJSON = function() {
	var obj = {
		root:this.root
	};
	return obj;
};

mindhub.MindMap.prototype.serialize = function() {
	return JSON.stringify(this);
};