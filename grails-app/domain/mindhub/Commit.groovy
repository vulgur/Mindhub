package mindhub

class Commit {
	String key
	Date commitDate
	User committer
	Diff diff
	Document document
	List prev
    static constraints = {
    }
}
