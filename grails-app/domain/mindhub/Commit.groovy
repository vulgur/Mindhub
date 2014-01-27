package mindhub

class Commit {
//	String key
	Date commitDate
	User committer
	static hasMany = [diffs:Diff]
	DocumentJSON origin
	DocumentJSON modified
//	Commit prev
	boolean isRead
    static constraints = {
    }
}
