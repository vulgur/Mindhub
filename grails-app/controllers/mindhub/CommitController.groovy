package mindhub

import groovy.json.JsonSlurper

class CommitController {
	List history
	
	def renderHistory() {}
	
	def merge() {}
	
	def showHistoryList() {}
	
	def showCommitter(commit) {}
	
	def showDiff(diff) {}
	
	def save() {
//		print "CommitController save() params="+params
		Commit commit = new Commit()
		def docId = params.docId
		def originDocId = params.originDocId
		def username = params.username
		// get doc json
		def originDocJSON = DocumentJSON.findWhere(docId:originDocId)
		def modifiedDocJSON = DocumentJSON.findWhere(docId:docId)
		// form document object
		def slurper = new JsonSlurper()
		def originJson = slurper.parseText(originDocJSON.json)
		def modifiedJson = slurper.parseText(modifiedDocJSON.json)
		Document originDoc = DocumentUtil.fromJSON(originJson)
		Document modifiedDoc = DocumentUtil.fromJSON(modifiedJson)
		// get diffList
		def diffList = DocumentUtil.getDiffList(originDoc, modifiedDoc);
		commit.diffs = diffList
		// print diffList
		// get committer
		User committer = User.findWhere(username:username)
		commit.committer = committer
		// get commit date
		commit.commitDate = modifiedDoc.modifiedDate
		// set jsons
		commit.origin = originDocJSON
		commit.modified = modifiedDocJSON
		// set read
		commit.isRead = false
		
		// save commit
		commit.save()
		render "Commit saved!!!"
	}
	
	def getLastCommit() {}
	
	def getCommit(key) {}
}
