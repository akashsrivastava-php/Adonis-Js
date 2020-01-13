'use strict'
const { validate } = use('Validator')
class AdminController {

  async index({view, auth, response}){
    if(auth.user){
      response.redirect('/dash')
    }else{
      return view.render('login')
    }
  }

  async dash({view}){
    return view.render('adminDash')
  }

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
        return response.redirect('/dash')
      }
      catch(e){
        session.withErrors({ notification: 'Invalid username or password!' })
        return response.redirect('back')
      }
    }

  }

  async logout ({auth, response}){
    await auth.logout()
    response.redirect('/login')
  }

}

module.exports = AdminController
