import { user } from './users/users'
import { address } from './address/address'
import { demographicType } from './demographic-type/demographic-type'
import { demographic } from './demographic/demographic'
import { customer } from './customer/customer'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(user)
  app.configure(address)
  app.configure(demographicType)
  app.configure(demographic)
  app.configure(customer)
  // All services will be registered here
}
