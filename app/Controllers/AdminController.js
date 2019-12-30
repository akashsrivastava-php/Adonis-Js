'use strict'

class AdminController {

  async index({view}){
    return view.render('login')
  }

  async dash({view}){
    return view.render('adminDash')
  }

}

module.exports = AdminController
