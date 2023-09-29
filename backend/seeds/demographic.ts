import { Knex } from 'knex'
import { faker } from '@faker-js/faker'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('demographic').del()

  for (let i = 0; i < 600; i++) {
    const demographicTypeId = faker.number.int({ min: 1, max: 16 })
    let text = faker.lorem.sentence()
    let customerId = faker.number.int({ min: 1, max: 100 })
    let customer = await knex('customer').where({ id: customerId }).first()
    const lastName = customer ? customer.name.split(' ')[customer.name.split(' ').length - 1] : ''

    switch (demographicTypeId) {
      case 1:
      case 9:
        text = faker.person.fullName({ sex: 'male', lastName })
        break
      case 2:
      case 6:
      case 10:
        text = faker.word.noun()
        break
      case 3:
      case 4:
      case 7:
      case 8:
      case 11:
      case 12:
      case 15:
      case 16:
        text = faker.lorem.sentence()
        break
      case 5:
      case 13:
        text = faker.person.fullName({ sex: 'female', lastName })
    }

    console.log(text)

    await knex('demographic').insert([
      {
        demographicTypeId,
        significantDate: faker.date.anytime(),
        customerId,
        text
      }
    ])
  }
}
