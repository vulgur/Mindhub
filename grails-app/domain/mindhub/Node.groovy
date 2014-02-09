package mindhub

import org.springframework.aop.aspectj.RuntimeTestWalker.ThisInstanceOfResidueTestVisitor;

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
	
	boolean isLeaf() {
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
	
	String getChildrenJSON() {
//		if (this.children == null || this.children.size() == 0) {
//			return "[]"
//		}
		StringBuffer sb = new StringBuffer()
		for(c in this.children) {
			sb << c.toJSON() << ","
		}
		if (sb.length() > 1) {
			sb = sb.deleteCharAt(sb.length()-1)
		}
		return sb.toString()
	}
	String getFontJSON() {
		StringBuffer sb = new StringBuffer()
		sb << "{"
		sb << "\"style\":\"normal\"" << ","
		sb << "\"weight\":\"normal\"" << ","
		sb << "\"decoration\":\"none\""	<< ","
		sb << "\"size\":\"15\"" << ","
		sb << "\"color\":\"#000000\""
		sb << "}"
		return sb.toString()
	}
	String getTextJSON() {
		StringBuffer sb = new StringBuffer()
		sb << "{"
		sb << "\"content\":\"" << this.content << "\","
		sb << "\"font\":" + getFontJSON() 
		sb << "}"
		return sb.toString()
	}
	
	String getPositionJSON() {
		StringBuffer sb = new StringBuffer()
		sb << "{"
		sb << "\"x\":\"" << this.posX << "\","
		sb << "\"y\":\"" << this.posY << "\""
		sb << "}"
		return sb.toString()
	}
	
	String getParentId() {
		if (this.parent == null) return "null"
		else return this.parent.id
	}
	public String toJSON() {
		StringBuffer sb = new StringBuffer()
		sb << "{"
		sb << "\"id\":\"" << this.id << "\","
		sb << "\"parentId\":\"" << getParentId() << "\","
		sb << "\"text\":" << getTextJSON() << ","
		sb << "\"position\":" << getPositionJSON() <<","
		sb << "\"isFold\":\"" << this.isFold << "\","
		sb << "\"branchColor\":\"" << this.branchColor << "\","
		sb << "\"children\":[" << getChildrenJSON() << "]" 
		sb << "}"
		return sb.toString()
	}
    static constraints = {
    }
}
