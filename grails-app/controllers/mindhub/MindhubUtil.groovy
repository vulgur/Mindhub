package mindhub

class MindhubUtil {
	static def fromJSON(json) {
		Document document = new Document()
		// id
		document.setId(json["id"])
		// title
		document.setTitle(json["title"])
		// dates
		Date created = new Date(json["dates"]["created"])
		Date modified = new Date(json["dates"]["modified"])
		document.setCreatedDate(created)
		document.setModifiedDate(modified)
		// dimensions
		Point dimensions = new Point(x:json.dimensions.x,y:json.dimensions.y)
		document.setDimensions(dimensions)
		// mindmap
		def mmJSON = json["mindmap"]
		Mindmap mm = new Mindmap()
		// root
		def rootJSON = mmJSON["root"]
		Node root = new Node()
		root.setId(rootJSON["id"])
		root.setParent(null)
		root.setContent(rootJSON.text.content)
		root.setPosition(new Point(x:rootJSON.position.x, y:rootJSON.position.y))
		
		mm.nodes.add(root)
		// TODO font, isFold, branchColor

		// children of root
		def childrenJSON = rootJSON.children
		for (childJSON in childrenJSON) {
			Node node = new Node()
			node.setId(childJSON.id)
			node.setContent(childJSON.text.content)
			node.setParent(root)
			node.setPosition(new Point(x:childJSON.position.x, y:childJSON.position.y))
			// add children to child
			print "xxxxxx-"+childJSON.children
//			assert childJSON.children instanceof List
			addChildren(childJSON.children, node, mm)
			// add to root and mindmap
			root.addChild(node)
			mm.nodes.add(node)
		}

		mm.setRoot(root)
		document.setMindmap(mm)
		return document
	}

	static def addChildren(List json,Node parent, Mindmap mm) {
		if (json == null || json.size() == 0) {
			return
		}
		for (child in json) {
			print "yyyyyy-" + child
			Node node = new Node()
			node.setId(child.id)
			node.setContent(child.text.content)
			node.setParent(parent)
			node.setPosition(new Point(x:child.position.x, y:child.position.y))
			mm.nodes.add(node)
			print "zzzzzz-" + child.children
			if (child.children.size() !=0 ) {
				addChilren(child.children, node)
			}
		}
	}

	static def getDiff(doc1, doc2) {
		def mm1 = doc1.mindmap
		def mm2 = doc2.mindmap
		def diffs = []
		def nodes1 = mm1.nodes
		def nodes2 = mm2.nodes
		// search added nodes
		for (node in nodes2) {
			if (!nodes1.contains(node)) {
				Diff diff = new Diff()
				diff.node = node;
				diff.type = Diff.DiffType.ADDED
				diffs.add(diff);
			}
		}
		// search removed nodes
		for (node in nodes1) {
			if (!nodes2.contains(node)) {
				Diff diff = new Diff()
				diff.node = node;
				diff.type = Diff.DiffType.REMOVED
				diffs.add(diff);
			}
		}
		return diffs
	}	
}
