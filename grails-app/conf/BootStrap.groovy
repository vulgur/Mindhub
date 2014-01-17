import mindhub.User

class BootStrap {

    def init = { servletContext ->
		new User(username:"admin", password:"intel,123").save()
    }
    def destroy = {
    }
}
