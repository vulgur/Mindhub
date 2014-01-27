package mindhub

class Diff {
	enum DiffType {
		ADDED, REMOVED, MODIFIED
	}
	
	DiffType type
	String nodeId
	String nodeContent
	String parentId
//	static hasOne = [node:Node]
	
    static constraints = {
    }
	
	static mapping = {
		nodeId column: 'nodeId'
		nodeContent column: 'nodeContent'
		parentId column: 'parentId'
	}
}
