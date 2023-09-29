import { Knex } from 'knex'
import { faker } from '@faker-js/faker'

const typeOptions = ['primary', 'vacation', 'rental', 'office']

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('address').del()

  for (let i = 0; i < 130; i++) {
    let customerId = faker.number.int({ min: 1, max: 100 })
    let type = typeOptions[Math.floor(Math.random() * typeOptions.length)]
    let street = faker.location.streetAddress()
    let city = faker.location.city()
    let state = faker.location.state({ abbreviated: true })
    let zip = faker.location.zipCode()
    let country = 'US'

    await knex('address').insert({ customerId, type, street, city, state, zip, country })
  }
}
