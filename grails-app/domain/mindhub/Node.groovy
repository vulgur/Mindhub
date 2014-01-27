package mindhub

class Node implements Comparable {
//	static belongsTo = [diff:Diff]
//	static hasOne = [parent:Node]
//	static hasMany = [children:Node]
	String id
	Node parent
	
	List children = []
	String content
	String branchColor
	def font = [:]
	boolean isFold
//	Point position
	float posX
	float posY
	
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
	
	int compareTo(obj) {
		if (this.id.equals(obj.id) && this.content.equals(obj.content)) return 0 // same id and content 
		else if (this.id.equals(obj.id)) return 1 // same id
		else return -1 // different node
	}
    static constraints = {
    }
}
