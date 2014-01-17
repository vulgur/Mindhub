// object for Document

mindhub.Document = function() {
	this.id = mindhub.Util.createUUID();
	this.title = "New Map";
	this.mindmap = new mindhub.MindMap();
	this.dates = {
		created: new Date,
		modified: null
	};

	this.dimensions = new mindhub.Point(4000, 2000);
	this.autosave = false;
};

mindhub.Document.prototype.toJSON = function() {
	var dates = {
			created:this.dates.created.getTime()
	};
	
	if (this.dates.modified) {
		dates.modified = this.dates.modified.getTime();
	}
	
	return {
		id:this.id,
		title:this.title,
		mindmap:this.mindmap,
		dates:dates,
		dimensions:this.dimensions,
		autosave:this.autosave
	};
};
// update modified date and title for saving
mindhub.Document.prototype.prepareSave = function() {
	this.dates.modified = new Date();
	this.title = this.mindmap.getRoot().getContent();
	return this;
};

// return the created date
mindhub.Document.prototype.getCreatedDate = function() {
	return this.dates.created;
};

// get the width of the document
mindhub.Document.prototype.getWidth = function() {
	return this.dimensions.x;
};

// get the height of the document
mindhub.Document.prototype.getHeight = function() {
	return this.dimensions.y;
};

// is autosave
mindhub.Document.prototype.isAutoSave = function() {
	return this.autosave;
};

// setting for autosave
mindhub.Document.prototype.setAutoSave = function(autosave) {
	this.autosave = autosave;
};

mindhub.Document.prototype.toJSON = function() {
	var dates = {
		created: this.dates.created.getTime()
	};

	if (this.dates.modified) {
		dates.modified = this.dates.modified.getTime()
	}

	return {
		id: this.id,
		title: this.title,
		mindmap: this.mindmap,
		dates: dates,
		dimensions: this.dimensions
	};
};

mindhub.Document.prototype.serialize = function() {
	return JSON.stringify(this);
};