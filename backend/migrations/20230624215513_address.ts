// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('address', (table) => {
    table.increments('id')
    table.integer('customerId')
    table.string('type')
    table.string('street')
    table.string('unit')
    table.string('city')
    table.string('state')
    table.string('zip')
    table.string('country')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('address')
}
