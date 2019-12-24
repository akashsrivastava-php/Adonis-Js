'use strict'
const User = use('App/Models/User')
const { validate } = use('Validator')

class UserController {

  async get({auth}){
    return auth.user
  }

  async create({request, response, auth}){
    const { name, email, password } = request.body

    const user = new User()

    user.username = name
    user.email = email
    user.password = password
    await user.save()
    const token = await auth.generate(user)
    return token
  }

  async login({request, auth, response}){

    const rules = {
      email: 'required|email',
      password: 'required'
    }

    const validation = await validate(request.all(), rules)

    if(validation.fails()){
      return validation.messages()
    }else{
      const { email, password } = request.body
      await auth.logout()
      try {
        if (await auth.attempt(email, password)) {
          let user = await User.findBy('email', email)
          let accessToken = await auth.authenticator('jwt').generate(user)
          return response.json({"user":user, "access_token": accessToken})
        }
      }
      catch (e) {
        return response.json({message: 'You first need to register!'})
      }
    }
  }
}

module.exports = UserController
