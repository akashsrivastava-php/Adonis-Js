'use strict'

const User = use('App/Models/User')
const Role = use('App/Models/Role')
const { validate } = use('Validator')

class UserController {

  async listUsers({view, auth, response, params, request}){
    const query = request.get()
   const page = params.page ? params.page : 1
   const data = await User
   .query()
   .with('role')
   .where(function () {
     this
     .where('role_id', '!=', 1)
     .where('id', '!=', auth.user.id)
     .where(query.search, 'LIKE', '%'+query.keyword+'%')
  }).paginate(page,10)
    return view.render('user/list', {data: data.toJSON()})
  }

  async addUsersForm({view, response}){
    const data = await Role.all()
    return view.render('user/add', {data: data.toJSON()})
  }

  async addUsers({request, response, session}){
    const { name, password, email, role } = request.all()
    const rules = {
      name: 'required',
      email: 'required|email',
      password: 'required',
    }
    const validation = await validate(request.all(), rules)
    if(validation.fails()){
      session.withErrors(validation.messages())
      return response.redirect('back')
    }else{
      const user = new User()
      user.username = name
      user.email = email
      user.password = password
      user.role_id = role ? role : 3
      await user.save()
      return response.redirect('/list-users')
    }
  }

  async editUser({params,view}){
    const user = await User.find(params.id)
    const role = await Role.all()
    return view.render('user/edit', {user: user.toJSON(), role: role.toJSON()})
  }

  async updateUser({params,response,session,request}){
    const { name, password, email, role } = request.all()
    const rules = {
      name: 'required',
      email: 'required|email',
    }
    const validation = await validate(request.all(), rules)
    if(validation.fails()){
      session.withErrors(validation.messages())
      return response.redirect('back')
    }else{
      const id = params.id
      const user = await User.find(id)
      user.username = name
      user.email = email
      user.role_id = role
      if(password){
        user.password = password
      }
      await user.save()
      return response.redirect('/list-users')
    }
  }

  async deleteUser({response, params}){
    const { id } = params
    const user = await User.find(id)
    await user.delete()
    return response.redirect('/list-users')
  }

}

module.exports = UserController
