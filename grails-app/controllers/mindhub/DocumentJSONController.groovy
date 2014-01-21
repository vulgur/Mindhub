package mindhub



import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import groovy.json.JsonSlurper

@Transactional(readOnly = true)
class DocumentJSONController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]
	def saveDoc() {
		print "got here!"

		def jsonString
		
		params.each {key, value ->
			if(key!="action" && key!="controller" && key!="format") jsonString = key
		}
		
		def slurper = new JsonSlurper()
		def json = slurper.parseText(jsonString)
		print "saveDoc: json:" + json
		
		DocumentJSON docJSON = new DocumentJSON()
		docJSON.json = json
		Document document = DocumentUtil.fromJSON(json)

		docJSON.json = jsonString
		docJSON.owner = document.owner
		// TODO partners and origin of docJSON
		save(docJSON)
		render "Saved!!!"
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
            return
        }

        if (documentJSONInstance.hasErrors()) {
            respond documentJSONInstance.errors, view:'create'
            return
        }

        documentJSONInstance.save flush:true

//        request.withFormat {
//            form {
//                flash.message = message(code: 'default.created.message', args: [message(code: 'documentJSONInstance.label', default: 'DocumentJSON'), documentJSONInstance.id])
//                redirect documentJSONInstance
//            }
//            '*' { respond documentJSONInstance, [status: CREATED] }
//        }
		render "saved!!!"
    }

    def edit(DocumentJSON documentJSONInstance) {
        respond documentJSONInstance
    }

    @Transactional
    def update(DocumentJSON documentJSONInstance) {
        if (documentJSONInstance == null) {
            notFound()
            return
        }

        if (documentJSONInstance.hasErrors()) {
            respond documentJSONInstance.errors, view:'edit'
            return
        }

        documentJSONInstance.save flush:true

        request.withFormat {
            form {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'DocumentJSON.label', default: 'DocumentJSON'), documentJSONInstance.id])
                redirect documentJSONInstance
            }
            '*'{ respond documentJSONInstance, [status: OK] }
        }
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
