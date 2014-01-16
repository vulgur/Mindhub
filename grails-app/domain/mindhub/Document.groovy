package mindhub

class Document {
	String id
	String title
	Date createdDate
	Date modifiedDate
	Mindmap mindmap
	Point dimensions
	User owner
	List partners = []
    static constraints = {
    }
}
