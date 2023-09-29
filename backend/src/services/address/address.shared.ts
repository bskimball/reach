// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Address, AddressData, AddressPatch, AddressQuery, AddressService } from './address.class'

export type { Address, AddressData, AddressPatch, AddressQuery }

export type AddressClientService = Pick<AddressService<Params<AddressQuery>>, (typeof addressMethods)[number]>

export const addressPath = 'address'

export const addressMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const addressClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(addressPath, connection.service(addressPath), {
    methods: addressMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [addressPath]: AddressClientService
  }
}
