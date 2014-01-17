// Object for node map

mindhub.NodeMap = function () {
	this.count = 0;
	this.nodes = {};
};

mindhub.NodeMap.prototype.getNodeById = function(id) {
	return this.nodes[id];
};

mindhub.NodeMap.prototype.add = function(node) {
	if (!this.nodes.hasOwnProperty(node.id)) {
		this.nodes[node.id] = node;
		this.count++
		return true;
	}
	return false;
};

mindhub.NodeMap.prototype.remove = function(node) {
	if (!this.nodes.hasOwnProperty(node.id)) {
		delete this.nodes[node.id];
		this.count--
		return true;
	}
	return false;
};

mindhub.NodeMap.prototype.size = function() {
	return this.count;
};

mindhub.NodeMap.prototype.each = function(callback) {
	for (var id in this.nodes) {
		callback(this.nodes[id]);
	}
};