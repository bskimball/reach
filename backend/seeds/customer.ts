import { Knex } from 'knex'
import { faker } from '@faker-js/faker'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('customer').del()

  const typeOptions = ['residential', 'commercial']
  for (let i = 0; i < 100; i++) {
    await knex('customer').insert([
      {
        number: faker.number.int({ max: 999999 }),
        name: faker.person.fullName(),
        type: typeOptions[Math.floor(Math.random() * typeOptions.length)],
        since: faker.date.between({ to: new Date(), from: '1960-01-01T00:00:00.000Z' })
      }
    ])
  }

  // Inserts seed entries
  // await knex('customer').insert([
  //   { number: 123, name: 'John Doe', type: 'residential', since: dayjs().format() }
  // ])
}
