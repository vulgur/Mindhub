package mindhub



import grails.test.mixin.*
import spock.lang.*

@TestFor(DocumentJSONController)
@Mock(DocumentJSON)
class DocumentJSONControllerSpec extends Specification {

    def populateValidParams(params) {
        assert params != null
        // TODO: Populate valid properties like...
        //params["name"] = 'someValidName'
    }

    void "Test the index action returns the correct model"() {

        when:"The index action is executed"
            controller.index()

        then:"The model is correct"
            !model.documentJSONInstanceList
            model.documentJSONInstanceCount == 0
    }

    void "Test the create action returns the correct model"() {
        when:"The create action is executed"
            controller.create()

        then:"The model is correctly created"
            model.documentJSONInstance!= null
    }

    void "Test the save action correctly persists an instance"() {

        when:"The save action is executed with an invalid instance"
            def documentJSON = new DocumentJSON()
            documentJSON.validate()
            controller.save(documentJSON)

        then:"The create view is rendered again with the correct model"
            model.documentJSONInstance!= null
            view == 'create'

        when:"The save action is executed with a valid instance"
            response.reset()
            populateValidParams(params)
            documentJSON = new DocumentJSON(params)

            controller.save(documentJSON)

        then:"A redirect is issued to the show action"
            response.redirectedUrl == '/documentJSON/show/1'
            controller.flash.message != null
            DocumentJSON.count() == 1
    }

    void "Test that the show action returns the correct model"() {
        when:"The show action is executed with a null domain"
            controller.show(null)

        then:"A 404 error is returned"
            response.status == 404

        when:"A domain instance is passed to the show action"
            populateValidParams(params)
            def documentJSON = new DocumentJSON(params)
            controller.show(documentJSON)

        then:"A model is populated containing the domain instance"
            model.documentJSONInstance == documentJSON
    }

    void "Test that the edit action returns the correct model"() {
        when:"The edit action is executed with a null domain"
            controller.edit(null)

        then:"A 404 error is returned"
            response.status == 404

        when:"A domain instance is passed to the edit action"
            populateValidParams(params)
            def documentJSON = new DocumentJSON(params)
            controller.edit(documentJSON)

        then:"A model is populated containing the domain instance"
            model.documentJSONInstance == documentJSON
    }

    void "Test the update action performs an update on a valid domain instance"() {
        when:"Update is called for a domain instance that doesn't exist"
            controller.update(null)

        then:"A 404 error is returned"
            response.redirectedUrl == '/documentJSON/index'
            flash.message != null


        when:"An invalid domain instance is passed to the update action"
            response.reset()
            def documentJSON = new DocumentJSON()
            documentJSON.validate()
            controller.update(documentJSON)

        then:"The edit view is rendered again with the invalid instance"
            view == 'edit'
            model.documentJSONInstance == documentJSON

        when:"A valid domain instance is passed to the update action"
            response.reset()
            populateValidParams(params)
            documentJSON = new DocumentJSON(params).save(flush: true)
            controller.update(documentJSON)

        then:"A redirect is issues to the show action"
            response.redirectedUrl == "/documentJSON/show/$documentJSON.id"
            flash.message != null
    }

    void "Test that the delete action deletes an instance if it exists"() {
        when:"The delete action is called for a null instance"
            controller.delete(null)

        then:"A 404 is returned"
            response.redirectedUrl == '/documentJSON/index'
            flash.message != null

        when:"A domain instance is created"
            response.reset()
            populateValidParams(params)
            def documentJSON = new DocumentJSON(params).save(flush: true)

        then:"It exists"
            DocumentJSON.count() == 1

        when:"The domain instance is passed to the delete action"
            controller.delete(documentJSON)

        then:"The instance is deleted"
            DocumentJSON.count() == 0
            response.redirectedUrl == '/documentJSON/index'
            flash.message != null
    }
}
