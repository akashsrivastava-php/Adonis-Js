'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExamtypesSchema extends Schema {
  up () {
    this.create('examtypes', (table) => {
      table.increments()
      table.string('name', 255).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('examtypes')
  }
}

module.exports = ExamtypesSchema
