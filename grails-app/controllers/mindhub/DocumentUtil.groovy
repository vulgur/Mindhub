package mindhub

import grails.converters.JSON
import groovy.json.JsonSlurper

class DocumentUtil {
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
		//		document.setDimensions(dimensions)
		document.setX(dimensions.x)
		document.setY(dimensions.y)
		// owner
		String ownerName = json["owner"]
		User owner = User.findWhere(username:ownerName);
		assert (owner)
		document.setOwner(owner)
		// origin doc id
		document.setOriginDocId(json["originDocId"])
		// mindmap
		def mmJSON = json["mindmap"]
		Mindmap mm = new Mindmap()
		// root
		def rootJSON = mmJSON["root"]
		Node root = new Node()
		root.setId(rootJSON["id"])
		root.setParent(null)
		root.setContent(rootJSON.text.content)
		root.setBranchColor(rootJSON.branchColor)
		root.setPosX(rootJSON.position.x)
		root.setPosY(rootJSON.position.y)
//		print "~~~~~~~text font~~~~~~~"
//		print rootJSON.text.font
		root.font.put("style",rootJSON.text.font.style)
		root.font.put("weight",rootJSON.text.font.weight)
		root.font.put("decoration",rootJSON.text.font.decoration)
		root.font.put("size",rootJSON.text.font.size)
		root.font.put("color",rootJSON.text.font.color)
		mm.nodes.add(root)

		// children of root
		def childrenJSON = rootJSON.children
		//		for (childJSON in childrenJSON) {
		//			Node node = new Node()
		//			node.setId(childJSON.id)
		//			node.setContent(childJSON.text.content)
		//			node.setParent(root)
		//			//			node.setPosition(new Point(x:childJSON.position.x, y:childJSON.position.y))
		//			node.setBranchColor(childJSON.branchColor)
		//			node.setPosX(childJSON.position.x)
		//			node.setPosY(childJSON.position.y)
		//			// add children to child
		//			//			print "xxxxxx-"+childJSON.children
		//			//			assert childJSON.children instanceof List
		//			addChildren(childJSON.children, node, mm)
		//			// add to root and mindmap
		//			root.addChild(node)
		//			mm.nodes.add(node)
		//		}
		addChildren(childrenJSON, root, mm);

		mm.setRoot(root)
		document.setMindmap(mm)
		return document
	}

	static def addChildren(json,Node parent, Mindmap mm) {
		if (json == null || json.size() == 0) {
			return
		}
		for (child in json) {
			Node node = new Node()
			node.setId(child.id)
			node.setContent(child.text.content)
			node.setParent(parent)
			node.setBranchColor(child.branchColor)
			node.setPosX(child.position.x.toFloat())
			node.setPosY(child.position.y.toFloat())
			node.font.put("style",child.text.font.style)
			node.font.put("weight",child.text.font.weight)
			node.font.put("decoration",child.text.font.decoration)
			node.font.put("size",child.text.font.size)
			node.font.put("color",child.text.font.color)
			parent.children.add(node)
			mm.nodes.add(node)
			if (child.children.size() !=0 ) {
				addChildren(child.children, node, mm)
			}
		}
	}

	static def getDiffList(origin, modified) {
		def mm1 = origin.mindmap
		def mm2 = modified.mindmap
		def diffs = []
		def nodes1 = mm1.nodes
		def nodes2 = mm2.nodes
		def addedNodes = []
		def modifiedNodes = []
		def deletedNodes = []
		// search added and modified nodes
		for (node2 in nodes2) {
			boolean flag = false
			for (node1 in nodes1) {
				if (compareNodes(node1, node2)==1){ // same id and different content
					//					Diff diff = new Diff()
					//					diff.nodeId = node2.id
					//					diff.nodeContent = node2.content
					//					diff.parentId = node2.parent.id
					//					diff.type = Diff.DiffType.MODIFIED
					//					diffs.add(diff)
					modifiedNodes.add(node2)
					flag = true
					break
				}
				else if (compareNodes(node1, node2) == 0) {
					flag = true
				}
			}
			if (flag == false) {
				//				Diff diff = new Diff()
				//				diff.nodeId = node2.id
				//				diff.nodeContent = node2.content
				//				diff.parentId = node2.parent.id
				//				diff.type = Diff.DiffType.ADDED
				//				diffs.add(diff)
				addedNodes.add(node2)
			}
		}
		// search removed nodes
		for (node1 in nodes1) {
			boolean flag = false
			for (node2 in nodes2) {
				if (compareNodes(node1,node2) != -1) {
					flag = true
				}
			}
			if (flag == false) {
				//				Diff diff = new Diff()
				//				diff.nodeId = node1.id
				//				diff.nodeContent = node1.content
				//				diff.parentId = node1.parent.id
				//				diff.type = Diff.DiffType.REMOVED
				//				diffs.add(diff)
				deletedNodes.add(node1)
			}
		}
		def addedRoots = getRoots(addedNodes)
		def deletedRoots = getRoots(deletedNodes)
		// add added nodes to diffs
		for (node in addedRoots) {
			Diff diff = new Diff()
			diff.type = Diff.DiffType.ADDED
			diff.nodeJSON = node.toJSON()
			diff.nodeId = node.id
			diff.nodeContent = node.content
			diff.parentId = node.parent.id
			diffs.add(diff)
		}
		// add removed nodes to diffs
		for (node in deletedRoots) {
			Diff diff = new Diff()
			diff.type = Diff.DiffType.REMOVED
			diff.nodeJSON = node.toJSON()
			diff.nodeId = node.id
			diff.nodeContent = node.content
//			diff.parentId = node.parent.id
			diffs.add(diff)
		}
		// add modified nodes to diffs
		for (node in modifiedNodes) {
			Diff diff = new Diff()
			diff.type = Diff.DiffType.MODIFIED
			diff.nodeJSON = node.toJSON()
			diff.nodeId = node.id
			diff.nodeContent = node.content
			diffs.add(diff)
		}
		return diffs
	}
	static void printRoots(roots) {
		print "********ROOTS********"
		for (root in roots) {
			print "root="+ root.content
			print "children size="+root.children.size()
			print root.toJSON()
		}
	}
	static void printDiffs(diffs) {
		print "-------DIFFS------"
		for (d in diffs) {
			print "*******"
			print d.type
			print d.nodeId
			print d.nodeContent
			print d.parentId
		}
	}
	String getNodeById(nodes, key) {
		for (node in nodes) {
			if (node.id == key) return node
		}
	}
	static void printNode(node) {
		print "-------"
		print node.id
		print node.content
	}
	static void printDocument(document) {
		print document.id
		print document.title
		print document.createdDate
		print document.modifiedDate
		print document.mindmap.root.id
		print document.mindmap.root.content
		print document.mindmap.root.children.size()
		print document.owner.username
		print "nodes count:" + document.mindmap.nodes.size()
	}

	static def isOriginDocument(docId) {
		def doc = DocumentJSON.findWhere(docId:docId)
		if (doc.origin) return false
		else return true
	}

	static int compareNodes(node1, node2) {
		//		print "^^^^^^^^"
		//		print "node1"
		//		printNode(node1)
		//		print "node2"
		//		printNode(node2)
		int result
		if ((node1.id==node2.id) && (node1.content==node2.content)){
			result = 0
		} else if (node1.id==node2.id) {
			result = 1
		} else {
			result = -1
		}
		//		print "compare result="+result
		return result
	}

	static def getRoots(nodes) {
		def map = [:]
		//		def roots = []
		for (node in nodes) {
			map.put(node.id, false)
		}
		def roots = []
		for (node in nodes) {
			if (map[node.parent.id] == null) {
				//				map[node.parent.id] = true
				roots.add(node)
			}
		}
		return roots
	}

	//	static String getNodeJSON(Node node) {
	//		StringBuffer sb = new StringBuffer()
	////		def result = [node:node]
	//		JSON.use('deep')
	//		def converter = node as JSON
	//		return converter.toString()
	//	}
}
