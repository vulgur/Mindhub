package mindhub

class Commit {
	Date commitDate
	User committer
	Diff diff
	Document document
	List prev
    static constraints = {
    }
}
