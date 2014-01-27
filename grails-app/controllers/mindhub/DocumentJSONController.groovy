package mindhub



import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import groovy.json.JsonSlurper

@Transactional(readOnly = true)
class DocumentJSONController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]
//	def commitDoc() {
//		def jsonString = params.data
//		def slurper = new JsonSlurper()
//		def json = slurper.parseText(jsonString)
//		Document document = DocumentUtil.fromJSON(json)
//		DocumentJSON docJSON = new DocumentJSON()
//		docJSON.docId = document.id
//		docJSON.json = jsonString
//		docJSON.owner = document.owner
//		// TODO partners and origin of docJSON
//		if (document.originDocId) {
//			def origin = DocumentJSON.findWhere(docId:document.originDocId)
//			docJSON.origin = origin
//		}
//	}
	def saveDoc() {
		print "DocumentJSONController saveDoc() params.type="+params.type
		def jsonString = params.data
//		print "saveDoc: jsonString=" + jsonString
//		params.each {key, value ->
//			if(key!="action" && key!="controller" && key!="format") jsonString = key
//		}
		
		def slurper = new JsonSlurper()
		def json = slurper.parseText(jsonString)
//		print "saveDoc: json:" + json
		
		Document document = DocumentUtil.fromJSON(json)
//		print ("DocumentJSONController savDoc - node count="+document.mindmap.nodes.size())
		DocumentJSON docJSON = new DocumentJSON()
		docJSON.docId = document.id
		docJSON.json = jsonString
		docJSON.owner = document.owner
		// TODO partners and origin of docJSON
		if (document.originDocId) {
			def origin = DocumentJSON.findWhere(docId:document.originDocId)
			docJSON.origin = origin
		}
		// save or update
		def found = DocumentJSON.findByDocId(docJSON.docId)
		if (found){
			if (document.originDocId) {
				def origin = DocumentJSON.findWhere(docId:document.originDocId)
				found.origin = origin		
			}
			found.json = docJSON.json
//			print ("DocumentJSONController savDoc - found.json=" + found.json)
			if (update(found)) {
				if (params.type=='commit'){
					redirect (controller:'commit', action:'save',params:[username:document.owner.username, docId:document.id, originDocId:document.originDocId])		
				}	
				render "Updated!!!"
			}		
			else render "update failed!!!"
		} else {
			if (save(docJSON)){
				if (params.type=='commit'){
					redirect (controller:'commit', action:'save',params:[username:document.owner.username, docId:document.id, originDocId:document.originDocId])
				}
				render "Saved!!!"
			} 
			else render "save failed!!!"
		}
		
	}
    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond DocumentJSON.list(params), model:[documentJSONInstanceCount: DocumentJSON.count()]
    }

    def show(DocumentJSON documentJSONInstance) {
        respond documentJSONInstance
    }

    def create() {
        respond new DocumentJSON(params)
    }

    @Transactional
    def save(DocumentJSON documentJSONInstance) {
        if (documentJSONInstance == null) {
            notFound()
            return false
        }

        if (documentJSONInstance.hasErrors()) {
//            respond documentJSONInstance.errors, view:'create'
            return false
        }

        documentJSONInstance.save flush:true

//        request.withFormat {
//            form {
//                flash.message = message(code: 'default.created.message', args: [message(code: 'documentJSONInstance.label', default: 'DocumentJSON'), documentJSONInstance.id])
//                redirect documentJSONInstance
//            }
//            '*' { respond documentJSONInstance, [status: CREATED] }
//        }
		return true
    }

    def edit(DocumentJSON documentJSONInstance) {
        respond documentJSONInstance
    }

    @Transactional
    def update(DocumentJSON documentJSONInstance) {
        if (documentJSONInstance == null) {
            notFound()
            return false
        }

        if (documentJSONInstance.hasErrors()) {
//            respond documentJSONInstance.errors, view:'edit'
            return false
        }

        documentJSONInstance.save flush:true

//        request.withFormat {
//            form {
//                flash.message = message(code: 'default.updated.message', args: [message(code: 'DocumentJSON.label', default: 'DocumentJSON'), documentJSONInstance.id])
//                redirect documentJSONInstance
//            }
//            '*'{ respond documentJSONInstance, [status: OK] }
//        }
		return true
    }

    @Transactional
    def delete(DocumentJSON documentJSONInstance) {

        if (documentJSONInstance == null) {
            notFound()
            return
        }

        documentJSONInstance.delete flush:true

        request.withFormat {
            form {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'DocumentJSON.label', default: 'DocumentJSON'), documentJSONInstance.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'documentJSONInstance.label', default: 'DocumentJSON'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
