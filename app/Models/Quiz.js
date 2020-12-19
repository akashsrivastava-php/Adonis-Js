'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Quiz extends Model {
    questions () {
        return this.hasMany('App/Models/Quizquestion')
    }
}

module.exports = Quiz
