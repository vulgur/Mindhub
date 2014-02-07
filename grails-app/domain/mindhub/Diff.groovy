package mindhub

class Diff {
	enum DiffType {
		ADDED, REMOVED, MODIFIED
	}
	
	DiffType type
	String nodeJSON
	String nodeId
	String nodeContent
	String parentId
    static constraints = {
		parentId nullable:true
    }
	
	static mapping = {
		nodeId column: 'nodeId'
		nodeContent column: 'nodeContent'
		parentId column: 'parentId'
		nodeJSON type: 'text'
	}

}
