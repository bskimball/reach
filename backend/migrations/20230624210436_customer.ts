// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('customer', (table) => {
    table.increments('id')
    table.integer('number')
    table.string('name')
    table.string('type')
    table.datetime('since')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('customer')
}
