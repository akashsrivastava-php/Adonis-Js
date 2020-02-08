'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Examtype extends Model {
    exams () {
        return this.hasMany('App/Models/Exam')
    }
}

module.exports = Examtype
