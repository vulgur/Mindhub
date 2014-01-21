// Object for Node in MindMap

mindhub.Node = function() {
	this.id = mindhub.Util.getId();
	this.parent = null;
	this.children = new mindhub.NodeMap();
	this.text = {
		content: "New Idea",
		font: {
			style: "normal",
			weight: "normal",
			color: "#000000",
			size: 15,
			decoration: "none"
		}
	};
	this.branchColor = "#000000";
	this.isFold = false;
	this.position = new mindhub.Point();
};

mindhub.Node.prototype.addChild = function(node) {
	node.parent = this;
	this.children.add(node);
};

mindhub.Node.prototype.deleteChild = function(node) {
	node.parent = null;
	this.children.remove(node);
};

mindhub.Node.prototype.setContent = function(newContent) {
	if (this.text.content === newContent) return;
	this.text.content = newContent;
};

mindhub.Node.prototype.getContent = function() {
	return this.text.content;
};

mindhub.Node.prototype.isLeaf = function() {
	return this.children.size() === 0;
};

mindhub.Node.prototype.isRoot = function() {
	return this.parent === null;
};

mindhub.Node.prototype.getParent = function() {
	return this.parent;
};

// get the position of the node relative to the root
mindhub.Node.prototype.getPosition = function() {
	var pos = this.position.clone();
	var parentNode = this.parent;
	while (parentNode) {
		pos.add(parentNode.position);
		parentNode = parentNode.parent;
	}
	return pos;
};

// get the depth of the node. root's depth is 0.
mindhub.Node.prototype.getDepth = function() {
	var depth = 0;
	var parentNode = this.parent;
	while (parentNode) {
		depth++;
		parentNode = parentNode.parent;
	}
	return depth;
};

mindhub.Node.prototype.getChildren = function(recursive) {
	var nodes = [];

	this.children.each(function(node) {
		if (recursive) {
			var childNodes = node.getChildren(true);
			childNodes.forEach(function(child) {
				nodes.push(child);
			});
		}
		nodes.push(node);
	});
	return nodes;
};

mindhub.Node.prototype.forEachChild = function(func) {
	this.children.each(func);
};

mindhub.Node.prototype.forEachDescendant = function(func) {
	this.children.each(function(node) {
		func(node);
		node.forEachDescendant(func);
	});
};

mindhub.Node.prototype.toJSON = function() {
	var self = this;
	var children = (function() {
		var result = [];
		self.forEachChild(function(child) {
			result.push(child.toJSON());
		});
		return result;
	})();

	var obj = {
		id: this.id,
		parentId: this.parent ? this.parentId : null,
		text: this.text,
		position: this.position,
		foldChildren: this.isFold,
		branchColor: this.branchColor,
		children: children
	};

	return obj;
};

mindhub.Node.prototype.serialize = function() {
	return JSON.stringify(this);
};

mindhub.Node.fromJSON = function(json) {
	return mindhub.Node.fromObject(JSON.parse(json));
};

mindhub.Node.fromObject = function(obj) {
	var node = new mindhub.Node();
	node.id = obj.id;
	node.text = obj.text;
	node.position = mindhub.Point.fromObject(obj.position);
	node.isFold = obj.isFold;
	node.branchColor = obj.branchColor;

	obj.children.forEach(function(child){
		var childNode = mindhub.Node.fromObject(child);
		node.addChild(childNode);
	});

	return node;
};