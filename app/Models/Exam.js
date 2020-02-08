'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Exam extends Model {
    examType () {
        return this.belongsTo('App/Models/Examtype')
    }
}

module.exports = Exam
