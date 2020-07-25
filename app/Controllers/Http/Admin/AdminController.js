'use strict'
const { validate } = use('Validator')
class AdminController {

  async index({view, auth, response}){
    if(auth.user){
      response.redirect('dash')
    }else{
      return view.render('admin/login')
    }
  }

  async dash({view}){
    return view.render('admin/adminDash')
  }

  async login({request, auth, response, session}){
    const { username, password } = request.all()

    const rules = {
      username: 'required|email',
      password: 'required'
    }

    const validation = await validate(request.all(), rules)

    if(validation.fails()){
      session.flash({error: validation.messages()[0].message})
      return response.redirect('back')
    }else{
      try{
        await auth.attempt(username, password)
        const redirecturl = session.pull('redirecturl')
        return response.redirect(redirecturl ? redirecturl : 'dash')
      }
      catch(e){
        session.flash({error: 'Invalid username or password!' })
        return response.redirect('back')
      }
    }

  }

  async logout ({auth, response}){
    await auth.logout()
    response.redirect('login')
  }

}

module.exports = AdminController
