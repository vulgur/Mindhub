package mindhub



import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import groovy.json.JsonSlurper

@Transactional(readOnly = true)
class UserController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]
	
	def login() {}
	
	def main() {
		def owner = User.findByUsername(params.user)
		def results = DocumentJSON.findAllByOwner(owner)
		print "main: result size:" + results.size()
		List docList = []
		for (docJSON in results) {
			String jsonString = docJSON.json
			def slurper = new JsonSlurper()
			def json = slurper.parseText(jsonString)
			Document doc = DocumentUtil.fromJSON(json)
//			DocumentUtil.printDocument(doc)
			docList.add(doc)
		}
		print "main: docList size:" + docList.size()
		[docList:docList,username:owner.username]
	}
	
	def doLogin() {		
		def user = User.findWhere(username:params['username'],
			password:params['password'])
		if (user) {
			session.user = user
			print user
			redirect(action:'main', params:[user:user.username])
//			redirect(controller:"mindmap", params:[user:user.username])
//			redirect(uri:"index.gsp")
//			redirect(uri: "/main/index")
		} else {
			print "cannot found"
			redirect(controller:'user',action:'login')
		}
	}
	
    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond User.list(params), model:[userInstanceCount: User.count()]
    }

    def show(User userInstance) {
        respond userInstance
    }

    def create() {
        respond new User(params)
    }

    @Transactional
    def save(User userInstance) {
        if (userInstance == null) {
            notFound()
            return
        }

        if (userInstance.hasErrors()) {
            respond userInstance.errors, view:'create'
            return
        }

        userInstance.save flush:true

        request.withFormat {
            form {
                flash.message = message(code: 'default.created.message', args: [message(code: 'userInstance.label', default: 'User'), userInstance.id])
                redirect userInstance
            }
            '*' { respond userInstance, [status: CREATED] }
        }
    }

    def edit(User userInstance) {
        respond userInstance
    }

    @Transactional
    def update(User userInstance) {
        if (userInstance == null) {
            notFound()
            return
        }

        if (userInstance.hasErrors()) {
            respond userInstance.errors, view:'edit'
            return
        }

        userInstance.save flush:true

        request.withFormat {
            form {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'User.label', default: 'User'), userInstance.id])
                redirect userInstance
            }
            '*'{ respond userInstance, [status: OK] }
        }
    }

    @Transactional
    def delete(User userInstance) {

        if (userInstance == null) {
            notFound()
            return
        }

        userInstance.delete flush:true

        request.withFormat {
            form {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'User.label', default: 'User'), userInstance.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'userInstance.label', default: 'User'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
