package mindhub

class Mindmap {
	Node root
	List nodes = []
	void addNode(Node node){
		nodes.add(node)
		// TODO add all children
	}

	Node createNode() {
		Node node = new Node()
		addNode(node)
		node
	}
	void removeNode(Node node){
		Node parent = node.parent
		parent.remove(node)
		// TODO remove all children
		nodes.remove(node)
	}
    static constraints = {
    }
}
