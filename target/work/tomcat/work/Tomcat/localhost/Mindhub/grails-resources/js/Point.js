// Object for Point in MindMap

mindhub.Point = function(x, y) {
	this.x = x || 0;
	this.y = y || 0;
};

mindhub.Point.prototype.add = function(point) {
	this.x += point.x;
	this.y += point.y;
};

mindhub.Point.prototype.toString = function() {
	return "{x:" + this.x + " y:" + this.y + "}";
};

mindhub.Point.prototype.clone = function() {
	return new Point(this.x, this.y);
};