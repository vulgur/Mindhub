package mindhub

class DocumentJSON {
	String json
	User owner
	List partners = []
	DocumentJSON origin
    static constraints = {
    }
	static mapping = {
		json type: 'text'
	 }
}
