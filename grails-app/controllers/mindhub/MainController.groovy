package mindhub
import grails.converters.JSON;
import groovy.json.JsonSlurper

class MainController {

    def index() {}
	
	def save() {
		print "got here!"

		def jsonString
//		def data = params
//		print data
//		
//		def slurper = new JsonSlurper()
//		def result = slurper.parseText(params)
//		print result
		
		params.each {key, value ->
			if(key!="action" && key!="controller" && key!="format") jsonString = key
		}
		
//		def builder = new groovy.json.JsonBuilder()
//		def root = builder.doc{json}
//		assert root instanceof Map
//		print root.toString()
		
		def slurper = new JsonSlurper()
		def json = slurper.parseText(jsonString)
		print json
		
		json.each {
			print it
		}
		
		Document document = MindhubUtil.fromJSON(json)
		print document.id
		print document.title
		print document.createdDate
		print document.modifiedDate
		print document.dimensions.x
		print document.dimensions.y
		print document.mindmap.root.id
		print document.mindmap.root.content
		print document.mindmap.root.children.size()
		print "nodes count:" + document.mindmap.nodes.size()
		render "Saved!!!"
	}
	
	int nodeCount(Node node) {
		if (node.children == null || node.children.size() == 0) {
			return 0
		}
		int count = 0;
		print "children count:" + node.children.size()
		for (Node child in node.children) {
			print child.content
			print "children count:" + child.children.size()
			count =  1+nodeCount(child)
		}
		return count
	}
}
