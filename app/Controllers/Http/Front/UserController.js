'use strict'
const User = use('App/Models/User')
const { validate } = use('Validator')

class UserController {

  async login({request, auth, response, session}){
    const { username, password } = request.all()

    const rules = {
      username: 'required|email',
      password: 'required'
    }

    const validation = await validate(request.all(), rules)

    if(validation.fails()){
      session.withErrors(validation.messages())
      return response.redirect('back')
    }else{
      try{
        await auth.attempt(username, password)
        return response.redirect('/posts')
      }
      catch(e){
        session.withErrors({ notification: 'Invalid username or password!' })
        return response.redirect('back')
      }
    }

  }
}

module.exports = UserController
