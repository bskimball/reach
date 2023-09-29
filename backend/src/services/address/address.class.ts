// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Address, AddressData, AddressPatch, AddressQuery } from './address.schema'

export type { Address, AddressData, AddressPatch, AddressQuery }

export interface AddressParams extends KnexAdapterParams<AddressQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class AddressService<ServiceParams extends Params = AddressParams> extends KnexService<
  Address,
  AddressData,
  AddressParams,
  AddressPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mysqlClient'),
    name: 'address'
  }
}
