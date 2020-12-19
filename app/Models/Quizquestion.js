'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Quizquestion extends Model {
    quiz () {
        return this.belongsTo('App/Models/Quiz')
    }
}

module.exports = Quizquestion
