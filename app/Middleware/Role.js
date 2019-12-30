'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const User = use('App/Models/User')
class Role {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ auth, response }, next, properties) {
    // call next to advance the request
    const user = await User.find(auth.user.id)
    const roledata = await user.role().fetch()
    if(properties.indexOf(roledata.name) !== -1){
      await next()
    }else{
      response.redirect('/login')
    }
  }
}

module.exports = Role
