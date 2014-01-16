// namespace for Util
mindhub.Util = mindhub.Util || {};

mindhub.Util.createUUID = function() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0,
			v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
};

mindhub.Util.getId = function() {
	return mindhub.Util.createUUID();
};

mindhub.Util.randomColor = function() {
	return (function(h) {
		return "#000000".substr(0, 7 - h.length) + h;
	})((~~(Math.random() * (1 << 24))).toString(16));
};

mindhub.Util.distance = function(x, y) {
	return Math.sqrt(x * x + y * y);
};

// tests

function getSimpleMap() {
	var mm = new mindhub.MindMap();
	var root = mm.root;

	var n0 = mm.createNode();
	var n1 = mm.createNode();

	root.addChild(n0);
	root.addChild(n1);

	return mm;
}

function getDefaultTestMap() {
	var mm = new mindhub.MindMap();
	var root = mm.root;

	var n0 = mm.createNode();
	var n1 = mm.createNode();
	var n2 = mm.createNode();

	root.addChild(n0);
	root.addChild(n1);
	root.addChild(n2);

	var n10 = mm.createNode();
	var n11 = mm.createNode();

	n1.addChild(n10);
	n1.addChild(n11);

	var n20 = mm.createNode();
	var n21 = mm.createNode();
	var n22 = mm.createNode();
	var n23 = mm.createNode();

	n2.addChild(n20);
	n2.addChild(n21);
	n2.addChild(n22);
	n2.addChild(n23);

	n2.addChild(n20);
	n2.addChild(n21);
	n2.addChild(n22);
	n2.addChild(n23);

	var n100 = mm.createNode();

	n10.addChild(n100);

	var n1000 = mm.createNode();

	n100.addChild(n1000);

	return mm;
}

function getBinaryMapWithDepth(depth) {
	var mm = new mindhub.MindMap();
	var root = mm.root;

	function createTwoChildren(node, depth) {
		if (depth === 0) {
			return;
		}

		var left = mm.createNode();
		left.text.content = "Node " + left.id;
		node.addChild(left);
		createTwoChildren(left, depth - 1);

		var right = mm.createNode();
		right.text.content = "Node " + right.id;
		node.addChild(right);
		createTwoChildren(right, depth - 1);
	}

	var depth = depth || 10;
	createTwoChildren(root, depth);

	root.position = new mindhub.Point(400, 400);
	var position = 80;
	var nodes = root.children.values();

	function setPosition(node, depth, y) {
		node.position = new mindhub.Point((depth + 1) * 50, y);
		if (node.isLeaf()) {
			return;
		}

		var nodes = node.children.values();
		var left = nodes[0];
		setPosition(left, depth + 1, y - y / 2);

		var right = nodes[1];
		setPosition(right, depth + 1, y + y / 2);
	}

	setPosition(c[0], 0, -position);
	setPosition(c[1], 0, position);

	// color nodes
	c[0].branchColor = mindhub.Util.randomColor();
	c[0].forEachDescendant(function(node) {
		node.branchColor = mindhub.Util.randomColor();
	});

	c[1].branchColor = mindhub.Util.randomColor();
	c[1].forEachDescendant(function(node) {
		node.branchColor = mindhub.Util.randomColor();
	});

	return mm;
}