package mindhub

class User {
	String username
	String password
	List documents
	
	String toString() {
		"$username"
	}
    static constraints = {
		username(blank:false,username:true)
		password(blank:false,password:true)
    }
}
