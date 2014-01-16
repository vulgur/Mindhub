package mindhub

class Diff {
	enum DiffType {
		ADDED, REMOVED, MODIFIED
	}
	
	DiffType type
	Node node
	
    static constraints = {
    }
}
