package mindhub
import grails.converters.JSON;
import groovy.json.JsonSlurper

class MindmapController {
	static layout = ""
	def fork() {
		String originDocId = params.originDocId
		String username = params.username
		def originDocJSON = DocumentJSON.findWhere(docId:originDocId)
		assert(originDocJSON)
		originDocJSON.partners.add(username)
		originDocJSON.save()
		def partners = originDocJSON.partners
		params.put("partners", partners)
		print params
		respond params
	}
    def create() {
		print "MindmapController create() params.username=" + params.username
		// mock a document and partners list
//		Document currentDoc = new Document()
//		List partners = currentDoc.partners
//		partners.add(new User(username:"John"))
//		partners.add(new User(username:"Mary"))
//		partners.add(new User(username:"Lisa"))
//		partners.add(new User(username:"Ben"))
//		params.put("partners", partners)
		respond params
	}
	
	def edit() {
		print "MindmapController edit() params.username=" + params.username
		print "MindmapController edit() params.docId=" + params.docId
		print "MindmapController edit() params.isOrigin=" + params.isOrigin
		redirect (action:'create', params:params)
	}
	def save() {
		print "got here!"

		def jsonString
		
		params.each {key, value ->
			if(key!="action" && key!="controller" && key!="format") jsonString = key
		}
		
		def slurper = new JsonSlurper()
		def json = slurper.parseText(jsonString)
		print json
		
		json.each {
			print it
		}
		
		Document document = DocumentUtil.fromJSON(json)
		print document.id
		print document.title
		print document.createdDate
		print document.modifiedDate
		print document.dimensions.x
		print document.dimensions.y
		print document.mindmap.root.id
		print document.mindmap.root.content
		print document.mindmap.root.children.size()
		print document.owner.username
		print "nodes count:" + document.mindmap.nodes.size()
		render "Saved!!!"
	}
	
	def showPartners() {
		Document doc = params.document
		List partners = doc.partners
		render partners as JSON
	}
}
