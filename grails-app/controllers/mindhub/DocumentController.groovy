package mindhub



import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import groovy.json.JsonSlurper

@Transactional(readOnly = true)
class DocumentController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]
	def getDoc() {
		User user = User.findWhere(username:"test")
		print "XXX User:" + user
		Document document = Document.findWhere(owner:user)
		assert (document)
		print document.id
		print document.title
		print document.createdDate
		print document.modifiedDate
		print document.mindmap.root.id
		print document.mindmap.root.content
		print document.mindmap.root.children.size()
		print document.owner.username
		print "nodes count:" + document.mindmap.nodes.size()
		render "Get~~~"
	}
    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond Document.list(params), model:[documentInstanceCount: Document.count()]
    }

    def show(Document documentInstance) {
        respond documentInstance
    }

    def create() {
        respond new Document(params)
    }

	def saveDoc() {
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
		print document.mindmap.root.id
		print document.mindmap.root.content
		print document.mindmap.root.children.size()
		print document.owner.username
		print "nodes count:" + document.mindmap.nodes.size()
		save(document)
		render "Saved!!!"
	}
    @Transactional
    def save(Document documentInstance) {
        if (documentInstance == null) {
            notFound()
            return
        }

        if (documentInstance.hasErrors()) {
            respond documentInstance.errors, view:'create'
            return
        }

        documentInstance.save flush:true

//        request.withFormat {
//            form {
//                flash.message = message(code: 'default.created.message', args: [message(code: 'documentInstance.label', default: 'Document'), documentInstance.id])
//                redirect documentInstance
//            }
//            '*' { respond documentInstance, [status: CREATED] }
//        }
    }

    def edit(Document documentInstance) {
        respond documentInstance
    }

    @Transactional
    def update(Document documentInstance) {
        if (documentInstance == null) {
            notFound()
            return
        }

        if (documentInstance.hasErrors()) {
            respond documentInstance.errors, view:'edit'
            return
        }

        documentInstance.save flush:true

        request.withFormat {
            form {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'Document.label', default: 'Document'), documentInstance.id])
                redirect documentInstance
            }
            '*'{ respond documentInstance, [status: OK] }
        }
    }

    @Transactional
    def delete(Document documentInstance) {

        if (documentInstance == null) {
            notFound()
            return
        }

        documentInstance.delete flush:true

        request.withFormat {
            form {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'Document.label', default: 'Document'), documentInstance.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'documentInstance.label', default: 'Document'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
