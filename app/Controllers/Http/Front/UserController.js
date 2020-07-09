'use strict'
const User = use('App/Models/User')
const Tempuser = use('App/Models/Tempuser')
const { validate } = use('Validator')
const Mail = use('Mail')
const Encryption = use('Encryption')
const Env = use('Env')

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
        session.flash({ error: 'Invalid username or password!' })
        return response.redirect('back')
      }
    }

  }

  async register({request, auth, response, session}){
    const { username, email, password, cpassword } = request.all()

    const rules = {
      username: 'required',
      password: 'required',
      cpassword: 'required|same:password',
      email: 'required|email|unique:users,email'
    }

    const validation = await validate(request.all(), rules)

    if(validation.fails()){
      session.flash({error: validation.messages()[0].message})
      return response.redirect('back')
    }else{
      const user = new Tempuser()
      user.username = username
      user.email = email
      user.password = password
      await user.save()
      user.url = `${Env.get('APP_URL')}/verify-email/${Encryption.encrypt(user.id)}`
      try{
        await Mail.send('emails.welcome', user.toJSON(), (message) => {
          message
            //.to(user.email)
            .to('akashsrivastava948@gmail.com')
            .from('yardstick@gmail.com')
            .subject('Please confirm your email')
        })
        session.flash({ success: 'Verification mail sent to your email.' })
        return response.redirect('back')
      }
      catch(e){
        session.flash({ error: 'Something went wrong!' })
        return response.redirect('back')
      }
    }

  }

  async verifyMail({request, response, session, params}){
    const { token } = params
    const id = Encryption.decrypt(token)
    try{
      const userdata = await Tempuser.findOrFail(id)
      const user = new User()
      user.username = userdata.username
      user.email = userdata.email
      user.password = userdata.password
      user.role_id = 3
      await user.save()
      await userdata.delete()
      session.flash({ success: 'Email verified, please login.' })
      return response.redirect('/login')
    }catch(e){
      session.flash({ error: 'Confirmation link has been expired!' })
      return response.redirect('/register')
    }
  }

  async forgot({ request, response, auth, session }){
    const { email } = request.all()
    try{
      const user = await User.findByOrFail('email', email)
      try{
        const pass = Buffer.from(user.email).toString('base64')
        user.password = pass
        await user.save()
        user.pass = pass
        await Mail.send('emails.forgot', user.toJSON(), (message) => {
          message
            //.to(user.email)
            .to('akashsrivastava948@gmail.com')
            .from('yardstick@gmail.com')
            .subject('Temporary Password')
        })
        session.flash({success: 'Temporary password has been sent on your email.'})
      }catch(e){
        session.flash({error: 'Something went wrong!'})
      }
    }catch(e){
      session.flash({error: 'Email not found!'})
    }
    return response.redirect('back')
  }

}

module.exports = UserController
