// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Customer, CustomerData, CustomerPatch, CustomerQuery } from './customer.schema'

export type { Customer, CustomerData, CustomerPatch, CustomerQuery }

export interface CustomerParams extends KnexAdapterParams<CustomerQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class CustomerService<ServiceParams extends Params = CustomerParams> extends KnexService<
  Customer,
  CustomerData,
  CustomerParams,
  CustomerPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mysqlClient'),
    name: 'customer'
  }
}
