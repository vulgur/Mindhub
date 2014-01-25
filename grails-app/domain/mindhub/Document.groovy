package mindhub

class Document {
//	static hasOne = [mindmap:Mindmap]
	String id
	String title
	Date createdDate
	Date modifiedDate
	Mindmap mindmap
	int x
	int y
	User owner
	List partners = []
	String originDocId
    static constraints = {
    }
}
