package mindhub

class Node {
	String id
	Node parent
	List children = []
	String content
	String branchColor
	def font = [:]
	boolean isFold
	Point position
	
	void addChild(Node node) {
		node.parent = this
		children.add(node)
	}
	
	void deleteChild(Node node) {
		node.parent = null
		children.remove(node)
	}
	
	void setContent(String str) {
		if (this.content == str) return
		this.content = str
	}
	
	boolean isLean() {
		this.children.size() == 0
	}
	
	boolean isRoot() {
		this.parent == null
	}
	
	int getDepth() {
		int depth = 0
		Node parent = this.parent
		while (parent) {
			depth++
			parent = parent.parent
		}
		depth
	}
	
	
    static constraints = {
    }
}
