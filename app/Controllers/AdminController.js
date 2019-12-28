'use strict'

class AdminController {

  async index({view}){
    return view.render('adminDash')
  }
}

module.exports = AdminController
