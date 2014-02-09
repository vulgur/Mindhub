import mindhub.User

class BootStrap {

    def init = { servletContext ->
		new User(username:"admin", password:"123").save()
		new User(username:"test", password:"123").save()
		new User(username:"boy", password:"123").save()
    }
    def destroy = {
    }
}
