'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExamsSchema extends Schema {
  up () {
    this.create('exams', (table) => {
      table.increments()
      table.integer('examtype_id').notNullable()
      table.string('name').notNullable()
      table.boolean('status').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('exams')
  }
}

module.exports = ExamsSchema
